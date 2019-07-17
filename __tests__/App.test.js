import App from '../src/js/App'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'

jest.mock('nyc-lib/nyc/ol/FinderApp')

beforeEach(() => {
  FinderApp.mockClear()
})

describe('constructor', () => {
  test('constructor', () => {
    const app = new App()
    expect(App).toHaveBeenCalledTimes(1)
    expect(app instanceof FinderApp).toBe(true)
  })
})