import * as Yup from 'yup'

export const ChangePasswordSchema = Yup.object({
	password: Yup.string().required('Current password is required'),
	newPassword: Yup.string()
		.min(8, 'Password must be minimum of 8 characters')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])(.{8,})$/,
			'Password must contain the following lowercase, uppercase, number, special character and must be minumum of 8 characters'
		)
		.required('Please enter a valid password'),
	confirmNewPassword: Yup.string()
		.oneOf([Yup.ref('newPassword')], 'Passwords must match')
		.required('confirm Password is required')
})
