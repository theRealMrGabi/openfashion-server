import request from 'supertest'
import {
	randBrand,
	randNumber,
	randProductDescription,
	randUrl,
	randProductCategory
} from '@ngneat/falso'

import app from '../../app'
import { SigninUser, SigninAdmin } from '../../../test/helpers'

const productPayload = {
	title: randBrand(),
	price: randNumber(),
	description: randProductDescription(),
	image: randUrl(),
	category: 'electronics'
}

const createProduct = async () => {
	const url = '/api/v1/product'

	const { token } = await SigninAdmin()

	const response = await request(app)
		.post(url)
		.set('Authorization', `Bearer ${token}`)
		.send({
			...productPayload
		})
		.expect(201)

	expect(response.body.message).toEqual('Product created')
}

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
		await createProduct()

		const { token } = await SigninUser()

		const response = await request(app)
			.get(url)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

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
