import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addBrandSchema=joi.object({
    name:joi.string().min(3).max(15).required().messages({
        "any.required": "name is required",
        "string.empty": "name is not allowed to be empty"
        
    }),
    file:generalFields.file.required().messages({
        "any.required": "file is required",
    }),
    subCategoryId:generalFields.id.required(),
    categoryId:generalFields.id.required()
})