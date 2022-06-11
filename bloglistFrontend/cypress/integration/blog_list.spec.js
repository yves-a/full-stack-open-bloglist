describe('Blog app', function () {
  beforeEach(function () {
    cy.wait(1000)
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'yves',
      username: 'yves',
      password: 'test',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.get('#username').type('yves')
    cy.get('#password').type('test')
    cy.get('#login-button').click()

    cy.contains('yves logged-in')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('yves')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
      cy.contains('yves logged-in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('yves')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'yves',
        password: 'test',
      }).then((response) => {
        localStorage.setItem(
          'loggedBloglistUser',
          JSON.stringify(response.body)
        )
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('new1')
      cy.get('#author').type('yves')
      cy.get('#url').type('google')
      cy.get('#likes').type(1)
      cy.get('#save').click()
    })

    it('A blog can be liked', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('new1')
      cy.get('#author').type('yves')
      cy.get('#url').type('google')
      cy.get('#likes').type(1)
      cy.get('#save').click()
      cy.contains('view').click()
      cy.wait(1000)
      cy.get('#likeButton').click()
    })

    it('A blog can be deleted', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('new1')
      cy.get('#author').type('yves')
      cy.get('#url').type('google')
      cy.get('#likes').type(1)
      cy.get('#save').click()
      cy.contains('view').click()
      cy.wait(1000)
      cy.get('#deleteButton').click()
    })
    it('Blogs are sorted by most likes', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('least liked')
      cy.get('#author').type('yves')
      cy.get('#url').type('google')
      cy.get('#likes').type(100)
      cy.get('#save').click()
      cy.wait(1000)
      cy.contains('new blog').click()
      cy.get('#title').type('most liked')
      cy.get('#author').type('yves')
      cy.get('#url').type('google')
      cy.get('#likes').type(1000)
      cy.get('#save').click()
      cy.wait(1000)
      cy.get('.blog').eq(0).should('contain', 'most liked')
      cy.get('.blog').eq(1).should('contain', 'least liked')
    })
  })
})
