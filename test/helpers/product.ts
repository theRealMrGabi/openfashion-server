import request from 'supertest'
import {
	randBrand,
	randNumber,
	randProductDescription,
	randUrl
} from '@ngneat/falso'

import { IProduct } from '../../src/app/product'
import app from '../../src/app'

export const productPayload = {
	title: randBrand(),
	price: randNumber(),
	description: randProductDescription(),
	image: randUrl(),
	category: 'electronics'
}

export const updateProductPayload = {
	title: 'Nike Air Jordan',
	price: randNumber(),
	description: randProductDescription(),
	image: randUrl(),
	category: 'men clothing'
}

export const createProduct = async ({ token }: { token: string }) => {
	const url = '/api/v1/product'

	const response = await request(app)
		.post(url)
		.set('Authorization', `Bearer ${token}`)
		.send({
			...productPayload
		})
		.expect(201)

	expect(response.body.message).toEqual('Product created')
}

export const fetchProducts = async () => {
	const response = await request(app).get('/api/v1/product/all').expect(200)

	const products = response.body.data.data as IProduct[]
	expect(products).toBeInstanceOf(Array)

	return { products }
}
