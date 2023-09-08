import jsonwebtoken from "jsonwebtoken"
export const generateToken = id => {
    return jsonwebtoken.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}