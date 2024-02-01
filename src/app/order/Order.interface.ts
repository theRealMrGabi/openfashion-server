import { Document, ObjectId } from 'mongoose'

export interface IOrder extends Document {
	user: ObjectId
	cartItems: {
		product: ObjectId
		quantity: number
	}[]
	totalPrice: number
	totalQuantity: number
	checkoutSessionId: string
	status: OrderStatus
	createdAt: string
	updatedAt: string
}

export const OrderStatusEnum = [
	'accepted',
	'cancelled',
	'processing',
	'delivered'
] as const

export type OrderStatus = (typeof OrderStatusEnum)[number]
