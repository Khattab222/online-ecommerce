import { Schema, model } from "mongoose";



 const brandSchema = new Schema({
    name:{
        type:String,
        required:true      
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:false
    },
    logo:{
        path:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required:true
        }
    },
    subCategoryId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    customId:String
},{
    timestamps:true
})

const brandModel = model.Brand || model('Brand',brandSchema);
export default brandModel;