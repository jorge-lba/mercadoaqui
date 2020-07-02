import app from './app'

require('@babel/core').transform('code', {
  plugins: ['@babel/plugin-transform-typescript']
})

app.listen(process.env.PORT || 3333)
