import {Router, Request, Response} from "express";
import {postsService} from "../domain/posts-service";
import {
    inputValidatorMiddleware,
} from "../middlewares/input-validator-middleware";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bloggersService} from "../domain/bloggers-service";

export const postRouter = Router({})

postRouter.get('/', async (req: Request, res: Response) => {
    const postsWithName = await postsService.findPosts()
    res.status(200).send(postsWithName)
})

.post('/:bloggerId',
    body('title').isString().withMessage('Name should be a string')
        .trim().not().isEmpty().withMessage('Name should be not empty'),
    body('shortDescription').isString().withMessage('shortDescription should be a string')
        .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
    body('content').isString().withMessage('shortDescription should be a string')
        .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
    inputValidatorMiddleware,
    authMiddleware,
    async (req: Request, res: Response) => {
        const bloggerId: number = +req.params.bloggerId
        const blogger = await bloggersService.findBloggerById(bloggerId)
        if (!blogger) {
            res.status(400).send({
                "data": {},
                "errorsMessages": [
                    {
                        message: "blogger not found",
                        field: "blogger"
                    }
                ],
                "resultCode": 1
            })
        } else {
            const newPost = await postsService.createPost({
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                bloggerId,
            })
            res.status(201).send(newPost)
        }
})

.get('/:id', async (req: Request, res: Response) => {
    const id = +req.params.id
    const post = await postsService.findPostById(id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})


.put('/:id',
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

.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await postsService.deletePost(+req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
