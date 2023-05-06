import mongoose, { Schema, model } from "mongoose";


const categorySchema=new Schema(
    {
        name:{
            type:String,
            unique:true,
            required:true
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
            required:true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        slug:{
            type:String,
            required:false
        },
        customId:String
    },
    {
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
);
categorySchema.virtual('subCategories',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'categoryId'
})
const categoryModel=mongoose.models.Category||model("Category",categorySchema)
export default categoryModel;