import request from 'supertest'

import app from '../../src/app'
import { CartProduct } from '../../src/app/cart'

export const addItemToCart = async ({
	productId,
	quantity,
	token
}: {
	productId: string
	quantity: number
	token: string
}) => {
	const url = '/api/v1/cart'

	const response = await request(app)
		.post(url)
		.set('Authorization', `Bearer ${token}`)
		.send({
			productId,
			quantity
		})
		.expect(200)

	expect(response.body.message).toEqual('Item added to cart')
}

export const getCartItems = async ({ token }: { token: string }) => {
	const url = '/api/v1/cart'

	const response = await request(app)
		.get(url)
		.set('Authorization', `Bearer ${token}`)
		.expect(200)

	const cartItems = response.body.data as CartProduct[]
	const message = response.body.message

	return { cartItems, message }
}
