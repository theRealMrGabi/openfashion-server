import { Router } from 'express'
import { ValidateSchema } from '../helpers'

import {
	AddItemToCart,
	AddItemToCartSchema,
	RemoveItemFromCart,
	UpdateCartItem,
	EmptyCart,
	GetCartItems
} from '../app/cart'
import { Authenticate, ValidateMongooseID } from '../middlewares'

const route = Router()

export default (app: Router) => {
	app.use('/v1/cart', route)

	route.post(
		'/',
		Authenticate,
		ValidateSchema({
			schema: AddItemToCartSchema,
			requestLocation: 'body'
		}),
		AddItemToCart
	)

	route.get('/', Authenticate, GetCartItems)

	route.delete('/', Authenticate, EmptyCart)

	route.patch(
		'/',
		Authenticate,
		ValidateSchema({
			schema: AddItemToCartSchema,
			requestLocation: 'body'
		}),
		UpdateCartItem
	)

	route.delete(
		'/:id',
		Authenticate,
		ValidateMongooseID({
			message: 'Invalid Product ID'
		}),
		RemoveItemFromCart
	)
}
