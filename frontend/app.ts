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

// Página de perfil del usuario (me)
app.get("/me", (_req, res) => {
    res.render('me', { user: null })
})

// Página de perfil
app.get("/profile", (_req, res) => {
    res.render('profile', { user: null })
})

// Página de edición de perfil
app.get("/profile/edit", (_req, res) => {
    res.render('profile-edit', { user: null })
})

// Página de mascotas
app.get("/pets", (_req, res) => {
    res.render('pets', { user: null })
})

// Página de reservaciones
app.get("/reservations", (_req, res) => {
    res.render('reservations', { user: null })
})

// Página de reviews
app.get("/reviews", (_req, res) => {
  res.render('reviews')
})

// Página de habitaciones
app.get("/habitaciones", (_req, res) => {
  res.render('habitaciones')
})

//Panel de admin
app.get("/admin-panel", (_req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'))
})
export default app;