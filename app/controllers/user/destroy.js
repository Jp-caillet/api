// Core
 const Schema = require('../../models/users.js')
const mongoose = require('mongoose')

module.exports = class Destroy {
  constructor (app) {
    this.app = app

    this.run()
  }

 getModel (res) {
    mongoose.connect('mongodb://localhost:27017/api')

    this.db = mongoose.connection
    this.db.on('error', () => {
      res.status(500).json({
        'code': 500,
        'message': 'Internal Server Error'
      })

      console.error(`[ERROR] user/create getModel() -> Connetion fail`)
    })

    const User = mongoose.model('User', Schema)

    return User
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.delete('/user/destroy/:id', (req, res) => {
      try {
         this.getModel(res).findOne({id: req.params.id}, function (err, user) { 
          if (err) {
            console.log(err)
            res.status(404).json({
              code: 404,
              message: 'User not found'
            })
          }
          else{

            res.status(200).json("user delete")
          }

        }).remove().exec()

      } catch (e) {
        console.error(`[ERROR] user/show/:id -> ${e}`)
        res.status(400).json({
          'code': 400,
          'message': 'Bad request'
        })
      }

    })
  }

  /**
   * Run
   */
  run () {
    this.middleware()
  }
}
