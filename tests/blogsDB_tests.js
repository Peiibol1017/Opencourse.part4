const supertest = require('supertest')
const {test, after, beforeEach, describe} = require ('node:test')
const assert = require ('node:assert')
const app = require('../app')
const listHelper = require ('../utils/listHelper.js')
const blogsRouter = require ('../controllers/blogsRouter.js')
const Blog = require ('../models/blogs.js')
const mongoose = require('mongoose')

const api = supertest(app)

const inititialBlogs = [
    {
        title: 'go to statement considered harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5
    },
    {
        title: 'Something new is not always better',
        author: 'PeiiPeii',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/D8.pdf',
        likes: 8
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(inititialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(inititialBlogs[1])
    await blogObject.save()
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
    const newBlog = {
        title: 'test blog',
        author: 'test author',
        url: 'http://testurl.com',
        likes: 23
    }
    const blogsAtStart = await api.get('/api/blogs')
    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.deepStrictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)
})

test('Post a blog without likes, it is set to 0', async () => {
    const newBlog = {
        title: 'test blog withiout likes',
        author: 'test author without likes',
        url: 'http://testurl.com'
    }
    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    const postedBlog = response.body
    console.log(postedBlog)
    assert.ok(postedBlog.likes === 0 )

}) 

})

test.after(async () => {
    await mongoose.connection.close()
})
