import request from 'supertest'
import { randUuid } from '@ngneat/falso'

import app from '../../app'
import {
	SigninUser,
	SigninAdmin,
	fetchProducts,
	createProduct,
	addItemToCart
} from '../../../test/helpers'
import { stripe } from '../../helpers/stripe'

describe('Payment controller should', () => {
	const url = '/api/v1/payment/check-out'
	const ordersUrl = '/api/v1/orders'

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('throw error if user has no item in cart', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)

		expect(response.body.message).toEqual('User cart is empty')
	})

	it('accept payment and create an order', async () => {
		const sessionId = randUuid()
		const mockStripe = jest.fn().mockResolvedValue({
			id: sessionId
		})

		jest
			.spyOn(stripe.checkout.sessions, 'create')
			.mockImplementation(mockStripe)

		const { token: adminToken } = await SigninAdmin()
		const { token } = await SigninUser()

		await createProduct({ token: adminToken })
		await createProduct({ token: adminToken })
		await createProduct({ token: adminToken })

		const { products } = await fetchProducts()

		const productId1 = products[0].id
		const productId2 = products[1].id
		const productId3 = products[2].id

		await addItemToCart({
			productId: productId1,
			quantity: 5,
			token
		})
		await addItemToCart({
			productId: productId2,
			quantity: 2,
			token
		})
		await addItemToCart({
			productId: productId3,
			quantity: 8,
			token
		})

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(mockStripe).toHaveBeenCalled()
		expect(mockStripe).toHaveBeenCalledTimes(1)

		expect(response.body.message).toEqual('Checkout initiated')
		expect(response.body.data.sessionId).toEqual(sessionId)

		const ordersResponse = await request(app)
			.get(ordersUrl)
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200)

		const order = ordersResponse.body.data.orders[0]

		expect(ordersResponse.body.message).toEqual('All orders fetched')
		expect(order.status).toEqual('accepted')
	})
})
