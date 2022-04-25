import {postsDbRepository, PostType} from "../repositories/posts-db-repository";
import {Paginate} from "../repositories/types";
import {postsCollection} from "../repositories/db";
import {BloggerResponse} from "./bloggers-service";

export const postsService = {
    async findPosts(paginate: Paginate): Promise<BloggerResponse<PostType>> {
        const posts = await postsDbRepository.findPosts(paginate);
        const total = await postsCollection.countDocuments();
        return {
            pagesCount: Math.floor(total / paginate.pageSize!),
            page: paginate.pageNumber,
            pageSize: paginate.pageSize,
            totalCount: total,
            items: posts
        }
    },
    async findPostById(id: number): Promise<PostType | boolean> {
        const post = postsDbRepository.findBPostsById(id)
        if (post) {
            return post
        } else return false
    },
    async createPost(newPostData: Omit<PostType, 'id'>): Promise<PostType> {
        const newPost = {
            ...newPostData,
            id: +(new Date()),
        };

        return await postsDbRepository.createPost(newPost);
    },
    async updatePost(id: number, updatedPost:PostType): Promise<boolean | undefined> {
        return await postsDbRepository.updatePost(id, updatedPost)
    },
    async deletePost(id: number): Promise<boolean> {
        return await postsDbRepository.deletePost(id);
    },
};
