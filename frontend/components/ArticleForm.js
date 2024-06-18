import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm({postArticle, updateArticle, setCurrentArticleId, currentArticleId, articles, article_id, setArticles }) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here

  // useEffect(() => {
  //   // ✨ implement
  //   // Every time the `currentArticle` prop changes, we should check it for truthiness:
  //   // if it's truthy, we should set its title, text and topic into the corresponding
  //   // values of the form. If it's not, we should reset the form back to initial values.
  

  useEffect(() => {
    if (currentArticleId) {
      const currentArticle = articles.find(article => article.article_id === currentArticleId)
      if (currentArticle) {
        setValues({
          title: currentArticle.title,
          text: currentArticle.text,
          topic: currentArticle.topic,
        })
      }
    } else {
      setValues(initialFormValues)
    }
  }, [currentArticleId, articles])

 

  const onChange = evt => {
    const { id, value } = evt.target
    console.log(`Changing field: ${id}, New value: ${value}`)
    setValues({ ...values, [id]: value })
    console.log('Updated form values:', { ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault();
 if (currentArticleId) {
  console.log('Submitting update with values:', values)
      updateArticle({ article_id: currentArticleId, article: values })
    } else {
      postArticle(values)
    }
    setCurrentArticleId(null)
    setValues(initialFormValues)
  }

  const isDisabled = () => {
    // ✨ implement
    // Make sure the inputs have some values
    return !values.title || !values.text || !values.topic 
  }

  const formValue = currentArticleId ? 'Edit Article' : 'Create Article'

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{formValue}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={setCurrentArticleId}>Cancel edit</button>
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}