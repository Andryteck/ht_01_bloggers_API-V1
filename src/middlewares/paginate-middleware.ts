import {NextFunction, Request, Response} from "express";

export const paginate = (req: Request, res: Response, next: NextFunction) => {
    const searchNameTerm = req.query.searchNameTerm ?? ''
    const pageNumber = +req.query.PageNumber! || 1
    const pageSize = +req.query.PageSize! || 10
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = pageNumber * pageSize
    // TODO - refactor this
    // const {pageNumber = 1, pageSize = 10} = req.query;
    // @ts-ignore
    req.pagination = {pageNumber, pageSize, startIndex, endIndex, searchNameTerm}
    next();
};
