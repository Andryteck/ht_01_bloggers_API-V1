import {Router, Request, Response} from "express";
import {postsService} from "../domain/posts-service";
import {
    bloggerIdValidation,
    inputValidatorMiddleware,
    titleValidation
} from "../middlewares/input-validator-middleware";

export const postRouter = Router({})

postRouter.get('/', async (req: Request, res: Response) => {
    const postsWithName = await postsService.findPosts()
    res.status(200).send(postsWithName)
})

postRouter.post('/',
    // titleValidation,
    // bloggerIdValidation,
    // inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    const body = req.body
    const createdPost = await postsService.createPost(body)
    if (createdPost) {
        res.status(201).send(createdPost)
    } else {
        res.sendStatus(400)
    }
})

postRouter.get('/:id', async (req: Request, res: Response) => {
    const id = +req.params.id
    const post = await postsService.findPostById(id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})


postRouter.put('/:id',
    // titleValidation,
    // bloggerIdValidation,
    // inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    const id = +req.params.id
    const body = req.body
    const isUpdated = await postsService.updatePost(id, body)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

})

postRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await postsService.deletePost(+req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
