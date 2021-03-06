// Dependencie
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const bdd = require('mongoose')

// Core
const routes = require('./controllers/routes.js')


/**
 * Server
 */
module.exports = class Server {
  constructor () {
    this.app = express()

    this.run()
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.use(compression())
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({
      'extended': true
    }))
    this.app.use(bodyParser.json())
  }

  /**
   * Routes
   */
  routes () {
    new routes.user.Create(this.app)
    new routes.user.Show(this.app)
    new routes.user.Search(this.app)
    new routes.user.Update(this.app)
    new routes.user.Destroy(this.app)

    // If route not exist
    this.app.use((req, res) => {
      res.status(404).json({
        'code': 404,
        'message': 'Not Found'
      })
    })
  }

  /**
   * Security
   */
  security () {
    this.app.use(helmet())
    this.app.disable('x-powered-by')
  }

/**
   * Test database
   */

testBdd () {
  bdd.connect('mongodb://localhost/api')
  let db = bdd.connection

// Check connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
  console.log("tu es connecté bravo")
});
db.close()
}



  /**
   * Run
   */


  run () {
    
    try {
      this.testBdd()
      this.security()
      this.middleware()
      this.routes()
      this.app.listen(4000)
    } catch (e) {
      console.error(`[ERROR] Server -> ${e}`)
    }
  }
}
