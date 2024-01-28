import request from 'supertest'

import app from '../../src/app'

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

	const cartItems = response.body.data
	const message = response.body.message

	return { cartItems, message }
}
