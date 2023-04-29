import slugify from "slugify";
import couponModel from "../../../../DB/model/coupon.model.js";
import moment from 'moment'
import userModel from "../../../../DB/model/User.model.js";


// creat coupon 
export const createCoupon = async (req,res,next) => {
  const {code,amount,fromDate,toDate,usagePerUser} = req.body;
  if (amount > 100) {
    return next (new Error('amoint must be from 1 to 100'))
  }
  if (await couponModel.findOne({code:code.toLowerCase()})) {
  return  next(new Error('this code already exists', {cause:400}))
  }

  let userIds = [];
  for (const user of usagePerUser) {
    if (!userIds.includes(user.userId)) {
      userIds.push(user.userId)
    }
  }
  const users = await userModel.find({_id:{$in:userIds}})
  if (!users.length) {
  return  next(new Error('invalid user ids', {cause:400}))
    
  }

const fromDateMoment = moment(new Date(fromDate)).format('YYYY-MM-DD HH:mm')
const toDateMoment = moment(new Date(toDate)).format('YYYY-MM-DD HH:mm')
// const now = moment().format('YYYY-MM-DD HH:mm')
if ( moment(toDateMoment).isBefore(moment(fromDateMoment)) ) {
    return next( new Error('please enter a valid date', {cause:400}))
}

const coupon = await couponModel.create({
    code:code.toLowerCase(),amount,
    fromDate:fromDateMoment,
    toDate:toDateMoment,
    createdBy : req.user._id,
    usagePerUser
    
})
if (!coupon) {
    return next( new Error('fail try again later')) 
}
res.status(201).json({message:'done',coupon})


}

// update coupon 
export const updatecoupon = async (req,res,next) => {
  const {couponId} = req.params;

  const coupon = await couponModel.findById(couponId);
  if (!coupon) {
    return next(new Error('invalid coupon id',{cause:400}))
  }
  if (req.body.code) {
    if (coupon.code.toLowerCase() ==req.body.code.toLowerCase() ) {
        return next (new Error('please choose another code cannot be same code ',{cause:400}))
      }
      if (await couponModel.findOne({code:req.body.code.toLowerCase()})) {
        return next (new Error('coupon code already exists',{cause:400})) 
      }
      coupon.code = req.body.code.toLowerCase();
      coupon.slug = slugify(req.body.code,"_")
  }
  if (req.body.amount) {
    if (req.body.amount > 100 || req.body.amount < 1) {
        return next (new Error('invalid amout',{cause:400})) 
        
    }
    coupon.amout = req.body.amout
  }
  if (req.body.fromDate) {
    if (moment(new Date(req.body.fromDate)).isBefore(moment())) {
    return next (new Error('please enter date from tommoro',{cause:400}))
        
    }
    if (moment(new Date(req.body.fromDate)).isAfter(moment(coupon.toDate))) {
        return next (new Error('coupoon cannot start after expiration date',{cause:400}))
            
        }
   coupon.fromDate = moment(new Date(req.body.fromDate)).format('YYYY-MM-DD HH:mm')
    
  }
  if (req.body.toDate) {
    if (moment(new Date(req.body.toDate)).isBefore(moment())) {
        return next (new Error('please enter date from tommoro',{cause:400}))
            
        }
        if (moment(new Date(req.body.toDate)).isBefore(moment(coupon.fromDate))) {
            return next (new Error('coupoon cannot end after start date',{cause:400}))
                
            }
       coupon.toDate = moment(new Date(req.body.toDate)).format('YYYY-MM-DD HH:mm')
  }
  if (!Object.keys(req.body).length) {
    return next (new Error('please enter update fields',{cause:400}))
    
  }
  coupon.updatedBy = req.user._id
  const savedCoupon = await coupon.save();
  if (!savedCoupon) {
    return next (new Error('fail save coupon'))
    
  }
  res.status(201).json({message:'update done',savedCoupon})


}


export const couponValidation = (coupon,userId) =>{

  let expired = false;
  let matched = false;
  let exceed = false;
  // check if coupon expired
  if (coupon.couponStatus == 'expired' || moment(new Date(coupon.toDate)).isBefore(moment())) {
    expired = true
  }

  // check if coupon matched user and exceeded
  for (const assigneduser of coupon.usagePerUser) {
    if (assigneduser.userId.toString() == userId.toString()) {
      matched = true;
      if (assigneduser.maxUsage <= assigneduser.usageCount) {
        exceed = true
      }

    }
  }

return {expired,matched,exceed}
}

