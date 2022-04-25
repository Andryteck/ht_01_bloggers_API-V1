import {
    bloggersDbRepository, BloggerType,
} from "../repositories/bloggers-db-repository";
import {Paginate} from "../repositories/types";
import {bloggersCollection, postsCollection} from "../repositories/db";
import {PostType} from "../repositories/posts-db-repository";

type ErrorMessageType = {
    message: string;
    field: string;
}

export type BloggerResponse<T> = {
    pagesCount: number;
    page: number | undefined;
    pageSize: number | undefined,
    totalCount: number,
    items: T[],
}

export const bloggersService = {
    async findBloggers(paginate: Paginate): Promise<BloggerResponse<BloggerType>> {
        const bloggers = await bloggersDbRepository.findBloggers(paginate);
        const total = await bloggersCollection.countDocuments();
        return {
            pagesCount: Math.floor(total / paginate.pageSize!),
            page: paginate.pageNumber,
            pageSize: paginate.pageSize,
            totalCount: total,
            items: bloggers
        }
    },
    async findBloggerById(id: number): Promise<BloggerType | boolean> {
        return await bloggersDbRepository.findBloggerById(id)
    },

    async findPostsBloggerById (id: number, paginate: Paginate): Promise<BloggerResponse<PostType> | undefined> {
         const posts = await bloggersDbRepository.findPostsBloggerById(id)
        const total = await postsCollection.countDocuments();
         if (posts) {
             return {
                 pagesCount: Math.floor(total / paginate.pageSize!) ?? 0,
                 page: paginate.pageNumber,
                 pageSize: paginate.pageSize,
                 totalCount: total,
                 items: posts
             }
         }
    },


    async createBlogger(title: string, url: string): Promise<BloggerType> {
        const newBlogger = {
            id: +(new Date()),
            name: title,
            youtubeUrl: url
        };

        return await bloggersDbRepository.createBlogger(newBlogger);
    },
    async updateBlogger(id: number, title: string, url: string): Promise<boolean | BloggerType> {
        return await bloggersDbRepository.updateBlogger(id, title, url);
    },
    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersDbRepository.deleteBlogger(id);
    },
};
