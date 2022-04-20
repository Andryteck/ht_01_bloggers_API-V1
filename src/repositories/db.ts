import {MongoClient} from 'mongodb'
import {BloggerType} from "./bloggers-db-repository";
import {PostType} from "./posts-db-repository";
import 'dotenv/config'

const mongoUri = process.env.MONGO_URI!
console.log(1, mongoUri)
export const client = new MongoClient(mongoUri);
export const bloggersCollection = client.db("bloggers-db").collection<BloggerType>("bloggers");
export const postsCollection = client.db("bloggers-db").collection<PostType>("posts");

export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("bloggers-db").command({ ping: 1 });
        console.log("Connected successfully to mongo server");

    } catch {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


