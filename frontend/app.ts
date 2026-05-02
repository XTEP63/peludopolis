import express from "express"
import path from "path"

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/styles', express.static(path.join(__dirname, 'views/styles')));
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));

// Página de inicio
app.get("/", (_req, res) => {
  res.render('index', { user: null })
})

// Página de reviews
app.get("/reviews", (_req, res) => {
  res.render('reviews')
})

// Página de habitaciones
app.get("/habitaciones", (_req, res) => {
  res.render('habitaciones')
})

export default app;