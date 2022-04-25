import {Paginate} from "../src/repositories/types";

declare global {
    declare namespace Express {
        export interface Request {
            pagination?: Paginate
        }
    }
}
