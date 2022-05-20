import {Request, Response, Router} from 'express'
import {bloggersService} from "../domain/bloggers-service";
import {
    inputValidatorMiddleware,
} from "../middlewares/input-validator-middleware";
import {body, check} from "express-validator";
import {authService} from "../middlewares/auth-service";
import {postsService} from "../domain/posts-service";
import {paginate} from "../middlewares/paginate-middleware";

export const bloggerRouter = Router({})
const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/

bloggerRouter.post('/',
    body('name').isString().withMessage('Name should be a string')
        .trim().not().isEmpty().withMessage('Name should be not empty'),
    body('youtubeUrl').matches(urlValidator).withMessage('URL invalid'),
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        res.status(201).send(
            await bloggersService.createBlogger(
                req.body.name,
                req.body.youtubeUrl
            )
        )
    })

    .post('/:bloggerId/posts',
        body('title').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('shortDescription').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        body('content').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        inputValidatorMiddleware,
        authService,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            res.status(201).send(
                await postsService.createPost({
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    bloggerId,
                })
            )
        })

    .put('/:bloggerId',
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        body('name').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('youtubeUrl').matches(urlValidator)
            .withMessage('URL invalid'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const updatedBlogger = await bloggersService.updateBlogger(+req.params.bloggerId, req.body.name, req.body.youtubeUrl)
            if (!updatedBlogger) {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            } else {
                res.send(204)
            }
        })

    .get('/',
        paginate,
        async (req: Request, res: Response) => {
        res.send(await bloggersService.findBloggers(req.pagination!))
    })
    .get('/:bloggerId',
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            let blogger = await bloggersService.findBloggerById(+req.params.bloggerId)
            if (blogger) {
                res.status(200).send(blogger)
            } else {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })

    .get('/:bloggerId/posts',
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        inputValidatorMiddleware,
        paginate,
        async (req: Request, res: Response) => {
            let posts = await bloggersService.findPostsBloggerById(+req.params.bloggerId, req.pagination!)
            if (posts) {
                res.status(200).send(posts)
            } else {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "posts not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })

    .delete('/:bloggerId',
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const isDeleted = await bloggersService.deleteBlogger(+req.params.bloggerId)
            if (isDeleted) {
                res.send(204)
            } else {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            }
        })
