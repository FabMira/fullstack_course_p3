const express = require('express')
const app = express()

let persons = [
]

app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`is ${PORT}`)
})