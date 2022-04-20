import {bloggersCollection, postsCollection} from "./db";
import {ObjectId} from "mongodb";
import {bloggersDbRepository} from "./bloggers-db-repository";

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
        return postsCollection.find().toArray()
    },
    async findBPostsById(id: number): Promise<PostType | boolean> {
        const post = await postsCollection.findOne({id: id})
        if (!post) return false
        const blogger = await bloggersDbRepository.findBloggerById(post.bloggerId)
        if (!blogger) return false
        // @ts-ignore
        const bloggerName = blogger.name
        // @ts-ignore
        delete post._id
        return ({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName
        })
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
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}
