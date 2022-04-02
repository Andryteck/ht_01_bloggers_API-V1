import bodyParser from 'body-parser'
import cors from 'cors'
import express, {Request, Response} from 'express'

const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(bodyParser());


let bloggers = [
    {
        id: 1,
        name: "aaa",
        youtubeUrl: "qdfqefdq",
    },
    {
        id: 2,
        name: "bbb",
        youtubeUrl: "wrfrwfw",
    },
    {
        id: 3,
        name: "ccc",
        youtubeUrl: "qdwrfvwfvwfqefdq",
    }
]

let posts = [
    {
        id: 1,
        title: 'aaaaaaaaaa',
        shortDescription: 'a',
        content: "fwefww",
        bloggerId: 1,
        bloggerName: 'aaa',
    },
    {
        id: 2,
        title: 'bbbbbbb',
        shortDescription: 'b',
        content: "fwefwfw",
        bloggerId: 2,
        bloggerName: 'bbb',
    },
    {
        id: 3,
        title: 'cccccccccc',
        shortDescription: 'c',
        content: "wfewfwefw",
        bloggerId: 3,
        bloggerName: '',
    },
    {
        id: 4,
        title: 'dddddddddd',
        shortDescription: 'd',
        content: "ergverwgve",
        bloggerId: 1,
        bloggerName: 'aaa',
    }
]

//Bloggers

app.get('/hs_01/api/bloggers', (req: Request, res: Response) => {
    res.send(bloggers)
})

app.post('/hs_01/api/bloggers', (req: Request, res: Response) => {
    const body = req.body
    if (body) {
        bloggers.push({...body, id: bloggers.length})
        res.sendStatus(201)
    }
})

app.get(`/hs_01/api/bloggers/:id`, (req: Request, res: Response) => {
    const id = +req.params.id
    const blogger = bloggers.find(i => i.id === id)
    if (blogger) {
        res.sendStatus(200).send(blogger)
    }
})


app.put('/hs_01/api/bloggers/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const blogger = bloggers.find(i => i.id === id)
    if (blogger) {
        if (req.body.hasOwnProperty('title') && req.body.hasOwnProperty('youtubeUrl')) {
            blogger.name = req.body.title
            blogger.youtubeUrl = req.body.youtubeUrl
        } else {
            res.sendStatus(400)
        }
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

app.delete('/hs_01/api/bloggers/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (id) {
        bloggers = bloggers.filter(i => i.id !== +req.params.id)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

// Posts

app.get('/hs_01/api/posts', (req: Request, res: Response) => {
    res.status(200).send(posts)
})

app.post('/hs_01/api/posts', (req: Request, res: Response) => {
    const body = req.body
    if (body) {
        res.status(201).send({
            ...body,
            id: posts.length + 1,
            bloggerName: bloggers.find(i => i.id === body.bloggerId)?.name
        })
    } else {
        res.sendStatus(400)
    }
})

app.get('/hs_01/api/posts:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const post = bloggers.find(i => i.id === id)
    if (post) {
        res.sendStatus(200).send(post)
    }
})


app.put('/hs_01/api/posts:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const post = posts.find(i => i.id === id)
    if (post) {
        if (req.body.hasOwnProperty('title') && req.body.hasOwnProperty('shortDescription') && req.body.hasOwnProperty('content') && req.body.hasOwnProperty('bloggerId')) {
            post.title = req.body.title
            post.shortDescription = req.body.shortDescription
            post.content = req.body.content
            post.bloggerId = req.body.bloggerId
        } else {
            res.sendStatus(400)
        }
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

app.delete('/hs_01/api/posts:id', (req: Request, res: Response) => {
    const id = +req.params.id
    if (id) {
        posts = posts.filter(i => i.id !== +req.params.id)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
