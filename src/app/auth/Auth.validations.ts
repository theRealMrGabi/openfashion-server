import * as Yup from 'yup'

export const EmailSchema = Yup.object({
	email: Yup.string()
		.email('Valid email address is required')
		.trim()
		.required('Email address is required')
})

export const SignupSchema = EmailSchema.shape({
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

export const SigninSchema = EmailSchema.shape({
	password: Yup.string().required('Please enter a valid password')
})

export const ResetPasswordSchema = Yup.object({
	otpCode: Yup.string()
		.trim()
		.length(6, 'OTP code must be 6 digits')
		.matches(/^[0-9]{6}$/, 'OTP code must be 6 digits and contain only numbers')
		.required('OTP code is required'),
	password: Yup.string()
		.min(8, 'Password must be minimum of 8 characters')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])(.{8,})$/,
			'Password must contain the following lowercase, uppercase, number, special character and must be minumum of 8 characters'
		)
		.required('Please enter a valid password'),
	confirmPassword: Yup.string()
		.required('confirm Password is required')
		.oneOf([Yup.ref('password')], 'Passwords must match')
})
