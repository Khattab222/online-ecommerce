import couponModel from "../../../DB/model/coupon.model.js";
import * as controller from "../coupon/controller/coupon.controller.js";
import productModel from './../../../DB/model/product.model.js';
import orderModel from './../../../DB/model/order.model.js';
import cartModel from './../../../DB/model/cart.model.js';





export const creatOrder  = async (req,res,next) => {
    const userId = req.user._id;
    const {products , couponCode , address,phone,paymentMethod} = req.body;
    // coupon validation
    if (couponCode) {
        const coupon = await couponModel.findOne({code:couponCode});
        if (!coupon) {
            return next (new Error('in-valid coupon code', {cause:400}))
        }
        const {expired,matched,exceed} = controller.couponValidation(coupon,userId);
                                                                
        if (!matched) {
            return next (new Error('you can not use this coupon ', {cause:400}))   
        }
        if (exceed) {
            return next (new Error('you exced the max usage of  this coupon ', {cause:400}))   
        }
        if (expired) {
            return next (new Error('coupon expired', {cause:400}))   
        }
        req.body.coupon = coupon
    }

    // if no products check cart products
    if (!products?.length) {
        const cartExist = await cartModel.findOne({userId});
        if (!cartExist?.products?.length) {
            return next (new Error('empty cart', {cause:400}))  
        }
        req.body.fromCart = true
        req.body.products = cartExist.products
    }

    let subTotal = 0
    let finalProducts = [];
    let productsIds = []
    //[{productId,quantity}]
    for (let product of req.body.products) {
        const findProduct = await productModel.findOne({
            _id:product.productId,
            stock:{$gte:product.quantity},
            isDeleted:false
        })
        if (!findProduct) {
            return next(new Error('invalid product id',{cause:400}))
        }
        if (req.body.fromCart) {
            
            product= product.toObject()
        }
        product.name=findProduct.name
        product.productPrice = findProduct.priceAfterDiscount
        product.finalPrice = Number.parseFloat(findProduct.priceAfterDiscount*product.quantity).toFixed(2)
        finalProducts.push(product)
        productsIds.push(product.productId)
        subTotal += parseInt(product.finalPrice)
    }
    paymentMethod == 'cash'? req.body.orderStatus = 'placed': req.body.orderStatus = 'pending'
  const orderobject = {
    userId,
    products:finalProducts,
    address,
    phone,
    couponId:  req.body.coupon?._id,
    subTotal,
    totalPrice:Number.parseFloat(subTotal*(1-((req.body.coupon?.amount || 0)/100))).toFixed(2),
    paymentMethod,
    orderStatus:req.body.orderStatus

  }
  const newOrder = await orderModel.create(orderobject)
  if (newOrder) {
      // icrease user coupon  usage
      if (req.body.coupon) {
       for (const user of req.body.coupon.usagePerUser) {
        if (user.userId.toString() == userId.toString() ) {
            user.usageCount +=1
        }
       }
       await req.body.coupon.save()
      }

    // decrement product stock
    for (const product of req.body.products) {
        await productModel.findByIdAndUpdate(product.productId,{
            $inc:{stock:- parseInt(product.quantity)}
        })
    }

    // pull product from cart 
    await cartModel.findOneAndUpdate({userId},{
        $pull:{products:{productId:{$in:productsIds}}}
    })
  }
  res.status(201).json({message:'success',newOrder})



}



export const cancelOrder = async (req, res, next) => {
    const { orderId } = req.params
    const { reason } = req.body
    const order = await orderModel.findById(orderId)
    if ((order?.orderStatus != 'placed' && order?.paymentMethod == 'cash') ||
        (!['confirmed', 'pending'].includes(order?.orderStatus) && order?.paymentMethod == 'card')) {
        return next(new Error(`you canot cancell this order with status ${order.orderStatus}`, { cause: 400 }))
    }
    order.orderStatus = 'cancelled'
    order.reason = reason
    order.upadtedBy = req.user._id
    const orderCancelled = await order.save()
    if (orderCancelled) {
        if (order.couponId) {
            const coupon = await couponModel.findById(order.couponId)
            for (const user of coupon?.usagePerUser) {
                if (user.userId.toString() == order.userId.toString()) {
                    user.usageCount -= 1
                }
            }
            await coupon.save()
        }
        // decrement stock => quantity
        for (const product of order.products) {
            await productModel.findByIdAndUpdate(product.productId, {
                $inc: { stock: parseInt(product.quantity) }
            })
        }
        res.status(200).json({ message: "order cancelled succesfully" })
    }
}