import express, { response } from "express"
import { getDb } from "../db/conn.js"
import { ObjectId } from "mongodb"
import path from "path"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import expressAsyncHandler from "express-async-handler"
import {registrationValidation, loginValidation} from "../validation/validate.js"

export const recordRoutes = express.Router()
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = getDb("anime")
    let myquery = {_id: ObjectId(req.params.id)}
    db_connect.collection("users").findOne(myquery, function(err, result) {
        if (err) throw err
        res.json(result)
    })
})

recordRoutes.route("/record/login").post(expressAsyncHandler(async (req, res, next) => {
    const {error} = loginValidation(req.body)
    if (error) {
        const err = new Error(error.details[0].message)
        err.status = 400
        return next(err)
    }
    const {email, password} = req.body
    let db_connect = getDb("anime")
    const user = await db_connect.collection("users").findOne({email})
    async function matchPassword(a, b) {
        return await bcryptjs.compare(a, b)
    }
    if (user && await matchPassword(password, user.password)) {
        response.json({
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        const err = new Error("Invalid email or password")
        err.status = 401
        return next(err)
    }
}))

const __dirname = path.resolve(path.dirname(""))
recordRoutes.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/dist/index.html"))
})
/*
    anime: {
        users: [
            {
                id: id,
                email: email,
                username: username,
                password: password,
                animeList: [
                    {
                        name: animename,
                        episodes: [
                            {
                                episode: 1,
                                watched: false
                            }
                        ]
                    }
                ]
            }
        ]
    }
*/