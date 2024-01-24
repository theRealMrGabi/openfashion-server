import * as Yup from 'yup'
import { ProductCategory } from './'

export const CreateProductSchema = Yup.object({
	title: Yup.string().required('Title is required'),
	price: Yup.number()
		.positive('Price must be a positive number')
		.required('Price is required'),
	description: Yup.string().required('Description is required'),
	image: Yup.string()
		.url('Invalid image URL')
		.required('Image URL is required'),
	category: Yup.mixed<ProductCategory>()
		.oneOf(
			['electronics', 'jewelery', 'men clothing', 'women clothing'],
			'Invalid category'
		)
		.required('Category is required') as Yup.Schema<ProductCategory>
})

export const RateProductSchema = Yup.object({
	rating: Yup.number()
		.typeError('Rating must be a number')
		.positive('Rating must be a positive number')
		.integer('Rating must be an integer')
		.min(1)
		.max(5)
		.required('Rating is required')
})
