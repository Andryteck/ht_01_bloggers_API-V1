import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";

export const nameValidation = body('name')
    .exists()
    .isString()
    .isLength({min: 3, max: 20})
    .withMessage('Max 15 symbols')

export const youtubeUrlValidation = body('youtubeUrl')
    .exists()
    .isString()
    .isLength({min: 30, max: 90})
    .withMessage('Min 11 symbols')
    .matches('^(https?://)?(www\\.)?(youtube\\.com|youtu\\.?be)/.+$')
    .withMessage('Invalid youtube url')

export const titleValidation = body(['title', 'shortDescription', 'content'])
    .exists()
    .isString()
    .isLength({min: 3, max: 100})
    .withMessage('Max 100 symbols')

export const bloggerIdValidation = body('bloggerId')
    .exists()
    .isInt()

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // here we make validation. Also here we can transform returned object (for example to satisfy the Swagger API)
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next()
    } else {
        return res.status(400).json({
            data: {}, errorsMessages: errors.array().map(e => {
                return {
                    message: e.msg,
                    field: e.param,
                }
            })
        });
    }
}
