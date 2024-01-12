import { Router } from 'express'

import { ValidateSchema } from '../helpers'
import {
	Signup,
	SignupSchema,
	SigninSchema,
	Signin,
	Signout,
	ForgotPassword,
	ForgotPasswordSchema
} from '../app/auth'
import { Authenticate } from '../middlewares'

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

	route.post(
		'/forgot-password',
		ValidateSchema({
			schema: ForgotPasswordSchema,
			requestLocation: 'body'
		}),
		ForgotPassword
	)

	route.delete('/signout', Authenticate, Signout)
}
