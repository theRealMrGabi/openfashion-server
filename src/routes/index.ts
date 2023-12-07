import { Router } from 'express'

import authRoutes from './auth.routes'
import indexRoutes from './index.routes'
import unhandledRoutes from './unhandled.routes'

export default () => {
	const app = Router()

	indexRoutes(app)
	authRoutes(app)

	unhandledRoutes(app)

	return app
}
