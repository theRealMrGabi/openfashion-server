import * as Yup from 'yup'

export const SignupSchema = Yup.object({
	email: Yup.string()
		.email('Valid email address is required')
		.trim()
		.required('Valid email address is required'),
	password: Yup.string()
		.min(8, 'Password must be minimum of 8 characters')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])(.{8,})$/,
			'Password must contain the following lowercase, uppercase, number, special character and must be minumum of 8 characters'
		)
		.required('Please enter a valid password'),
	firstName: Yup.string().trim().required('First name is required'),
	lastName: Yup.string().trim().required('Last name is required'),
	phoneNumber: Yup.string()
		.matches(
			/^([+234]{4})[0-9]{10}$/,
			'Phone number must match this format +2348023456789'
		)
		.required('Phone number is required')
})

export const SigninSchema = Yup.object({
	email: Yup.string()
		.email('Email address is required')
		.trim()
		.required('Email address is required'),
	password: Yup.string().required('Please enter a valid password')
})
