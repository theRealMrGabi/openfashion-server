import { Document, ObjectId } from 'mongoose'
import { InferType } from 'yup'

import { AddItemToCartSchema } from './'

export type AddItemToCartPayload = InferType<typeof AddItemToCartSchema>

export interface ICart extends Document {
	id: ObjectId
	user: ObjectId
	items: {
		product: string
		quantity: number
	}[]
}

export interface CartProduct {
	id: string
	name: string
	image: string
	price: number
	quantity: number
}
