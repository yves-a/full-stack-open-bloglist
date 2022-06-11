const _ = require('lodash')
const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach((blog) => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  let fav = { likes: -1 }
  blogs.forEach((blog) => {
    if (blog.likes > fav.likes) {
      fav = blog
    }
  })
  return fav
}

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author)

  const amount = _.reduce(
    authors,
    (total, next) => {
      total[next] = (total[next] || 0) + 1

      return total
    },
    {}
  )

  let maxValue = 0
  let maxAuthor = 0
  for (const [author, value] of Object.entries(amount)) {
    if (value > maxValue) {
      maxValue = value
      maxAuthor = author
    }
  }
  return { author: maxAuthor, blogs: maxValue }
}

const mostLikes = (blogs) => {
  const likes = _.reduce(
    blogs,
    (total, next) => {
      total[next.author] = (total[next.author] || 0) + next.likes

      return total
    },
    {}
  )
  let maxValue = 0
  let maxAuthor = 0
  for (const [author, value] of Object.entries(likes)) {
    if (value > maxValue) {
      maxValue = value
      maxAuthor = author
    }
  }
  return { author: maxAuthor, likes: maxValue }
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
