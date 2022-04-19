import {Request, Response, Router} from 'express'
import {bloggersService} from "../domain/bloggers-service";
import {
    inputValidatorMiddleware,
    nameValidation,
    youtubeUrlValidation
} from "../middlewares/input-validator-middleware";
import {body, check} from "express-validator";

export const bloggerRouter = Router({})
const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/

bloggerRouter.post('/',
    body('name').isString().withMessage('Name should be a string')
        .trim().not().isEmpty().withMessage('Name should be not empty'),
    body('youtubeUrl').matches(urlValidator).withMessage('URL invalid'),
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        res.status(201).send(
            await bloggersService.createBlogger(req.body.name,
                req.body.youtubeUrl
            )
        )
    })

bloggerRouter.put('/:bloggerId',
    check('bloggerId').isNumeric().withMessage('id should be numeric value'),
    body('name').isString().withMessage('Name should be a string')
        .trim().not().isEmpty().withMessage('Name should be not empty'),
    body('youtubeUrl').matches(urlValidator)
        .withMessage('URL invalid'),
    async (req: Request, res: Response) => {
        const isUpdated = await bloggersService.updateBlogger(+req.params.bloggerId, req.body.name, req.body.youtubeUrl)
        if (!isUpdated) {
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

bloggerRouter.get('/', async (req: Request, res: Response) => {
    const foundBloggers = await bloggersService.findBloggers()
    res.status(200).send(foundBloggers)
})
bloggerRouter.get('/:bloggerId',
    check('bloggerId').isNumeric().withMessage('id should be numeric value'),
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
    let product = await bloggersService.findBloggerById(+req.params.bloggerId)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})

bloggerRouter.delete('/:bloggerId', async (req: Request, res: Response) => {
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
