import { Router } from 'express'

import { ValidateSchema } from '../helpers'
import {
	CreateProduct,
	CreateProductSchema,
	FetchProducts
} from '../app/product'
import { Authenticate, RoleRestriction } from '../middlewares'
import { UserRole } from '../app/user'

const route = Router()

export default (app: Router) => {
	app.use('/v1/product', route)

	route.post(
		'/',
		Authenticate,
		RoleRestriction([UserRole.ADMIN]),
		ValidateSchema({
			schema: CreateProductSchema,
			requestLocation: 'body'
		}),
		CreateProduct
	)

	route.get('/all', FetchProducts)
}