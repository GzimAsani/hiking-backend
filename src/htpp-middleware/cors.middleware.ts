import { NextFunction, Request, Response } from "express"
import { config } from "../config"

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(config.port, function () {
  console.log('CORS-enabled web server listening on port ',config.port)
})