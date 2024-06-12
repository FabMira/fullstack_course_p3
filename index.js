require('dotenv').config({path: '.env'}) //dotenv: libreria para gestion de variables de entorno
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./person')

morgan.token('reqContent', function getContent (req) {
  if(req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :reqContent'))
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

let persons = []

app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
      res.json(person)
      persons = (JSON.parse(JSON.stringify(person)))
    })
})

app.get('/info', (req, res) => {
  const reqTime = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${reqTime.toString()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id)
  .then(person => {
    if(person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      res.json(result)
      persons = persons.filter(person => person.name != result.name)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  let names = (persons.map(person => (person.name.toLowerCase())))

  Person.find({})
    .then(result => {
      result.forEach(person => {
       names = names.concat(person.name)
      })
    })

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }else if (names.includes(body.name.toLowerCase())) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})