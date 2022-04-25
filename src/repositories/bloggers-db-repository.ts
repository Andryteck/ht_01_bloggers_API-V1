import {bloggersCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {Paginate} from "./types";
import {PostType} from "./posts-db-repository";

export type BloggerType = {
    id: number
    name: string
    youtubeUrl: string
}

export const bloggersDbRepository = {
    async findBloggers(paginate: Paginate): Promise<BloggerType[]> {
        return await bloggersCollection.find({
                name: {
                    $regex: `${paginate.searchNameTerm}`
                }
            },
            {projection: {_id: 0}}
        )
            .limit(paginate.pageSize as number)
            .skip(paginate.startIndex as number)
            .toArray()
    },
    async findBloggerById(id: number): Promise<BloggerType | boolean> {
        const blogger = await bloggersCollection.findOne({id: id})
        if (blogger) {
            // @ts-ignore
            delete blogger._id
            return blogger
        } else {
            return false
        }
    },

    async findPostsBloggerById(id: number): Promise<PostType[] | null | undefined> {
        const blogger = await bloggersCollection.findOne({id: id})
        if (blogger){
            const posts = await postsCollection.find({bloggerId: blogger.id}, {projection: {_id: 0}}).toArray()
            if (posts) {
                return posts as PostType[]
            } else {
                return null
            }
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

    async updateBlogger(id: number, name: string, url: string): Promise<boolean | BloggerType> {
        const result = await bloggersCollection.updateOne({id},
            {
                $set: {
                    "name": name,
                    "youtubeUrl": url
                }
            })
        return result.modifiedCount === 1
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
