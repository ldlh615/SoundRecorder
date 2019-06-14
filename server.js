const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const statics = require('koa-static')
const path = require('path')
const port = 3000

app.use(statics(__dirname + '/dist'))
app.use(views(path.join(__dirname, './'), {
  options: { settings: { views: path.join(__dirname) } },
  //   map: { 'ejs': 'ejs' },
  extension: 'html'
}))

app.use(async (ctx, next) => {
  await ctx.render('index.html')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
