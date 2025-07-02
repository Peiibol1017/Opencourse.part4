const supertest = require('supertest')
const {test, after, beforeEach, describe} = require ('node:test')
const assert = require ('node:assert')
const app = require('../app')
const Blog = require ('../models/blogs.js')
const User = require('../models/users.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)
    const user = new User ({username: 'root', name: 'root user', passwordHash})
    await user.save()

    const initialBlogs = [
    {
        title: 'go to statement considered harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        user: user._id,
        likes: 5
    },
    {
        title: 'Something new is not always better',
        author: 'PeiiPeii',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/D8.pdf',
        user: user._id,
        likes: 8
    }
] 
   await Blog.insertMany(initialBlogs)
})
describe('Getting blogs tests', () => {
    
test('blogs are JSON', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('getting all blogs, and there are 2', async () => {
    const response = await api.get('/api/blogs/')
    assert.strictEqual(response.body.length, 2)
        
})

test('Checking if id property is correctly named', async () => {
    const response = await api.get ('/api/blogs/')
    response.body.forEach((blog) =>{
        assert.ok(blog.id !== undefined)
        assert.ok(blog._id === undefined)
    })
})
})
describe ('blog creation tests', () => {

test('Post is correctly created', async () => {
    const user = await User.findOne({ username: 'root'})
    const userForToken = {
        username: user.username,
        id: user._id.toString(),
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    const newBlog = {
        title: 'test blog',
        author: 'test author',
        url: 'http://testurl.com',
        userId: `${user.id}`,
        likes: 23
    }
    const blogsAtStart = await api.get('/api/blogs/')
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.deepStrictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)
})

test('Post can not be created without token', async () => {
    const user = await User.findOne({ username: 'root'})
    const newBlog = {
        title: 'test blog',
        author: 'test author',
        url: 'http://testurl.com',
        userId: `${user.id}`,
        likes: 23
    }
    const blogsAtStart = await api.get('/api/blogs/')
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer`)
    .send(newBlog)
    .expect(401)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.deepStrictEqual(blogsAtEnd.body.length, blogsAtStart.body.length)
})

test('Post a blog without likes, it is set to 0', async () => {
       const user = await User.findOne({ username: 'root'})
    const userForToken = {
        username: user.username,
        id: user._id.toString(),
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    const newBlog = {
        title: 'test blog withiout likes',
        author: 'test author without likes',
        url: 'http://testurl.com'
    }
    const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    const postedBlog = response.body
    assert.ok(postedBlog.likes === 0 )

}) 

test('Post a blog without tittle or url, it returns 400', async () => {
       const user = await User.findOne({ username: 'root'})
    const userForToken = {
        username: user.username,
        id: user._id.toString(),
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    const newBlog = {
        title: 'test blog without url',
        author: 'Its a me, mario',
        likes: 5
    }
    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})
})

describe ('blog modification tests', () => {

    test('Delete a blog', async () => {
    const user = await User.findOne({ username: 'root'})
    const userForToken = {
        username: user.username,
        id: user._id.toString(),
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    })

    test('Update a blog', async () => {
        const blogsAtStart = await api.get ('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]
        const updatedBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: 35
        }
        const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
    })
})

test.after(async () => {
    await mongoose.connection.close()
})
