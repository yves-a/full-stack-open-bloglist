const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
    {
      title: "jello",
      author: "y",
      url: "wa.com",
      likes: 10
    },
    {
      title: "ew",
      author: "y",
      url: "we.com",
      likes: 101
    },
  ]
  
const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: "new Date()", url:"a" })
    await blog.save()
    await blog.remove()
  
    return blog._id.toString()
  }
  
  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}