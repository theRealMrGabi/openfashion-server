import mongoose, { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import { type ICart } from './'

export interface CartModel extends ICart {}

const CartItemSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	quantity: {
		type: Number,
		required: true,
		default: 1
	}
})

const CartSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true
		},
		items: [CartItemSchema]
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

CartSchema.plugin(paginate)

const Cart = model<CartModel, mongoose.PaginateModel<CartModel>>(
	'Cart',
	CartSchema
)

export default Cart
