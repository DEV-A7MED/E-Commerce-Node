import joi from 'joi'

export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        
    }).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    id:joi.string().hex().length(24),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

export const validation = (schema, isHeadersSent = false) => {
    return (req, res, nxt) => {
        let requestData = { ...req.body, ...req.params, ...req.query }
        if (req.file || req.files) { requestData.file = req.file || req.files }
        if (req.headers?.authorization && isHeadersSent) requestData = { authorization: req.headers.authorization }

        const validationResult = schema.validate(requestData, { abortEarly: false })
        if (validationResult?.error) {
            return res.json({ message: "Validation Err", validationErr: validationResult.error.details })
        }
        return nxt()
    }
}
export const validationGraphQl = async (schema, data) => {
    const { error } = schema.validate(data, {
      abortEarly: false,
    })
    if (error) {
      throw new Error(error)
    }
    return true
  }