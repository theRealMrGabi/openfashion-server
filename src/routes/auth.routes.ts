import { Router } from 'express'

import { ValidateSchema } from '../helpers'
import {
	Signup,
	SignupSchema,
	SigninSchema,
	Signin,
	Signout,
	ForgotPassword,
	EmailSchema,
	ResetPasswordSchema,
	ResetPassword
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
			schema: EmailSchema,
			requestLocation: 'body'
		}),
		ForgotPassword
	)

	route.post(
		'/reset-password',
		ValidateSchema({
			schema: EmailSchema,
			requestLocation: 'query'
		}),
		ValidateSchema({
			schema: ResetPasswordSchema,
			requestLocation: 'body'
		}),
		ResetPassword
	)

	route.delete('/signout', Authenticate, Signout)
}
