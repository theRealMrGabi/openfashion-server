import request from 'supertest'

import app from '../../app'
import {
	SigninUser,
	SigninAdmin,
	fetchProducts,
	createProduct,
	addItemToCart,
	getCartItems
} from '../../../test/helpers'

describe('Add item to cart controller should', () => {
	const url = '/api/v1/cart'

	it('allow only authenticated user to add item to cart', async () => {
		const response = await request(app).post(url).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw validation error if required fields are not passed', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Product id is required')
	})

	it('throw error if product to be added to cart is not found', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId: '65a717d8ed408dbfaf18e8cc',
				quantity: 5
			})
			.expect(404)

		expect(response.body.message).toEqual('Product not found')
	})

	it('successfully add an item to cart', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })

		const { token } = await SigninUser()
		const { products } = await fetchProducts()

		const productId = products[0].id

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId,
				quantity: 5
			})
			.expect(200)

		expect(response.body.message).toEqual('Item added to cart')
	})

	it('throw error if user tries to add same product multiple times', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })

		const { token } = await SigninUser()
		const { products } = await fetchProducts()

		const productId = products[0].id

		await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId,
				quantity: 5
			})
			.expect(200)

		const response = await request(app)
			.post(`${url}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId,
				quantity: 5
			})
			.expect(400)

		expect(response.body.message).toEqual(
			'This item already exists in user cart'
		)
	})
})

describe('Remove item from cart controller should', () => {
	const url = '/api/v1/cart'

	it('throw error if product to be added to cart is not found', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.delete(`${url}/65a717d8ed408dbfaf18e8cc`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)

		expect(response.body.message).toEqual('Product not found')
	})

	it('throw error if user cart is empty', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })

		const { token } = await SigninUser()
		const { products } = await fetchProducts()

		const productId = products[0].id

		const response = await request(app)
			.delete(`${url}/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)

		expect(response.body.message).toEqual('User cart is empty')
	})

	it('throw error if product to be removed is not in cart', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })
		await createProduct({ token: adminToken })

		const { products } = await fetchProducts()
		const { token } = await SigninUser()

		const productId = products[0].id

		await addItemToCart({
			productId,
			quantity: 7,
			token
		})

		const response = await request(app)
			.delete(`${url}/${products[1].id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)

		expect(response.body.message).toEqual('Product not in cart')
	})
})

describe('Update cart item controller should', () => {
	const url = '/api/v1/cart'
	const quantity = 5

	it('throw validation error if required fields are not passed', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Product id is required')
	})

	it('throw error if product to be added to cart is not found', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.patch(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId: '65a717d8ed408dbfaf18e8cc',
				quantity
			})
			.expect(404)

		expect(response.body.message).toEqual('Product not found')
	})

	it('throw error if user cart is empty', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })

		const { token } = await SigninUser()
		const { products } = await fetchProducts()

		const productId = products[0].id

		const response = await request(app)
			.patch(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId,
				quantity
			})
			.expect(400)

		expect(response.body.message).toEqual('User cart is empty')
	})

	it('throw error if product to be removed is not in cart', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })
		await createProduct({ token: adminToken })

		const { products } = await fetchProducts()
		const { token } = await SigninUser()

		const productId = products[0].id

		await addItemToCart({
			productId,
			quantity,
			token
		})

		const response = await request(app)
			.patch(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId: products[1].id,
				quantity
			})
			.expect(400)

		expect(response.body.message).toEqual('Product not in cart')
	})

	it('successfully update a cart item', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })

		const { products } = await fetchProducts()
		const { token } = await SigninUser()

		const productId = products[0].id

		await addItemToCart({
			productId,
			quantity,
			token
		})

		const response = await request(app)
			.patch(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				productId,
				quantity
			})
			.expect(200)

		expect(response.body.message).toEqual('Cart updated')

		const { cartItems } = await getCartItems({ token })

		const cartItem = cartItems.items[0]
		expect(cartItem.product).toBe(productId)
		expect(cartItem.quantity).toBe(quantity)
	})
})

describe('Get cart items controller should', () => {
	const url = '/api/v1/cart'

	it('throws message if cart is empty', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.get(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body.message).toEqual('Cart is empty')
	})

	it('successfully return cart items', async () => {
		const quantity = 5
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })

		const { products } = await fetchProducts()
		const { token } = await SigninUser()

		const productId = products[0].id

		await addItemToCart({
			productId,
			quantity,
			token
		})

		const response = await request(app)
			.get(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		const cartItems = response.body.data.items[0]

		expect(response.body.message).toEqual('Cart items fetched')

		expect(response.body.data.items).toBeInstanceOf(Array)
		expect(cartItems.quantity).toBe(quantity)
		expect(cartItems.product).toBe(productId)
	})
})

describe('Empty cart controller should', () => {
	const url = '/api/v1/cart'

	it('throw error if there is no item in cart to empty', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.delete(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)

		expect(response.body.message).toEqual('No item in cart to empty')
	})

	it('successfully empty cart', async () => {
		const quantity = 5
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })

		const { products } = await fetchProducts()
		const { token } = await SigninUser()

		const productId = products[0].id

		await addItemToCart({
			productId,
			quantity,
			token
		})

		const response = await request(app)
			.delete(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body.message).toEqual('Cart emptied')

		const { message } = await getCartItems({ token })
		expect(message).toEqual('Cart is empty')
	})
})
