import 'dotenv/config'

if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined')
if (!process.env.PORT) throw new Error('PORT must be defined')
if (!process.env.APP_NAME) throw new Error('APP_NAME must be defined')
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be defined')
if (!process.env.JWT_ISSUER) throw new Error('JWT_ISSUER must be defined')
if (!process.env.MAIL_SENDER_EMAIL)
	throw new Error('MAIL_SENDER_EMAIL must be defined')
if (!process.env.MAIL_SENDER_NAME)
	throw new Error('MAIL_SENDER_NAME must be defined')
if (!process.env.POSTMARK_SERVER_API_KEY)
	throw new Error('POSTMARK_SERVER_API_KEY must be defined')
if (!process.env.REDIS_URL) throw new Error('REDIS_URL must be defined')
if (!process.env.STRIPE_PUBLISHABLE_KEY)
	throw new Error('STRIPE_PUBLISHABLE_KEY must be defined')
if (!process.env.STRIPE_SECRET_KEY)
	throw new Error('STRIPE_SECRET_KEY must be defined')
if (!process.env.FRONTEND_STRIPE_SUCCESS_URL)
	throw new Error('FRONTEND_STRIPE_SUCCESS_URL must be defined')
if (!process.env.FRONTEND_STRIPE_CANCEL_URL)
	throw new Error('FRONTEND_STRIPE_CANCEL_URL must be defined')

const config = {
	MONGO_URI: process.env.MONGO_URI,
	api: {
		prefix: '/api'
	},
	PORT: parseInt(process.env.PORT, 10),
	APP_NAME: process.env.APP_NAME,
	NODE_ENV: process.env.NODE_ENV,
	isProduction: process.env.NODE_ENV === 'production' ? true : false,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_ISSUER: process.env.JWT_ISSUER,
	MAIL_SENDER_EMAIL: process.env.MAIL_SENDER_EMAIL,
	MAIL_SENDER_NAME: process.env.MAIL_SENDER_NAME,
	POSTMARK_SERVER_API_KEY: process.env.POSTMARK_SERVER_API_KEY,
	REDIS_URL: process.env.REDIS_URL,
	STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
	STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
	FRONTEND_STRIPE_SUCCESS_URL: process.env.FRONTEND_STRIPE_SUCCESS_URL,
	FRONTEND_STRIPE_CANCEL_URL: process.env.FRONTEND_STRIPE_CANCEL_URL
}

export default config
