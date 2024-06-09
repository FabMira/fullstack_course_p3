const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('reqContent', function getContent (req) {
  if(req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :reqContent'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.random().toString(16).slice(2)
    : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
  const reqTime = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${reqTime.toString()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person) : res.status(400).send(`id: '${id}' does not exist in phonebook`) 
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const names = persons.map(person => person.name)

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  } else if (names.includes(body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})