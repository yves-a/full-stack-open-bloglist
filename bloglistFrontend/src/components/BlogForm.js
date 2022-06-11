import { useState } from 'react'
const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')
  const newBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: title,
      author: author,
      url: url,
      likes: likes,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }
  return (
    <div className="formDiv">
      <form onSubmit={newBlog}>
        <div>
          title
          <input
            type="text"
            value={title}
            placeholder="title"
            id="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            placeholder="author"
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            placeholder="url"
            id="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          likes
          <input
            type="number"
            value={likes}
            placeholder="likes"
            id="likes"
            onChange={({ target }) => setLikes(target.value)}
          />
        </div>
        <button id="save" type="submit">
          save
        </button>
      </form>
    </div>
  )
}

export default BlogForm
