import express from 'express'
import bodyParser from 'body-parser'
import {runDb} from './repositories/db'
import {bloggerRouter} from "./routes/bloggers-router";
import {postRouter} from "./routes/posts-router";

// create express app
const app = express()

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

const port = process.env.PORT || 5000

app.use('/api/bloggers', bloggerRouter)
app.use('/api/posts', postRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Bloggers app listening on port: ${port}`)
    })
}

startApp()
