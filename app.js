const express = require('express')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4');
const cors = require('cors');
const albumsQueue = require('./queues/albumsQueue')

const app = express()
const port = 4000

const db = require('./models')

// SERVER

var server = app.listen(port, () => console.log(`Aplication is on port:  ${port}!`))
app.use(bodyParser.json());
app.use(cors())
app.use(function(req, res, next) {
  // if (req.headers.authorization !== 'XYZ') {
    // return res.status(403).json({ error: 'Invalid or missing credentials!' });
  // }
  next();
});

const jsonParser = bodyParser.json()

// Add a client

app.post('/clients', jsonParser, (req, res) => {
  const { firstName, lastName, email, product, productCost, typeId } = req.body
  return db.client.create({ firstName, lastName, email, product, productCost, typeId})
    .then((client) => res.send({ firstName, lastName, email, product, productCost, typeId, id:client.id }))
    .catch((err) => {
      console.log('Sorry, cannot create a client :(', JSON.stringify(err))
      return res.status(400).send(err)
    })
})

// Get all clients

app.get('/clients', function (req, res) {
  return db.client.findAll()
    .then((clients) => res.send(clients))
    .catch((err) => {
      console.log('Sorry, theres no clients :(', JSON.stringify(err))
      return res.send(err)
    })
})

// Update a client

app.put('/clients/:id', jsonParser, (req, res) => {
  const id = parseInt(req.params.id)
  return db.client.findByPk(id)
  .then((client) => {
    if ( client === null ) {
      return res.status(400).send("Sorry, no client :(")
    }
    const { firstName, lastName, email, product, productCost } = req.body
    return client.update({ firstName, lastName, email, product, productCost })
      .then(() => res.send(client))
      .catch((err) => {
        console.log('Sorry, cannot update a client :(', JSON.stringify(err))
        res.status(400).send(err)
      })
  })
})

// Delete a client

app.delete('/clients/:id', (req, res) => {
  const id = parseInt(req.params.id)
  return db.client.findByPk(id)
    .then((client) => client.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('Sorry, cannot delete a client :(', JSON.stringify(err))
      res.status(400).send(err)
    })
})

app.get('/types', function (req, res) {
  return db.type.findAll()
    .then((types) => res.send(types))
    .catch((err) => {
      console.log('Sorry, no types', JSON.stringify(err))
      return res.send(err)
    })
})

app.post('/types', jsonParser, (req, res) => {
  const { name } = req.body
  return db.type.create({ name })
    .then((type) => res.send(type))
    .catch((err) => {
      console.log('Oooops! Can not create a type!', JSON.stringify(err))
      return res.status(400).send(err)
    })
})

app.get('/import', (req, res) => {
  albumsQueue.add({url: 'http://api.github.com/posts'})
  return res.send({status: 'done'})
})

module.exports = server;
