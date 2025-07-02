const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users.js')


usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs', {
        title: 1,
        likes: 1
    })
    response.json(users)
})


usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body
    
    if ( !username || !name || !password) {
       return response.status(400).json({
           error: 'Username, name and password are required'
       })
    } else if (username.length < 3 || password.length < 3) {
        return response.status(400).json({
            error: 'Username and password must have 3 characters at least'
        })
    } else {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        username,
        name,
        passwordHash
    })
          
    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    }
    catch (error) {
        next (error)
    }
}
})

module.exports = usersRouter