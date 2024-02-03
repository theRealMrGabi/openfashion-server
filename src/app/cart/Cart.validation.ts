import * as Yup from 'yup'

export const AddItemToCartSchema = Yup.object({
	productId: Yup.string().required('Product id is required'),
	quantity: Yup.number()
		.typeError('Quantity must be a number')
		.positive('Quantity must be a positive number')
		.integer('Quantity must be an integer')
		.min(1)
		.required('Quantity is required')
})
