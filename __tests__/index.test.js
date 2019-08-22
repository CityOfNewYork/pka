import App from '../src/js/App'
import Content from 'nyc-lib/nyc/Content'
import nyc from 'nyc-lib/nyc'

jest.mock('../src/js/App')
jest.mock('nyc-lib/nyc/Content')

const cacheBust = nyc.cacheBust(5)

const mockContent = {
  messages: {},
  message: (key) => {
    return mockContent.messages[key]
  }
}

beforeEach(() => {
  App.mockClear()
  Content.mockClear()
  Content.loadCsv.mockImplementation(() => {
    return new Promise(resolve => {
      resolve(mockContent)
    })
  })
})

test('constructs instance of App', () => {
  expect.assertions(5)

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        expect(Content.loadCsv).toHaveBeenCalledTimes(1)
        expect(Content.loadCsv.mock.calls[0][0].url).toBe(`data/content.csv?${cacheBust}`)
        expect(App).toHaveBeenCalledTimes(1)
        expect(App.mock.calls[0][0]).toBe(mockContent)
        resolve(true)
      }, 500)
    })
  }

  require('../src/js/index')

  return test().then(result => {expect(result).toBe(true)})
})
