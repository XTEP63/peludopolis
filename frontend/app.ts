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

app.get("/me", (_req, res) => {
    fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJwYXRvQGV4YW1wbGUuY29tIiwicm9sZSI6ImNsaWVudGUiLCJpYXQiOjE3Nzc2ODc4OTAsImV4cCI6MTc3NzY5NTA5MH0.zhUx_d8hqxXOq2_9suzAhNvf6M8uLZ9M7fylheXdGf4`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            res.render('me', { user: data.data })
        } else {
            res.render('me', { user: null })
        }
    })
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