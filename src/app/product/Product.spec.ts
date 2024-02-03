import request from 'supertest'
import { randBrand, randNumber, randProductCategory } from '@ngneat/falso'

import app from '../../app'
import {
	SigninUser,
	SigninAdmin,
	productPayload,
	updateProductPayload,
	createProduct,
	fetchProducts
} from '../../../test/helpers'

describe('Create product controller should', () => {
	const url = '/api/v1/product'

	it('allow only authenticated user to create product', async () => {
		const response = await request(app).post(url).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('allow only admin access to the endpoint', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(403)

		expect(response.body.message).toEqual(
			'You do not have permission to access this resource'
		)
	})

	it('throw validation error if required fields are not passed', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Title is required')
	})

	it('throw error if wrong category is passed', async () => {
		// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
		const { category, ...payload } = productPayload
		const { token } = await SigninAdmin()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				...payload,
				category: randProductCategory()
			})
			.expect(400)

		expect(response.body.message).toEqual('Invalid category')
	})

	it('throw error if invalid image URL is passed', async () => {
		// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
		const { image, ...payload } = productPayload
		const { token } = await SigninAdmin()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				...payload,
				image: randBrand()
			})
			.expect(400)

		expect(response.body.message).toEqual('Invalid image URL')
	})

	it('successfully create a product', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				...productPayload
			})
			.expect(201)

		expect(response.body.message).toEqual('Product created')
	})
})

describe('Fetch products controller should', () => {
	const url = '/api/v1/product/all'

	it('return empty array when there is no product in the DB', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.get(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body.data.data).toEqual([])
	})

	it('return array of products when products exists in the DB', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })

		const response = await request(app).get(url).expect(200)

		const product = response.body.data.data[0]
		expect(response.body.data.data).toBeInstanceOf(Array)

		expect(product.title).toBeDefined()
		expect(product.description).toBeDefined()
		expect(product.image).toBeDefined()
		expect(product.category).toBeDefined()
		expect(product.rating).toBeDefined()
		expect(product.createdAt).toBeDefined()
		expect(product.updatedAt).toBeDefined()
	})
})

describe('Update product controller should', () => {
	const url = '/api/v1/product'

	it('allow only Admin user have access', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.put(`${url}/randomId`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(403)

		expect(response.body.message).toEqual(
			'You do not have permission to access this resource'
		)
	})

	it('throw error if Invalid product ID is passed', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.put(`${url}/randomId`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Invalid Product ID')
	})

	it('throw errror if required fields are not passed', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })

		const response = await request(app)
			.put(`${url}/65a717d8ed408dbfaf18e8cc`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Title is required')
	})

	it('throw errror if product to be updated is not found', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })

		const response = await request(app)
			.put(`${url}/65a717d8ed408dbfaf18e8cc`)
			.set('Authorization', `Bearer ${token}`)
			.send(productPayload)
			.expect(404)

		expect(response.body.message).toEqual('Product not found')
	})

	it('successfully update a product', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })
		const { products } = await fetchProducts()

		const response = await request(app)
			.put(`${url}/${products[0]?.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(updateProductPayload)
			.expect(200)

		expect(response.body.message).toEqual('Product updated')
	})

	it('throw error if invalid product category is passed', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })
		const { products } = await fetchProducts()

		const response = await request(app)
			.put(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ ...productPayload, category: 'mens shoes' })
			.expect(400)

		expect(response.body.message).toEqual('Invalid category')
	})
})

describe('Rate product controller should', () => {
	const url = '/api/v1/product/rate'
	const rating = randNumber({ min: 1, max: 5 })

	it('throw error if Invalid product ID is passed', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.patch(`${url}/randomId`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Invalid Product ID')
	})

	it('throw errror if required fields are not passed', async () => {
		const { token } = await SigninAdmin()
		await createProduct({ token })

		const response = await request(app)
			.patch(`${url}/65a717d8ed408dbfaf18e8cc`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Rating is required')
	})

	it('throw errror if product to be rated is not found', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })

		const response = await request(app)
			.patch(`${url}/65a717d8ed408dbfaf18e8cc`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating })
			.expect(404)

		expect(response.body.message).toEqual('Product not found')
	})

	it('throw errror if you try rating a product you created', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })
		const { products } = await fetchProducts()

		const response = await request(app)
			.patch(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating })
			.expect(403)

		expect(response.body.message).toEqual('You can not rate your own product')
	})

	it('successfully rate a product', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })
		const { products } = await fetchProducts()
		const { token } = await SigninUser()

		const response = await request(app)
			.patch(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating })
			.expect(200)

		expect(response.body.message).toEqual('Product rated')

		const { products: ratedProducts } = await fetchProducts()

		expect(ratedProducts[0].rating.rate).toBe(rating)
		expect(ratedProducts[0].rating.count).toBe(1)
	})

	it('throw error if user tries to rate a product they have previously rated', async () => {
		const { token: adminToken } = await SigninAdmin()

		await createProduct({ token: adminToken })
		const { products } = await fetchProducts()
		const { token } = await SigninUser()

		await request(app)
			.patch(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating })
			.expect(200)

		const response = await request(app)
			.patch(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ rating })
			.expect(403)

		expect(response.body.message).toEqual(
			'You have previously rated this product'
		)

		const { products: ratedProducts } = await fetchProducts()

		expect(ratedProducts[0].rating.rate).toBe(rating)
		expect(ratedProducts[0].rating.count).toBe(1)
	})
})

describe('Delete product controller should', () => {
	const url = '/api/v1/product'

	it('allow only Admin user have access', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.delete(`${url}/randomId`)
			.set('Authorization', `Bearer ${token}`)
			.expect(403)

		expect(response.body.message).toEqual(
			'You do not have permission to access this resource'
		)
	})

	it('throw error if Invalid product ID is passed', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.delete(`${url}/randomId`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)

		expect(response.body.message).toEqual('Invalid Product ID')
	})

	it('throw errror if product to be deleted is not found', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })

		const response = await request(app)
			.delete(`${url}/65a717d8ed408dbfaf18e8cc`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)

		expect(response.body.message).toEqual('Product not found')
	})

	it('successfully delete a product', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })
		const { products } = await fetchProducts()

		const response = await request(app)
			.delete(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(response.body.message).toEqual('Product deleted')
	})

	it('throw error if user tries to delete an already deleted product', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })
		const { products } = await fetchProducts()

		const initialResponse = await request(app)
			.delete(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		expect(initialResponse.body.message).toEqual('Product deleted')

		const response = await request(app)
			.delete(`${url}/${products[0].id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404)

		expect(response.body.message).toEqual('Product not found')

		const { products: updatedProducts } = await fetchProducts()

		expect(updatedProducts).toEqual([])
	})
})

describe('Get product by ID controller should', () => {
	const url = '/api/v1/product'

	it('throw error if Invalid product ID is passed', async () => {
		const response = await request(app)
			.get(`${url}/65a717d8ed408dbfaf18e8cc`)
			.expect(404)

		expect(response.body.message).toEqual('Product not found!')
	})

	it('throw error if deleted product ID is passed', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })
		const { products } = await fetchProducts()

		const productId = products[0].id

		await request(app)
			.delete(`${url}/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		const response = await request(app).get(`${url}/${productId}`).expect(404)

		expect(response.body.message).toEqual('Product not found!')
	})

	it('successfully returned the fetched data', async () => {
		const { token } = await SigninAdmin()

		await createProduct({ token })
		const { products } = await fetchProducts()

		const productId = products[0].id

		const response = await request(app).get(`${url}/${productId}`).expect(200)

		const product = response.body.data
		expect(response.body.message).toEqual('Product fetched')

		expect(product.title).toBeDefined()
		expect(product.id).toBeDefined()
		expect(product.description).toBeDefined()
		expect(product.category).toBeDefined()
		expect(product.image).toBeDefined()
	})
})
