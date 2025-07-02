const supertest = require('supertest')
const {test, after, beforeEach, describe} = require ('node:test')
const assert = require ('node:assert')
const app = require('../app')
const listHelper = require ('../utils/listHelper.js')
const usersRouter = require ('../controllers/usersRouter.js')
const User = require ('../models/users.js')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const api = supertest(app)

const initialUsers = [
    {
        username: 'testuser1',
        name: 'Test User 1',
        password: '12345'    
    },
    {
        username: 'testuser2',
        name: 'Test User 2', 
        password: '12345'
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('12345', 10)
    const user = new User ({username: 'root', name: 'root user', passwordHash})
    await user.save()
})

describe( 'Creating invalid users', () => {
    test ('User with less than 3 characters in username and password', async () => {
        
        const newUser = {
            username: 'ab',
            name: 'Test User',
            password: '12'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect((response) => {
                assert.deepStrictEqual(response.body, {
                    error: 'Username and password must have 3 characters at least'
                })
            })
    })

    test('User with missing username, name or password', async () => {
        const newUser = {
            name: 'Test User',
            password: '12345'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect((response) => {
                assert.deepStrictEqual(response.body, {
                    error: 'Username, name and password are required'
                })
            })
    })
})

test.after(async () => {
    await mongoose.connection.close()
})