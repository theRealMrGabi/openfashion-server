import { Document } from 'mongoose'
import { InferType } from 'yup'

import { CreateProductSchema, RateProductSchema } from './'

export type CreateProductPayload = InferType<typeof CreateProductSchema>

export type RateProductPayload = InferType<typeof RateProductSchema>

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
	isDeleted: boolean
	deletedAt: Date | number | string | null
}

export const ProductCategoryEnum = [
	'men clothing',
	'jewelery',
	'electronics',
	'women clothing'
] as const

export type ProductCategory = (typeof ProductCategoryEnum)[number]
