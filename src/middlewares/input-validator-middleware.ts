import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";


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
