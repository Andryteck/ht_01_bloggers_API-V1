import {MongoClient} from 'mongodb'
import {BloggerType} from "./bloggers-db-repository";
import {PostType} from "./posts-db-repository";
import 'dotenv/config'

const mongoUri = 'mongodb+srv://Andryteck:772316Andrew@cluster0.qvm8n.mongodb.net/bloggers-db?retryWrites=true&w=majority'

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


