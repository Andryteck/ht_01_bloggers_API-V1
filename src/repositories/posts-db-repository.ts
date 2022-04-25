import {bloggersCollection, postsCollection} from "./db";
import {bloggersDbRepository} from "./bloggers-db-repository";
import {Paginate} from "./types";

export type PostType = {
    _id?: number
    id?: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: number,
    bloggerName?: string,
}

export const postsDbRepository = {
    async findPosts(paginate: Paginate): Promise<PostType[]> {
        return postsCollection
            .find()
            .limit(paginate.pageSize as number)
            .skip(paginate.startIndex as number).toArray()
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
    async updatePost(id: number, updatedPost: PostType): Promise<boolean | undefined> {
        const result = await postsCollection.updateOne({id}, {$set:{
                title: updatedPost.title,
                shortDescription: updatedPost.shortDescription,
                content: updatedPost.content,
                bloggerId: updatedPost.bloggerId
            }})
        return result.modifiedCount === 1
    },
    async deletePost(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}
