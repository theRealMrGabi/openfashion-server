import mongoose, { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import type { IProduct } from './'
import { ProductCategoryEnum } from './'

export interface ProductModel extends IProduct {}

const ProductSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		category: {
			type: String,
			enum: ProductCategoryEnum,
			required: true
		},
		image: {
			type: String,
			required: true
		},
		rating: {
			rate: {
				type: Number,
				default: 0
			},
			count: {
				type: Number,
				default: 0
			}
		},
		createdBy: {
			type: String,
			ref: 'User'
		},
		updatedBy: {
			type: String,
			ref: 'User'
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
				delete ret.password
				delete ret.createdBy
				delete ret.updatedBy
			}
		}
	}
)

ProductSchema.plugin(paginate)

const Product = model<ProductModel, mongoose.PaginateModel<ProductModel>>(
	'Product',
	ProductSchema
)

export default Product
