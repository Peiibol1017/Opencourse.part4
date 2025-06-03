const _ = require ('lodash')
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return(0)
  } 
const sumaLikes = blogs.reduce((s, v) => {
  return s + v.likes;
}, 0)
return(
  sumaLikes
)
}

const favoriteBlogs = (blogs) => {
  if (blogs.length === 0) {
  return ("no blogs, no likes")
}
 const mostLikedBlog = blogs.reduce((blogMostLiked, actual) => {
  return (actual.likes > blogMostLiked.likes) ? actual : blogMostLiked
}, blogs[0])
return ({
  title: mostLikedBlog.title,
  author: mostLikedBlog.author,
  likes: mostLikedBlog.likes
})
}

const mostBlogs = (blogs) => {
const grouped = _.groupBy(blogs, 'author')
const authorCount = _.map(grouped, (posts, author) => ({
  author,
  blogs: posts.length
}))
const authorFinder = _.maxBy(authorCount, 'blogs')
return (
  authorFinder
)
}

const mostLikes = (blogs) => {
  const grouped = _.groupBy(blogs, 'author')
  const authorLikesSum = _.map(grouped, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes')
  }))
  const authorMoreLiked = _.maxBy(authorLikesSum, 'likes')
  return (
    authorMoreLiked
  )
}
module.exports = {
  dummy, 
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes
}