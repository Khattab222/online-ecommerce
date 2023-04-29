
import { Schema, Types, model } from "mongoose";
import { hashFunction } from "../../src/utils/HashAndCompare.js";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },

    isActive: {
        type: Boolean,
        default: false,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    isLogedIn:{
        type:Boolean,
        default:false
    },
    image: {
        path:{
            type:String,

        },
        public_id:{
            type:String
        }
    },
    DOB: String,
    forgetCode:String,
    changePassword:Number,
    wishList:{
        type:[{type:Types.ObjectId,ref:'Product'}]
    }
}, {
    timestamps: true
})

userSchema.pre('save',function (next,doc) {
    this.password = hashFunction({payload:this.password});
    next();
})

const userModel =model.User || model('User', userSchema)
export default userModel