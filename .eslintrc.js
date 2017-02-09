module.exports = {
  'root': true,
  'extends': 'standard',
  'env': {
    'node': true,
    'browser': true
  },
  'plugins': [
    'html'
  ],
  'rules': {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': ['error', 'never']
  }
}
