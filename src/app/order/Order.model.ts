import mongoose, { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import type { IOrder, OrderStatus } from './'
import { OrderStatusEnum } from './'

export interface OrderModel extends IOrder {}

const OrderSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		cartItems: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: {
					type: Number,
					required: true
				}
			}
		],
		totalPrice: {
			type: Number,
			required: true
		},
		totalQuantity: {
			type: Number,
			required: true
		},
		checkoutSessionId: {
			type: String,
			required: true
		},
		status: {
			type: String,
			enum: OrderStatusEnum,
			default: 'accepted' as OrderStatus
		}
	},
	{
		timestamps: true,
		toJSON: {
			// eslint-disable-next-line no-unused-vars
			transform(_doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
			}
		}
	}
)

OrderSchema.plugin(paginate)

const Order = model<OrderModel, mongoose.PaginateModel<OrderModel>>(
	'Order',
	OrderSchema
)

export default Order
