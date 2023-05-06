import mongoose, { Schema, model } from "mongoose";


const brandSchema=new Schema(
    {
        name:{
            type:String,
            required:true
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
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        subCategoryId:{
            type:Schema.Types.ObjectId,
            ref:'SubCategory'
        },
        customId:String
    },
    {
        timestamps:true
    }
);

const brandModel=mongoose.models.Brand||model("Brand",brandSchema)
export default brandModel;