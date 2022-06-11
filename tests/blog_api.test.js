const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
let token
beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('yves', 10)

  const user = new User({
    username: 'test',
    name: 'testname',
    password: passwordHash,
  })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

const api = supertest(app)

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `bearer ${token}`)
  expect(response.statusCode).toBe(200)
  expect(response.headers['content-type']).toBe(
    'application/json; charset=utf-8'
  )
  expect(response.body).toHaveLength(2)
}, 100000)

test('blogs are using id instead of _id in json', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `bearer ${token}`)
  console.log(response.body)
  expect(response.body[0].id).toBeDefined()
  expect(response.body[0]._id).toBeUndefined()
}, 100000)

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'what',
    author: 'y',
    url: 'w.com',
    likes: 100,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map((r) => r.title)
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('what')
}, 100000)

test('a valid blog can be added with zero likes', async () => {
  const newBlog = {
    title: 'who',
    author: 'iv',
    url: 'i.com',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  const postedBlog = blogsAtEnd.filter((r) => r.title === 'who')
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(postedBlog[0].likes).toEqual(0)
}, 100000)

test('an invalid blog cannot be added without title or url', async () => {
  const newBlog = {
    author: 'iv',
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(400)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})
