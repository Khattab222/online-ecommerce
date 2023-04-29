import { Schema, model } from "mongoose";



 const reviewSchema = new Schema({
    comment:{
        type:String,
        required:true      
    },
    rating:{
        type:Number,
        required:true ,
        min:1,
        max:5     
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:false
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    orderId:{
        type:Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    
    
},{
    timestamps:true
})

const reviewModel = model.Review || model('Review',reviewSchema);
export default reviewModel;