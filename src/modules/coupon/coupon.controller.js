import moment from "moment";
import couponModel from "../../../DB/model/CouponModel.js";
import userModel from "../../../DB/model/UserModel.js";

const addCoupon=async (req,res,nxt)=>{
    const{code,amount,validFrom,expiredDate,usagePerUser}=req.body;
    if (amount < 1) return nxt(new Error('amount not valid must start from 1', { cause: 400 }))
    
    const existCoupon=await couponModel.findOne({code});
    if(existCoupon)return nxt(new Error("coupon is already exist,please enter another coupon",{cause:400}))

    let userIds = [];
    for (const user of usagePerUser) {
        if (!userIds.includes(user.userId)) {
            userIds.push(user.userId)
        }
    }

    const users = await userModel.find({ _id: { $in: userIds } })
    if (users.length !== usagePerUser.length) {
        return nxt(new Error('in-valid userId', { cause: 400 }))
    }
    const validDateMoment=moment(new Date(validFrom)).format('YYYY-MM-DD HH:mm')
    const expiredDateMoment=moment(new Date(expiredDate)).format('YYYY-MM-DD HH:mm')
    const nowMoment=moment().format('YYYY-MM-DD HH:mm');
    
    if(moment(validDateMoment).isBefore(moment(nowMoment)) ||
    moment(expiredDateMoment).isBefore(moment(nowMoment)) ||
    moment(expiredDateMoment).isBefore(moment(validDateMoment))||
    moment(expiredDateMoment).isSame(moment(validDateMoment)))return nxt (new Error("Please Enter A Valid Date",{cause:400}))

    const coupon=await couponModel.create({
        code,
        amount,
        usagePerUser,
        validFrom:validDateMoment,
        expiredDate:expiredDateMoment,
        createdBy: req.user._id

    })
    if (!coupon) return nxt(new Error('please try to add coupon again', { cause: 400 }))
    
    return res.status(201).json({message:"coupon created done",coupon})
}
const updateCoupon = async (req, res, nxt) => {
    const { couponId } = req.params
    const coupon = await couponModel.findById(couponId)
    if (!coupon) return nxt(new Error('coupon not found', { cause: 400 }))

    if (req.body.code) {
        // check on the same coupon
        if (coupon.code == req.body.code)return nxt(new Error('please enter different coupon code', { cause: 400 }))

        // check on the all coupons 
        if (await couponModel.findOne({ code: req.body.code })) return nxt(new Error('Coupon Code already exist', { cause: 400 }))
        
        coupon.code = req.body.code
    }
    if (req.body.amount) {
        if (req.body.amount < 1) return nxt(new Error('in-valid amount', { cause: 400 }))
        coupon.amount = req.body.amount
    }

    if (req.body.validFrom) {
        if (moment(new Date(req.body.validFrom)).isBefore(moment())) return nxt(new Error('please enter valid start date', { cause: 400 }))

        if (moment(new Date(req.body.validFrom)).isAfter(moment(coupon.expiredDate))) return nxt(new Error('coupon cannot start after the expiration date', { cause: 400 }))
        coupon.validFrom = moment(new Date(req.body.validFrom)).format('YYYY-MM-DD HH:mm')
    }

    if (req.body.expiredDate) {
        if (moment(new Date(req.body.expiredDate)).isBefore(moment())) return nxt(new Error('please enter a valid expired date', { cause: 400 }))
        
        if (moment(new Date(req.body.expiredDate)).isBefore(moment(coupon.validFrom))) return nxt(new Error('coupon cannot expired before the starting date', { cause: 400 }))
        
        if (moment(new Date(req.body.expiredDate)).isSame(moment(coupon.validFrom))) return nxt(new Error('coupon cannot start on same day of expiration', { cause: 400 }))
        
        coupon.expiredDate = moment(new Date(req.body.expiredDate)).format('YYYY-MM-DD HH:mm')
    }
    if (!Object.keys(req.body).length) {
        return nxt(new Error('please enter the updated fields', { cause: 400 }))
    }
    coupon.updatedBy = req.user._id
    const savedCoupon = await coupon.save()
    return res.status(200).json({ message: "Done", savedCoupon })
}
export const validationCoupon = (coupon, userId) => {
    let expired = false
    let matched = false
    let exceed = false
    // expired
    if (coupon.couponStatus == 'expired' || moment(coupon.toDate).isBefore(moment())) {
        expired = true
    }
    // user not assgined
    for (const assginedUser of coupon.usagePerUser) {
        if (assginedUser.userId.toString() == userId.toString()) {
            matched = true
            // user exceed maxUsage
            if (assginedUser.maxUsage <= assginedUser.usageCount) {
                exceed = true
            }
        }
    }
    return { expired, matched, exceed }
}
export{
    addCoupon,
    updateCoupon,
}