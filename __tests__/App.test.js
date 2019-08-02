import App from '../src/js/App'

describe('constructor', () => {
  test('constructor', () => {
    const app = new App()
    expect(App).toHaveBeenCalledTimes(1)
  })
})