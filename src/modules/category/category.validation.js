
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createCategorySchema=joi.object({
    name:joi.string().min(3).max(15).required().messages({
        "any.required": "name is required",
        "string.empty": "name is not allowed to be empty"
        
    }),
    file:generalFields.file.required().messages({
        "any.required": "file is required",

    })
})
export const updateCategorySchema=joi.object({
    name:joi.string().min(3).max(15).optional().messages({
        "any.required": "name is required",
        "string.empty": "name is not allowed to be empty"
        
    }),
    file:generalFields.file.optional().messages({
        "any.required": "file is required",
    }),
    categoryId:generalFields.id.required()
})