import { Router } from 'express'

import { ValidateSchema } from '../helpers'
import { Signup, SignupSchema } from '../app/auth'

const route = Router()

export default (app: Router) => {
	app.use('/v1/auth', route)

	route.post(
		'/signup',
		ValidateSchema({
			schema: SignupSchema,
			requestLocation: 'body'
		}),
		Signup
	)
}
