import {postsDbRepository, PostType} from "../repositories/posts-db-repository";
import {bloggersDbRepository} from "../repositories/bloggers-db-repository";

export const postsService = {
    async findPosts(): Promise<PostType[]> {
        return await postsDbRepository.findPosts();
    },
    async findPostById(id: number): Promise<PostType | null> {
        return postsDbRepository.findBPostsById(id);
    },
    async createPost(newPostData: Omit<PostType, 'id'>): Promise<PostType> {
        const newPost = {
            ...newPostData,
            id: +(new Date()),
        };

        return await postsDbRepository.createPost(newPost);
    },
    async updatePost(id: number, {title, shortDescription,content,bloggerId }: PostType): Promise<boolean | undefined> {
        return await postsDbRepository.updatePost(id, title, shortDescription, content, bloggerId);
    },
    async deletePost(id: number): Promise<boolean> {
        return await postsDbRepository.deletePost(id);
    },
};
