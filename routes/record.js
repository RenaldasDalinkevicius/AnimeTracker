import express from "express"
import { getDb } from "../db/conn.js"
import { ObjectId } from "mongodb"
import path from "path"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import expressAsyncHandler from "express-async-handler"
import {registrationValidation, loginValidation, newEntryValidation} from "../validation/validate.js"
import jwt from "jsonwebtoken"

export const recordRoutes = express.Router()
recordRoutes.route("/record/getEntries/:id").get(expressAsyncHandler(async (req, res, next) => {
    let db_connect = getDb()
    let query = { _id: new ObjectId(req.params.id)}
    const data = await db_connect.collection("users").findOne(query, {
        animeList: 1,
        _id: 0
    }, function (err, result) {
        if (err) {
            const err = new Error("Failed to get data")
            err.status = 401
            return next(err)
        }
        res.json(result)
    })
    res.json(data)
}))
recordRoutes.route("/record/me").get(function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            res.send(null)
        }
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        res.send(decoded)
    } catch(err) {
        throw err
    }
})
recordRoutes.route("/record/logout").get(function (req, res) {
    res.clearCookie("token")
    res.end()
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
        res.cookie("token", generateToken(user._id), {
            httpOnly: true,
            maxAge: 7*24*60*60*1000
        }).json({
            id: user._id
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
            password: await bcryptjs.hash(password, salt),
            animeList: []
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
    const titleExists = await db_connect.collection("users").findOne({
        _id: new ObjectId(req.params.id),
        "animeList.title": title
    })
    if (titleExists) {
        const err = new Error("Anime already in list")
        err.status = 400
        return next(err)
    }
    else {
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
    }
}))
recordRoutes.route("/record/deleteEntry/:id").post(expressAsyncHandler(async (req, response, next) => {
    let db_connect = getDb()
    let userId = { _id: new ObjectId( req.params.id )}
    let reqTitle = req.body.title
    try {
        const res = await db_connect.collection("users").updateOne(userId,
            {
                $pull: {
                    animeList: {
                        title: reqTitle
                    }
                }
            }
        )
        response.json({message: "Entry deleted"})
    } catch(error) {
        return next(error)
    }
}))
recordRoutes.route("/record/getEntry/:id").post(expressAsyncHandler(async (req, response, next) => {
    let db_connect = getDb()
    let userId = { _id: new ObjectId( req.params.id )}
    try {
        const res = await db_connect.collection("users").findOne(userId, {
            projection: {
                _id: 0,
                animeList: {
                    $elemMatch: {
                        title: req.body.title
                    }
                }
            }
        })
        response.json(res)
    } catch(error) {
        return next(error)
    }
}))
recordRoutes.route("/record/updateEntry/:id").post(expressAsyncHandler(async (req, response, next) => {
    let db_connect = getDb()
    let userId = { _id: new ObjectId( req.params.id )}
    const newEpisodeArray = req.body.episodes
    const index = req.body.index
    try {
        const query = {
            $set: {
                [`animeList.${index}.episodes`]: newEpisodeArray
            }
        }
        const res = await db_connect.collection("users").findOneAndUpdate(userId, query, {
            returnOriginal: false
        })
        response.json({message: "Updated"})
    } catch(error) {
        return next(error)
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