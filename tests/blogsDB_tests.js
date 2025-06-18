const supertest = require('supertest')
const {test, describe} = require ('node:test')
const assert = require ('node:assert')
const app = require('../app')
const listHelper = require ('../utils/listHelper.js')
const blogsRouter = require ('../controllers/blogsRouter.js')
const mongoose = require('mongoose')

const api = supertest(app)

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

test.after(async () => {
    await mongoose.connection.close()
})
