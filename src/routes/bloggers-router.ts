import {Request, Response, Router} from 'express'
import {bloggersService} from "../domain/bloggers-service";
import {
    inputValidatorMiddleware,
    nameValidation,
    youtubeUrlValidation
} from "../middlewares/input-validator-middleware";

export const bloggerRouter = Router({})

bloggerRouter.post('/',
    // nameValidation,
    // youtubeUrlValidation,
    // inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        res.status(201).send(
            await bloggersService.createBlogger(req.body.name,
                req.body.youtubeUrl
            )
        )
    })

bloggerRouter.put('/:id',
    nameValidation,
    youtubeUrlValidation,
    inputValidatorMiddleware,
    async (req: Request, res: Response) => {
        const isUpdated = await bloggersService.updateBlogger(+req.params.id, req.body.name, req.body.youtubeUrl)
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
bloggerRouter.get('/:id', async (req: Request, res: Response) => {
    let product = await bloggersService.findBloggerById(+req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})

bloggerRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await bloggersService.deleteBlogger(+req.params.id)
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
