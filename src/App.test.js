import React from 'react'
import ReactDOM from 'react-dom'
import { Simulate } from 'react-dom/test-utils'
import App from './App'

/**
 This course is not designed to teach Test Driven Development.
 Feel free to use this file to test your application, but it
 is not required.
**/

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  document.body.removeChild(container)
  container = null
})

const render = () => ReactDOM.render(<App />, container)
const $ = (selector) => container.querySelector(selector)
const $$ = (selector) => Array.from(container.querySelectorAll(selector))
const texts = (selector) => $$(selector).map(el => el.textContent)

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

describe('main page', () => {
  beforeEach(render)

  it('shows the list view and not the search view by default', () => {
    expect($('.list-books')).not.toBeNull()
    expect($('.search-books')).toBeNull()
    expect($('.list-books-title h1').textContent).toBe('MyReads')
  })

  it('renders the three shelves in order', () => {
    expect(texts('.bookshelf-title')).toEqual([
      'Currently Reading',
      'Want to Read',
      'Read'
    ])
  })

  it('places each book on the expected shelf', () => {
    const shelves = $$('.bookshelf').map(shelf =>
      Array.from(shelf.querySelectorAll('.book-title')).map(el => el.textContent)
    )
    expect(shelves).toEqual([
      ['To Kill a Mockingbird', "Ender's Game"],
      ['1776', "Harry Potter and the Sorcerer's Stone"],
      ["The Hobbit", "Oh, the Places You'll Go!", 'The Adventures of Tom Sawyer']
    ])
  })

  it('renders an author and a cover for every book', () => {
    const books = $$('.book')
    expect(books).toHaveLength(7)
    books.forEach(book => {
      expect(book.querySelector('.book-authors').textContent).not.toBe('')
      const cover = book.querySelector('.book-cover')
      expect(cover.style.width).toBe('128px')
      expect(cover.style.backgroundImage).toMatch(/^url\(.*books\.google\.com/)
    })
  })

  it('offers the shelf-changer options on every book with "Move to..." disabled', () => {
    const selects = $$('.book-shelf-changer select')
    expect(selects).toHaveLength(7)
    selects.forEach(select => {
      const options = Array.from(select.options)
      expect(options.map(o => o.value)).toEqual([
        'move',
        'currentlyReading',
        'wantToRead',
        'read',
        'none'
      ])
      expect(options[0].disabled).toBe(true)
      expect(options.slice(1).every(o => !o.disabled)).toBe(true)
    })
  })
})

describe('navigation between pages', () => {
  beforeEach(render)

  it('opens the search page when "Add a book" is clicked', () => {
    Simulate.click($('.open-search button'))

    expect($('.search-books')).not.toBeNull()
    expect($('.list-books')).toBeNull()
    const input = $('.search-books-input-wrapper input')
    expect(input.getAttribute('type')).toBe('text')
    expect(input.getAttribute('placeholder')).toBe('Search by title or author')
    expect($$('.search-books-results .books-grid li')).toHaveLength(0)
  })

  it('returns to the main page when "Close" is clicked', () => {
    Simulate.click($('.open-search button'))
    Simulate.click($('.close-search'))

    expect($('.search-books')).toBeNull()
    expect($('.list-books')).not.toBeNull()
    expect($$('.book')).toHaveLength(7)
  })

  it('can toggle between pages repeatedly', () => {
    for (let i = 0; i < 3; i++) {
      Simulate.click($('.open-search button'))
      expect($('.search-books')).not.toBeNull()
      Simulate.click($('.close-search'))
      expect($('.list-books')).not.toBeNull()
    }
  })
})
