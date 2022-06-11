import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const sortedBy = (a, b) => {
    if (a.likes > b.likes) {
      return -1
    } else if (a.likes < b.likes) {
      return 1
    } else {
      return 0
    }
  }
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort(sortedBy)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addBlog = async (blogObject) => {
    console.log(blogObject)
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogService.getAll().then((blogs) => setBlogs(blogs.sort(sortedBy)))
      notify(`a new blog ${blogObject.title} by ${blogObject.author}`)
    } catch (exception) {
      notify('could not add blog', 'alert')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      notify(`logged in ${username}`)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('wrong username or password', 'alert')
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog">
      <BlogForm addBlog={addBlog} />
    </Togglable>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )
  const update = () => {
    blogService.getAll()
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        <p>
          {user.name} logged-in
          <button onClick={logout}>logout</button>
        </p>
        {blogForm()}
      </div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          blogs={blogs}
          setBlogs={setBlogs}
          update={update}
        />
      ))}
    </div>
  )
}

export default App
