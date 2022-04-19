import {
    bloggersDbRepository, BloggerType,
} from "../repositories/bloggers-db-repository";

type ErrorMessageType = {
    message: string;
    field: string;
}

export const bloggersService = {
    async findBloggers(): Promise<BloggerType[]> {
        const  result = await bloggersDbRepository.findBloggers();
        return result.map(i => {
            return {
                id: i.id,
                name: i.name,
                youtubeUrl: i.youtubeUrl,
            }
        })
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        const result = await bloggersDbRepository.findBloggerById(id)
        return {
            id: result!.id,
            name: result!.name,
            youtubeUrl: result!.youtubeUrl,
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
    async updateBlogger(id: number, title: string, url: string): Promise<boolean | undefined> {
        return await bloggersDbRepository.updateBlogger(id, title, url);
    },
    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersDbRepository.deleteBlogger(id);
    },
};
