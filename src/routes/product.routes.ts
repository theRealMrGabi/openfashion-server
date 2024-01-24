import { Router } from 'express'

import { ValidateSchema } from '../helpers'
import {
	CreateProduct,
	CreateProductSchema,
	FetchProducts,
	UpdateProduct,
	RateProduct,
	RateProductSchema
} from '../app/product'
import {
	Authenticate,
	RoleRestriction,
	ValidateMongooseID
} from '../middlewares'
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

	route.put(
		'/:id',
		Authenticate,
		RoleRestriction([UserRole.ADMIN]),
		ValidateMongooseID({
			message: 'Invalid Product ID'
		}),
		ValidateSchema({
			schema: CreateProductSchema,
			requestLocation: 'body'
		}),
		UpdateProduct
	)

	route.patch(
		'/rate/:id',
		Authenticate,
		ValidateMongooseID({
			message: 'Invalid Product ID'
		}),
		ValidateSchema({
			schema: RateProductSchema,
			requestLocation: 'body'
		}),
		RateProduct
	)
}
