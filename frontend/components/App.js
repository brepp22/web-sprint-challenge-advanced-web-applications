import React, { useState , useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles')}


  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
  }



  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    fetch( loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({username, password})
    })
      .then(res => {
        if(!res.ok) throw new Error ('Problem logging in')
          return res.json()
      })
      .then(data => {
        localStorage.setItem('token', data.token)
        redirectToArticles()
        getArticles()
      })
      .catch((err) => {
        console.error(err)
        setMessage(err.message)
      })
      .finally(() => setSpinnerOn(false))
    }

  

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    
    setSpinnerOn(true)

    const token = localStorage.getItem('token')
    fetch(articlesUrl, {
      headers: {
        Authorization: token 
      }
    })
    .then((res) => {
      if(!res.ok) {
        if(res.status === 401){
          logout()
        }
        throw new Error ('Problem retrieving articles')
      }
      return res.json()
    })
    .then((data) => {
      setArticles(data.articles)
      setMessage(data.message)
    })
    .catch((err) => {
      console.error(err)
      setMessage(err.message)
    })
    .finally(() => setSpinnerOn(false))
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    const token = localStorage.getItem('token')
    setMessage('')
    setSpinnerOn(true)
    fetch( articlesUrl, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : token
      },
      body: JSON.stringify(article)
    })
    .then(res => {
      if(!res.ok) throw new Error ('Problem Posting Article')
        return res.json()
    })
    .then((data) => {
      setArticles((prevArticles) => [...prevArticles, data.article])
      setMessage(data.message)
    })
    .catch((err) => {
      console.error(err)
      setMessage(err.message)
    })
    .finally(() => setSpinnerOn(false))
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    const token = localStorage.getItem('token')
    setMessage('')
    setSpinnerOn(true)
  fetch(`http://localhost:9000/api/articles/${article_id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
      headers: new Headers ({ 'Content-Type' : 'application/json' , Authorization: token})
    })
    .then(res => {
      if(!res.ok) throw new Error ('Problem Putting Article')
      return res.json()
      
    })
      .then(data => {
        setArticles(prevArticles => {
        return prevArticles.map(art =>
        art.article_id === article_id ? data.article : art
        )
        })
      console.log(data)
       setMessage(data.message)
   })
  .catch((err) => {
      console.error(err)
      setMessage(err.message)
  })
  .finally(() => setSpinnerOn(false))
}
  

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true)
    setMessage('')
    fetch(`http://localhost:9000/api/articles/${article_id}` , {
      method: 'DELETE',
      headers: new Headers ({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      })
    })
    .then(res => {
      if(!res.ok) throw new Error ('Problem Deleting Article')
      return res.json()
    })
  .then((data) => {
    setMessage(data.message)
    setArticles((prevArticles) => {
      const updatedArticles = prevArticles.filter(article => article.article_id !== article_id)
      console.log(updatedArticles)
      return updatedArticles
  })
})
    .catch((err) => {
    console.error(err)
    setMessage(err.message)
  })
  .finally(() => {
    setSpinnerOn(false)
  }) 
}


  



  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on = {spinnerOn} />
      <Message message = {message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle} articles={articles} currentArticleId={currentArticleId}/>
              <Articles setCurrentArticleId ={setCurrentArticleId} articles = {articles} getArticles={getArticles} deleteArticle={deleteArticle} updateArticle={updateArticle} currentArticleId={currentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}