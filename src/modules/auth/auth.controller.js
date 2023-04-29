import { customAlphabet } from "nanoid";
import userModel from "../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../utils/GenerateAndVerifyToken.js";
import { compareFunction, hashFunction } from "../../utils/HashAndCompare.js";
import sendEmail from "../../utils/sendEmail.js";

const nanoId = customAlphabet('123489fdfdf', 6)

// sign up
export const signup = async (req, res, next) => {
    const { userName, phone, email, password,DOB } = req.body;
  
    const match = await userModel.find({ email });
    if (!match.length) {
     
      
        const newUser = new userModel({
            userName,
          phone,
          email,
          password,
          DOB
        });
        const token = generateToken({ payload: { id: newUser._id } });
     
        const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirmemail/${token}`;
        const sentEmail = await sendEmail({
          to: newUser.email,
          message: `<a href=${confirmationLink}>click to confirm </a>`,
          subject: "Confirm your email",
        });
        if (sentEmail) {
          await newUser.save();
          return res.status(201).json({ message: " sign up success , please confirm from your email" });
        } else {
           next(new Error("unknownerror please try again later"));
        }
       
    } else {
      next(new Error("email already exists", { cause: 409 }));
    }
  };
  
  
  // confirm email
  export const confirmemail = async (req,res,next) => {
    const {token} = req.params;
    const decode = verifyToken({token});
    if (decode?.id) {
      const user = await userModel.findOneAndUpdate({_id:decode.id, isConfirmed:false},{ isConfirmed:true});
      if (user) {
          return res.status(200).json({message:'confirmation  success',decode})
      }
      return res.status(200).json({message:'user already confirmed '}) 
    }else{
      res.next(new Error('invalid token ' ,{cause:400}))
    }
    
  }
  
  
  // login 
  export const login = async (req,res,next) => {
    const {email,password}= req.body;
    const emailexists = await userModel.findOne({email});
  
    if(!emailexists){
    return  next(new Error('invalid email or password'))
    }
    
    const match = compareFunction({payload:password,hashValue:emailexists.password});
    if (match) {
  
      if (emailexists.isConfirmed) {
        const updateuser = await userModel.findOneAndUpdate({email},{isLogedIn:true},{new:true})
        const token = generateToken({payload:{id:emailexists._id, userName:emailexists.userName,isLogedIn:updateuser.isLogedIn ,email:emailexists.email,phone:emailexists.phone}});
      if (token) {
        res.status(200).json({message:'login success',token})
      }else{
        next(new Error('token generation failed'));
      } 
      }else{
            //  res.status(200).json({message:'please confirm activation from your email'})
        next(new Error('please confirm  your email and try to login',{cause:400}));

      }
  
    }else{
      next(new Error('invalid email or password'))
    }
  }
  

  // forget password
  export const sendCode = async (req,res,next) => {
    const {email} = req.body;
    const user = await userModel.findOne({email,isConfirmed:true});
    if (!user) {
      return next (new Error('email not exist ' , {cause:400}))
    }
    const forgetCode = nanoId();
    const message = `<P>OTP is ${forgetCode}</P>`
    const sentEmail = await sendEmail({
      to: email,
      message,
      subject: "OTP code",
    });
if (!sendEmail) {
  return next(new Error('send email failed'))
}
const saved = await userModel.findOneAndUpdate({email},{forgetCode},{new:true})

return res.status(201).json({message:'OTP send successfully',saved})

  }

  // reset password
  export const resetPassword = async (req,res,next) => {
    const {email,forgetCode,newPassword } = req.body;

    const user = await userModel.findOne({email});
    if (!user) {
      return next(new Error('please signup first', {cause:400}))
    }
    if (user.forgetCode != forgetCode) {
      return next(new Error('invalid OTP', {cause:400}))
    }

user.password = newPassword
user.forgetCode = null
user.changePassword = Date.now()
const udateUser = await user.save()

return res.status(200).json({message:'success',udateUser})

  }