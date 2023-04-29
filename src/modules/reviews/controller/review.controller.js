import orderModel from "../../../../DB/model/order.model.js";
import reviewModel from "../../../../DB/model/review.model.js";

// creat review 
export const creatReview = async (req,res,next) => {
  const {productId}= req.params;

const {comment,rating}= req.body
  const order = await orderModel.findOne({
    userId:req.user._id,
    orderStatus:'delivered',
    'products.productId':productId

})
if (!order) {
    return next(new Error('can not review product before recieved',{cause:400}))
}
  const checkReview = await reviewModel.findOne({createdBy:req.user._id,productId,orderId:order._id});
  if (checkReview) {
    return next(new Error('already reviewed by you',{cause:400})) 
  }
  const newReview = await reviewModel.create({
    comment,
    rating,
    createdBy:req.user._id,
    orderId:order._id,
    productId
  })
  res.status(201).json({message:'done',newReview})
}


//update review 
export const updateReview = async (req,res,next) => {
    const {productId,reviewId}= req.params;
const {comment,rating}= req.body
  
  const review = await reviewModel.findOneAndUpdate({_id:reviewId,productId},{
    comment,
    rating,
  },{new:true})
   if (!review) {
    return next(new Error('fail update',{cause:400})) 
    
   }
   res.status(201).json({message:'update done',review})
  }
