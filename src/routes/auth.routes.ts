import { Router } from 'express'

import { ValidateSchema } from '../helpers'
import { Signup, SignupSchema, SigninSchema, Signin } from '../app/auth'

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

	route.post(
		'/signin',
		ValidateSchema({
			schema: SigninSchema,
			requestLocation: 'body'
		}),
		Signin
	)
}
