import mongoose, { Schema, model } from "mongoose";


const subCategorySchema=new Schema(
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
        customId:String,
        categoryId:{
            type:Schema.Types.ObjectId,
            ref:'Category',
            required:false
        },
    },
    {
        timestamps:true,
    }
);

const subCategoryModel=mongoose.models.SubCategory||model("SubCategory",subCategorySchema)
export default subCategoryModel;