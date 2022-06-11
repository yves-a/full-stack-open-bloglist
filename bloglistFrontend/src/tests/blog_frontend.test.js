import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'
import axios from 'axios'
import BlogForm from '../components/BlogForm'

const blog = {
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'google',
  likes: 10,
}
const blogs = Array.of(blog)
const setBlogs = (added) => {
  blogs.concat(added)
}

jest.mock('axios')

test('renders content', () => {
  render(<Blog blog={blog} />)

  const title = screen.getByText(`${blog.title} ${blog.author}`)
  expect(title).toBeDefined()
})

test('clicking the button shows the url and likes', async () => {
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const container = screen.getByText(`${blog.title} ${blog.author}`)
  const button = screen.getByText('view')
  await user.click(button)
  expect(container).toHaveTextContent(
    `${blog.title} hide ${blog.url} ${blog.likes} like ${blog.author} delete`
  )
})

test('clicking the like button twice', async () => {
  setBlogs(blog)
  const mockHandler = jest.fn()
  render(
    <Blog blog={blog} blogs={blogs} setBlogs={setBlogs} update={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const likeButton = screen.getByText('like')
  axios.put.mockResolvedValue(blog)
  await user.click(likeButton)
  axios.put.mockResolvedValue(blog)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={createBlog} />)

  const title = screen.getByPlaceholderText('title')
  const author = screen.getByPlaceholderText('author')
  const url = screen.getByPlaceholderText('url')
  const likes = screen.getByPlaceholderText('likes')
  const sendButton = screen.getByText('save')

  await user.type(title, 'testing a form...')
  await user.type(author, 'author')
  await user.type(url, 'google')
  await user.type(likes, '1')
  expect(title).toHaveValue('testing a form...')
  expect(likes).toHaveValue(1)
  screen.debug()
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
})
