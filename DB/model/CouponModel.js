import mongoose, { Schema, model } from "mongoose";


const couponSchema=new Schema(
    {
        code:{
            type:String,
            unique:true,
            required:true
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
        validFrom:{
            type:String,
            required:[true,'please enter validFrom date']
            
        },
        
        expiredDate:{
            type:String,
            required:[true,'please enter expired date']
            
        },
        usagePerUser: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                maxUsage: {
                    type: Number,
                    required: true
                },
                usageCount: {
                    type: Number,
                    default: 0
                }
            }
        ]
    },
    {
        timestamps:true,
        
    }
);

const couponModel=mongoose.models.Coupon||model("Coupon",couponSchema)
export default couponModel;