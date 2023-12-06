import { Router } from 'express'
import { HealthCheck, Index } from '../app/AppController'

const route = Router()

export default (app: Router) => {
	app.use('/', route)

	route.get('/', Index)
	route.get('/health', HealthCheck)
}
