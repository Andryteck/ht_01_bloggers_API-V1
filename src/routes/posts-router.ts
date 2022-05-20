import {Router, Request, Response} from "express";
import {postsService} from "../domain/posts-service";
import {
    inputValidatorMiddleware,
} from "../middlewares/input-validator-middleware";
import {body, check} from "express-validator";
import {authService} from "../middlewares/auth-service";
import {bloggersService} from "../domain/bloggers-service";
import {paginate} from "../middlewares/paginate-middleware";

export const postRouter = Router({})

postRouter.get('/',
    paginate,
    async (req: Request, res: Response) => {
    const posts = await postsService.findPosts(req.pagination!)
    res.status(200).send(posts)
})

.post('/',
    body('title').isString().withMessage('Name should be a string')
        .trim().not().isEmpty().withMessage('Name should be not empty'),
    body('shortDescription').isString().withMessage('shortDescription should be a string')
        .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
    body('content').isString().withMessage('shortDescription should be a string')
        .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
    inputValidatorMiddleware,
    authService,
    async (req: Request, res: Response) => {
        const bloggerId: number = +req.body.bloggerId
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

.get('/:postId',
    check('postId').isNumeric().withMessage('id should be numeric value'),
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    const id = +req.params.postId
    const post = await postsService.findPostById(id)
        if (post) {
            res.send(post)
        } else {
            res.status(404).send({
                "data": {},
                "errorsMessages": [{
                    message: "post not found",
                    field: "id"
                }],
                "resultCode": 1
            })
        }
})


.put('/:postId',
    body('title').isString().withMessage('Name should be a string')
        .trim().not().isEmpty().withMessage('Name should be not empty'),
    body('shortDescription').isString().withMessage('shortDescription should be a string')
        .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
    body('content').isString().withMessage('shortDescription should be a string')
        .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
    body('content').isString().withMessage('shortDescription should be a string'),
    check('postId').isNumeric().withMessage('id should be numeric value'),
    inputValidatorMiddleware,
    authService,
    async (req: Request, res: Response) => {
    const id = +req.params.postId
    const body = req.body
        const updatePost = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            bloggerId: body.bloggerId
        }
        const blogger = await bloggersService.findBloggerById(updatePost.bloggerId)
        if(!blogger){
            res.status(400).send({
                "data": {},
                "errorsMessages": [{
                    message: "blogger not found",
                    field: "bloggerId"
                }],
                "resultCode": 0
            })
            return
        }
        const updatedPost = await postsService.updatePost(id, updatePost)
        if (!updatedPost) {
            res.status(404)
            res.send({
                "data": {},
                "errorsMessages": [{
                    message: "post not found",
                    field: "id"
                }],
                "resultCode": 0
            })
        } else {
            res.status(204).send(updatedPost)
        }

})

.delete('/:id',

    async (req: Request, res: Response) => {
    const isDeleted = await postsService.deletePost(+req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.status(404).send({
            "data": {},
            "errorsMessages": [{
                message: "post not found",
                field: "id"
            }],
            "resultCode": 1
        })
    }
})
