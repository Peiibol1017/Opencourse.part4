const blogsRouter = require('express').Router()
const User = require('../models/users.js')
const Blog = require('../models/blogs.js')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware.js')


blogsRouter.get('/', async (request, response) => {
const blogs = await Blog
.find({}).populate('user', {
  username: 1,
  name: 1
})
response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id){
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const {user} = request
        if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'unauthorized to delete this blog' })
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }
  try {
    const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true})
    response.json(blog)
  }
  catch (error) {
    next(error)
  }
})

module.exports = blogsRouter