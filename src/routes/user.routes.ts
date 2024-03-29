import { Router } from 'express'

import { ValidateSchema } from '../helpers'
import {
	GetCurrentUser,
	GetAllUsers,
	GetUserByID,
	UserRole,
	ChangePassword,
	ChangePasswordSchema,
	GrantOrRevokeUserAccess
} from '../app/user'
import {
	Authenticate,
	RoleRestriction,
	ValidateMongooseID
} from '../middlewares'

const route = Router()

export default (app: Router) => {
	app.use('/v1/user', route)

	route.get(
		'/me',
		Authenticate,
		ValidateMongooseID({
			message: 'Invalid User ID!'
		}),
		GetCurrentUser
	)

	route.get(
		'/all',
		Authenticate,
		RoleRestriction([UserRole.ADMIN]),
		GetAllUsers
	)

	route.get(
		'/:id',
		Authenticate,
		RoleRestriction([UserRole.ADMIN]),
		ValidateMongooseID({
			message: 'Invalid User ID!'
		}),
		GetUserByID
	)

	route.post(
		'/change-password',
		Authenticate,
		ValidateMongooseID({
			message: 'User not found'
		}),
		ValidateSchema({
			schema: ChangePasswordSchema,
			requestLocation: 'body'
		}),
		ChangePassword
	)

	route.patch(
		'/access/:id',
		Authenticate,
		RoleRestriction([UserRole.ADMIN]),
		ValidateMongooseID({
			message: 'Invalid User ID!'
		}),
		GrantOrRevokeUserAccess
	)
}
