import { Router } from 'express'

import { Signup, SignupSchema } from '../app/auth'

const route = Router()

export default (app: Router) => {
	app.use('/v1/auth', route)

	route.post('/signup', SignupSchema, Signup)
}
