import app from '../src/app'
import request from 'supertest'
import config from '../src/config'

describe('App runs properly', () => {
	it('without crashing', async () => {
		const response = await request(app).get('/')
		expect(response.statusCode).toBe(200)
	})
})

describe('health checker', () => {
	it('gives health status of app', async () => {
		const response = await request(app).get('/health')

		const healthCheck = {
			uptime: process.uptime(),
			timestamp: Date.now(),
			message: `${config.APP_NAME} up and running`
		}

		expect(response.statusCode).toBe(200)
		expect(response.body.data.uptime).toBeGreaterThan(0)
		expect(response.body.data.message).toBe(healthCheck.message)
	})
})
