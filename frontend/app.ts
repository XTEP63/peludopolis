import express from "express"
import path from "path"

const app = express();
const rootDir = process.cwd();

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

app.use('/styles', express.static(path.join(rootDir, 'views/styles')));
app.use('/assets', express.static(path.join(rootDir, 'views/assets')));
app.use('/api', express.static(path.join(rootDir, 'src/api')));

app.get("/config.js", (_req, res) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000"

  res.type("application/javascript")
  res.send(`window.PELUDOPOLIS_API_URL = ${JSON.stringify(backendUrl)};`)
})

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

// Página de servicios
app.get(["/servicios", "/services"], (_req, res) => {
  res.render("servicios", { user: null })
})

// Página de habitaciones
app.get("/habitaciones", (_req, res) => {
  res.render('habitaciones')
})

app.get("/habitacion", (_req, res) => {
  res.render("habitacion", { user: null })
})

//Panel de admin
app.get("/admin-panel", (_req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'admin.html'))
})
export default app;