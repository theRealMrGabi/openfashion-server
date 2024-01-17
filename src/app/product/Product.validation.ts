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
	// rating: Yup.object().shape({
	// 	rate: Yup.number().positive('Rate must be a positive number').min(0).max(5),
	// 	count: Yup.number()
	// 		.positive('Rating count must be a positive number')
	// 		.min(0)
	// })
})
