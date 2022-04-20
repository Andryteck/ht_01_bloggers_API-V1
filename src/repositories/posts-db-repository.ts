import {bloggersCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";

export type PostType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName?: string,
}

export const postsDbRepository = {
    async findPosts(): Promise<PostType[]> {
        // @ts-ignore
        return postsCollection.find({}, {_id: 0}).toArray()
    },
    async findBPostsById(id: number): Promise<PostType | null> {
        const post = await postsCollection.findOne({id: id})
        if (post) {
            // @ts-ignore
            delete post._id
            return post
        } else {
            return null
        }
    },
    async createPost(newPost: PostType): Promise<PostType> {
        const blogger = await bloggersCollection.findOne({id: newPost.bloggerId})
        await postsCollection.insertOne({
            ...newPost,
            bloggerName: blogger!.name
        })
        const post = await postsCollection.findOne({id: newPost.id})
        // @ts-ignore
        delete post!._id
        // @ts-ignore
        return post

    },
    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean | undefined> {
        const post = await postsCollection.findOne({id: id})
        if (post) {
            const result = await postsCollection.updateOne({
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
            }, {$set: {title, shortDescription, content, bloggerId}})
            return result.modifiedCount === 1
        }
    },
    async deletePost(id: number): Promise<boolean> {
        const posts: PostType[] = await postsCollection.find({}).toArray()
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                // @ts-ignore
                const result = await postsCollection.deleteOne({"_id": ObjectId(posts[i]._id)})
                return result.deletedCount === 1
            }
        }
        return false
    }
}
