import express from 'express'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
console.log(path.resolve())
config({ path: path.resolve('config/config.env')})
import initApp from './src/utils/initiateApp.js'

const app = express()
initApp(app, express)