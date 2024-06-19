// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'



test('sanity', () => {
  expect(true).toBe(true)
})


describe('Spinner is working' , () => {

  test('Spinner rendered when "on" prop is truthy', () => {
    render(<Spinner on = {true} />)
    const spinner = screen.getByText('Please wait...')
    expect(spinner).toBeInTheDocument
} )

test('does not render Spinner when "on" prop is falsey', () => {
  render(<Spinner on={false} />)
   const spinner = screen.queryByText('Please wait...')
  expect(spinner).not.toBeInTheDocument()
})

test('does not render Spinner when "on" prop is null', () => {
  render(<Spinner/>)
   const spinner = screen.queryByText('Please wait...')
  expect(spinner).not.toBeInTheDocument()
})

})










