const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const statics = require('koa-static')
const path = require('path')
const port = 3000
const staticPath = path.join(__dirname, './dist')

const processUploadFile = async (ctx) => {
  // do something
  // ...
  ctx.body = 'ok'
}

app.use(statics(staticPath))
app.use(views(path.join(__dirname, './'), {
  options: { settings: { views: path.join(__dirname) } },
  //   map: { 'ejs': 'ejs' },
  extension: 'html'
}))


// route
app.use(async (ctx, next) => {
  console.log('[request path]', ctx.path)
  if (ctx.path == '/upload') {
    await processUploadFile(ctx)
  } else {
    await ctx.render('index.html')
  }
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
