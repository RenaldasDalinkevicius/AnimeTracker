import { MongoClient } from "mongodb"

const Db = process.env.ATLAS_URI
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const dbName = "anime"
let _db
export async function connectToServer() {
  await client.connect()
  console.log('Connected successfully to server')
  _db = client.db(dbName)
  return "done."
}
export function getDb() {
  return _db
}