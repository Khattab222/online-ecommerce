import mongoose, { Schema, model } from "mongoose";


const subCategorySchema = new Schema({
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
    required:true // convert to true after first cycle
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
customId:String,
categoryId:{
    type:Schema.Types.ObjectId,
    ref:'Category',
    required:false // convert to true after first cycle
}

},{
    timestamps:true
})

const subCategoryModel = model.subCategory || model('SubCategory',subCategorySchema);


export default subCategoryModel;