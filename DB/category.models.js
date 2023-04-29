import mongoose, { Schema, model } from "mongoose";


const categorySchema = new Schema({
name:{
    type:String,
    required:true,
    unique:true
},
image:{
    path:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    }
},
createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:false // convert to true after first cycle
},
updatedBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:false
},
slug:{
    type:String,
    required:true
},
customId:String

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})

categorySchema.virtual('subCategories',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'categoryId'
})
const categoryModel = model.Category || model('Category',categorySchema);


export default categoryModel;