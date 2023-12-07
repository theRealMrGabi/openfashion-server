import express from 'express'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import cors from 'cors'

import { globalErrorHandler } from './helpers'
import routes from './routes'
import config from './config'

const app = express()

app.use(cors())
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** Sanitize data input against NoSql query injection */
app.use(mongoSanitize())

/** prevent against HTTP parameter pollution */
app.use(hpp())

app.use(config.api.prefix, routes())

app.use(globalErrorHandler)

export default app
