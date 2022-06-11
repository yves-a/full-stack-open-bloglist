import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, update }) => {
  const [blogState, setBlogState] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const toggleBlogState = () => {
    setBlogState(!blogState)
  }

  const updateLikes = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    console.log(typeof blogs)
    blogService.update(blog.id, updatedBlog).then((savedBlog) => {
      setBlogs(blogs.map((b) => (b.id === blog.id ? savedBlog : b)))
    })
    update()
  }

  const deleteBlog = () => {
    const ok = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    if (ok) {
      blogService.destroy(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
    }
  }

  if (blogState) {
    return (
      <div style={blogStyle} className="blog">
        <div>
          {blog.title} <button onClick={toggleBlogState}> hide </button>
          <br /> {blog.url} <br />
          {blog.likes}{' '}
          <button id="likeButton" onClick={updateLikes}>
            {' '}
            like{' '}
          </button>
          <br /> {blog.author}
          <br />{' '}
          <button id="deleteButton" onClick={deleteBlog}>
            {' '}
            delete{' '}
          </button>
        </div>
      </div>
    )
  }
  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={toggleBlogState}> view </button>
    </div>
  )
}

export default Blog
