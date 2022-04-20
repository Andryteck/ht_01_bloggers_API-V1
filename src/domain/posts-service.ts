import {postsDbRepository, PostType} from "../repositories/posts-db-repository";

export const postsService = {
    async findPosts(): Promise<PostType[]> {
        const posts = await postsDbRepository.findPosts();
        return posts.map(i => {
            delete i._id
            return i
        })
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
