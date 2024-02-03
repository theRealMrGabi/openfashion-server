import { Router } from 'express'

import { GetAllOrders, GetOrderByID } from '../app/order'
import {
	Authenticate,
	RoleRestriction,
	ValidateMongooseID
} from '../middlewares'
import { UserRole } from '../app/user'

const route = Router()

export default (app: Router) => {
	app.use('/v1/orders', route)

	route.get('/', Authenticate, RoleRestriction([UserRole.ADMIN]), GetAllOrders)

	route.get(
		'/:id',
		ValidateMongooseID({
			message: 'Invalid Order ID'
		}),
		Authenticate,
		RoleRestriction([UserRole.ADMIN]),
		GetOrderByID
	)
}
