import {bloggersCollection} from "./db";
import {ObjectId} from "mongodb";

export type BloggerType = {
    id: number
    name: string
    youtubeUrl: string
}

export const bloggersDbRepository = {
    async findBloggers(): Promise<BloggerType[]> {
        return await bloggersCollection.find({}).toArray()
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        const blogger = await bloggersCollection.findOne({id: id})
        if (blogger) {
            return blogger
        } else {
            return null
        }
    },
    async createBlogger(newBlogger: BloggerType): Promise<BloggerType> {
       await bloggersCollection.insertOne(newBlogger)
            return {
                id: newBlogger.id,
                name: newBlogger.name,
                youtubeUrl: newBlogger.youtubeUrl
            }
    },

    async updateBlogger(id: number, name: string, url: string): Promise<boolean | undefined> {
        const blogger = await bloggersCollection.findOne({id: id})
        if (blogger) {
            const result = await bloggersCollection.updateOne({
                name: blogger.name,
                youtubeUrl: blogger.youtubeUrl
            }, {$set: {name, youtubeUrl: url}})
            return result.modifiedCount === 1
        }
    },
    async deleteBlogger(id: number): Promise<boolean> {
        const bloggers = await bloggersCollection.find({}).toArray()
        for (let i = 0; i < bloggers.length; i++) {
            if (bloggers[i].id === id) {
                // @ts-ignore
                const result = await bloggersCollection.deleteOne({"_id": ObjectId(bloggers[i]._id)})
                return result.deletedCount === 1
            }
        }
        return false
    }
}
