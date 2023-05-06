import jwt from 'jsonwebtoken'


export const generateToken = ({ payload = {}, signature = process.env.TOKEN_SIGNATURE, expiresIn = '1h' } = {}) => {
    const token = jwt.sign(payload, signature, { expiresIn });
    return token
}

export const decodeToken = ({ payload='', signature = process.env.TOKEN_SIGNATURE } = {}) => {
    const decoded = jwt.verify(payload, signature);
    return decoded
}