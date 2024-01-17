import { Router } from 'express'

import authRoutes from './auth.routes'
import indexRoutes from './index.routes'
import productRoutes from './product.routes'
import unhandledRoutes from './unhandled.routes'
import userRoutes from './user.routes'

export default () => {
	const app = Router()

	indexRoutes(app)
	authRoutes(app)
	userRoutes(app)
	productRoutes(app)

	unhandledRoutes(app)

	return app
}
