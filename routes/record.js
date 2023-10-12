import express, { response } from "express"
import { getDb } from "../db/conn.js"
import { ObjectId } from "mongodb"
import path from "path"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import expressAsyncHandler from "express-async-handler"
import {registrationValidation, loginValidation, newEntryValidation} from "../validation/validate.js"

export const recordRoutes = express.Router()
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = getDb()
    const query = {
        _id: new ObjectId(req.params.id),
        animeList
    }
    db_connect.collection("users").find(query).toArray(function(err, result) {
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
    let db_connect = getDb()
    const user = await db_connect.collection("users").findOne({email})
    async function matchPassword(a, b) {
        return await bcryptjs.compare(a, b)
    }
    if (user && await matchPassword(password, user.password)) {
        res.json({
            id: user._id,
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
recordRoutes.route("/record/register").post(expressAsyncHandler(async(req, res, next) => {
    const {error} = registrationValidation(req.body)
    if (error) {
        const err = new Error(error.details[0].message)
        err.status = 400
        return next(err)
    }
    let db_connect = getDb()
    const {username, email, password} = req.body
    const userExists = await db_connect.collection("users").findOne({email})
    if (userExists) {
        const err = new Error("User exists already")
        err.status = 400
        return next(err)
    }
    else if (!userExists) {
        const salt = await bcryptjs.genSalt(10)
        const user = await db_connect.collection("users").insertOne({
            username: username,
            email: email,
            password: await bcryptjs.hash(password, salt)
        })
        res.json({message: "New user created"})
    }
    else {
        const err = new Error("Unknown error")
        err.status = 400
        return next(err)
    }
}))
recordRoutes.route("/record/newEntry/:id").post(expressAsyncHandler(async (req, response, next) => {
    let db_connect = getDb()
    let userId = { _id: new ObjectId(req.params.id)}
    const {error} = newEntryValidation(req.body)
    if (error) {
        const err = new Error("Failed to validate")
        err.status = 400
        return next(err)
    }
    const {title, episodes, imageUrl} = req.body
    const query = {
        _id: new ObjectId(req.params.id),
        animeList: {
            $elemMatch: {
                title: title
            }
        }
    }
    const titleExists = await db_connect.collection("users").findOne(query)
    if (titleExists) {
        const err = new Error("Anime already in list")
        err.status = 400
        return next(err)
    }
    let myobj = {
        title: title,
        imageUrl: imageUrl,
        episodes: episodes
    }
    await db_connect.collection("users").updateOne(
        userId, {
            $push: {
                animeList: myobj
            }
        }
    )
    response.json({message: "Anime added to list"})
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
                        title: animeTitle,
                        image: imageUrl
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