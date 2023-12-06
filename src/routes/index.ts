import { Router } from 'express'

import indexRoutes from './index.routes'
import unhandledRoutes from './unhandled.routes'

export default () => {
	const app = Router()

	indexRoutes(app)
	unhandledRoutes(app)

	return app
}
