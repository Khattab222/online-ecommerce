import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";



export const addToCart = async (req,res,next) => {
  const userId = req.user._id
  const {productId,quantity} = req.body;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error('invalid productId', {cause:400}))
  }
  if (product.stock<quantity || product.isDeleted ) {
    await productModel.findByIdAndUpdate(productId,{
        $addToSet:{
            userAddToWishList:userId
        }
    })
    return next(new Error('product not available', {cause:400}))
  }

  const cart = await cartModel.findOne({userId});
  if (!cart) {
    const savedCart = await cartModel.create({
        userId,
        products:[{productId,quantity}]
    })
    return res.status(201).json({message:'done',savedCart})
  }
  let isProductExist = false
  for (const product of cart.products) {
    if (product.productId.toString() ==productId ) {
        product.quantity = quantity;
        isProductExist = true
        break;
    }
  }
  if (!isProductExist) {
    cart.products.push({productId,quantity})
  }
  await cart.save()
  res.status(201).json({message:'done',cart})


}

export const deleteItemsFunc =async (productIds,userId) => {
  const cart =await  cartModel.updateOne({userId},{
    $pull:{
      products:{
        productId:{$in:productIds}
      }
    }
  })
  return cart
}


// delete items from cart
export const deleteItems = async (req,res,next) => {
  const {productIds} = req.body;
const cart =await deleteItemsFunc(productIds,req.user._id)
if (!cart.modifiedCount) {
  return next(new Error('fail', {cause:400}))

}
return res.status(200).json({message:'done',cart})
}



// empty cart from products
export const emptyCart = async (req,res,next) => {

const cart =await cartModel.findOneAndUpdate({userId:req.user._id},{
  products:[]
})

return res.status(200).json({message:'done',cart})
}

