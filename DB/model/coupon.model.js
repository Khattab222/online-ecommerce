import { Schema, model } from "mongoose";



 const couponSchema = new Schema({
    code:{
        type:String,
        unique:true,
        required:true      
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
       
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        default:1,
        required:true
    },
    couponStatus:{
        type:String,
        default:'valid',
        enum:['valid','expired']
    },
    fromDate:{
        type:String,
        required:[true,'please enter fromdate field']
    },
    toDate:{
        type:String,
        required:[true,'please enter todate field']
    },
    usagePerUser:[{
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        maxUsage:{
            type:Number,
            required:true
        },
        usageCount:{
            type:Number,
            default:0
        }
    }]
},{
    timestamps:true
})

const couponModel = model.Coupon || model('Coupon',couponSchema);
export default couponModel;