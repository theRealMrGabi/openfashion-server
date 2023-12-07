import 'dotenv/config'

if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined')
if (!process.env.PORT) throw new Error('PORT must be defined')
if (!process.env.APP_NAME) throw new Error('APP_NAME must be defined')

const config = {
	MONGO_URI: process.env.MONGO_URI,
	api: {
		prefix: '/api'
	},
	PORT: parseInt(process.env.PORT, 10),
	APP_NAME: process.env.APP_NAME,
	NODE_ENV: process.env.NODE_ENV,
	isProduction: process.env.NODE_ENV === 'production' ? true : false
}

export default config
