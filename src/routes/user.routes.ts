import { Router } from 'express'

import { GetCurrentUser, GetAllUsers, GetUserByID, UserRole } from '../app/user'
import { Authenticate, RoleRestriction } from '../middlewares'

const route = Router()

export default (app: Router) => {
	app.use('/v1/user', route)

	route.get('/me', Authenticate, GetCurrentUser)
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
		GetUserByID
	)
}
