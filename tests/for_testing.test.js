const {test, describe} = require ('node:test')
const assert = require ('node:assert')
const listHelper = require ('../utils/listHelper.js')

test('dummy returns one', () => {
    console.log("test iniciando")
    const blogs= []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const blogs = [
            {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
        {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Go To Statement Considered Harmfuled',
      author: 'Eeasedasczx',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/D8.pdf',
      likes: 8,
      __v: 0
    }

    ]
    test('Summatory of all likes', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 13)
    })
    test('most liked blog', () => {
        const result = listHelper.favoriteBlogs(blogs)
        assert.deepStrictEqual(result, {
            title: 'Go To Statement Considered Harmfuled',
            author: 'Eeasedasczx',
            likes: 8
        })
    
    })
})

describe('no blogs', () =>{
    const blogs=[]
    test ('summatory of no blogs', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 0)
    })
})

describe('just one blog', () => {
    const blogs = [
           {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Go To Statement Considered Harmfuled',
      author: 'Eeasedasczx',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/D8.pdf',
      likes: 8,
      __v: 0
    }
    ]
    test('summatory of just one blog', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 8)
    })
})

describe ('author more liked and with more blogs', () => {
    const blogs =[
                    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
        {
      _id: '5a422aa71b54a676234d17f1',
      title: 'Go To Statement Considered Harmfuled',
      author: 'Eeasedasczx',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/D8.pdf',
      likes: 8,
      __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f56',
      title: 'Go To Statement Considered Harmfuless',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 74,
      __v: 0
    }
    ]
    test('returning author with more blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            blogs: 2
        } )
    })
    test('returning author with more likes', () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 79
        })
    })
})