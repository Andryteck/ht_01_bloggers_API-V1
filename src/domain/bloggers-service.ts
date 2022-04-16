import {
    bloggersDbRepository, BloggerType,
} from "../repositories/bloggers-db-repository";

type ErrorMessageType = {
    message: string;
    field: string;
}

export const bloggersService = {
    async findBloggers(): Promise<BloggerType[]> {
        return bloggersDbRepository.findBloggers();
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        return await bloggersDbRepository.findBloggerById(id);
    },
    async createBlogger(title: string, url: string): Promise<BloggerType> {
        const newBlogger = {
            id: +new Date(),
            name: title,
            youtubeUrl: url
        };

        await bloggersDbRepository.createBlogger(newBlogger);
        return newBlogger;
    },
    async updateBlogger(id: number, title: string, url: string): Promise<boolean | undefined> {
        return await bloggersDbRepository.updateBlogger(id, title, url);
    },
    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersDbRepository.deleteBlogger(id);
    },
};
