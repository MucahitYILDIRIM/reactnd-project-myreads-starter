const API = 'https://reactnd-books-api.udacity.com'

// BooksAPI reads/creates its token at import time, so every test loads a
// fresh copy of the module after preparing localStorage.
const loadAPI = () => {
  jest.resetModules()
  return require('./BooksAPI')
}

const mockFetchResponse = (body) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(body) })
  )
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  delete global.fetch
})

describe('token', () => {
  it('generates and stores a token when none exists', () => {
    loadAPI()
    expect(typeof localStorage.token).toBe('string')
    expect(localStorage.token.length).toBeGreaterThan(0)
    expect(localStorage.token.length).toBeLessThanOrEqual(8)
  })

  it('reuses an existing token and sends it as Authorization header', () => {
    localStorage.token = 'existing'
    mockFetchResponse({ books: [] })
    const BooksAPI = loadAPI()

    expect(localStorage.token).toBe('existing')
    return BooksAPI.getAll().then(() => {
      expect(fetch.mock.calls[0][1].headers.Authorization).toBe('existing')
    })
  })
})

describe('get', () => {
  it('requests a single book and resolves with it', () => {
    localStorage.token = 'tok'
    const book = { id: 'abc', title: 'A Book' }
    mockFetchResponse({ book })
    const BooksAPI = loadAPI()

    return BooksAPI.get('abc').then(result => {
      expect(result).toEqual(book)
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(`${API}/books/abc`, {
        headers: { Accept: 'application/json', Authorization: 'tok' }
      })
    })
  })
})

describe('getAll', () => {
  it('requests all books and resolves with the books array', () => {
    localStorage.token = 'tok'
    const books = [{ id: '1' }, { id: '2' }]
    mockFetchResponse({ books })
    const BooksAPI = loadAPI()

    return BooksAPI.getAll().then(result => {
      expect(result).toEqual(books)
      expect(fetch).toHaveBeenCalledWith(`${API}/books`, {
        headers: { Accept: 'application/json', Authorization: 'tok' }
      })
    })
  })
})

describe('update', () => {
  it('PUTs the new shelf for the book and resolves with the raw response', () => {
    localStorage.token = 'tok'
    const response = { currentlyReading: ['1'], wantToRead: [], read: [] }
    mockFetchResponse(response)
    const BooksAPI = loadAPI()

    return BooksAPI.update({ id: '1', title: 'x' }, 'currentlyReading').then(result => {
      expect(result).toEqual(response)
      expect(fetch).toHaveBeenCalledWith(`${API}/books/1`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: 'tok',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shelf: 'currentlyReading' })
      })
    })
  })
})

describe('search', () => {
  it('POSTs the query and resolves with the books array', () => {
    localStorage.token = 'tok'
    const books = [{ id: '1', title: 'Android' }]
    mockFetchResponse({ books })
    const BooksAPI = loadAPI()

    return BooksAPI.search('android').then(result => {
      expect(result).toEqual(books)
      expect(fetch).toHaveBeenCalledWith(`${API}/search`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'tok',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: 'android' })
      })
    })
  })

  it('resolves with undefined when the response has no books field', () => {
    mockFetchResponse({ error: 'empty query' })
    const BooksAPI = loadAPI()

    return BooksAPI.search('zzz').then(result => {
      expect(result).toBeUndefined()
    })
  })
})

describe('error handling', () => {
  it('propagates network failures to the caller', () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('offline')))
    const BooksAPI = loadAPI()

    return expect(BooksAPI.getAll()).rejects.toThrow('offline')
  })
})
