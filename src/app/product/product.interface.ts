import { Document } from 'mongoose'
import { InferType } from 'yup'

import { CreateProductSchema } from './'

export type CreateProductPayload = InferType<typeof CreateProductSchema>

export interface IProduct extends Document {
	id: string
	title: string
	price: number
	description: string
	category: string
	image: string
	rating: {
		rate: number
		count: number
	}
	createdBy: string
	updatedBy: string
}

export const ProductCategoryEnum = [
	'men clothing',
	'jewelery',
	'electronics',
	'women clothing'
] as const

export type ProductCategory = (typeof ProductCategoryEnum)[number]
