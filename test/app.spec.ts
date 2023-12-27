import request from 'supertest'

import app from '../src/app'
import config from '../src/config'

describe('App runs properly', () => {
	it('without crashing', async () => {
		const response = await request(app).get('/api/v1')
		expect(response.statusCode).toBe(200)
	})
})

describe('health checker', () => {
	it('gives health status of app', async () => {
		const response = await request(app).get('/api/v1/health')

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
