import bcrypt from 'bcryptjs'


export const hashFunction = ({ payload, salt = process.env.SALT_ROUND } = {}) => {
    const hashResult = bcrypt.hashSync(payload, parseInt(salt))
    return hashResult
}


export const compareFunction = ({ payload, hashValue } = {}) => {
    const match = bcrypt.compareSync(payload, hashValue)
    return match
}