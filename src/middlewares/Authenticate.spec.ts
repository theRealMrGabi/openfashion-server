import request from 'supertest'

import app from '../app'
import { SigninUser } from '../../test/helpers'

describe('Authenticate middleware should', () => {
	const currentUserUrl = '/api/v1/user/me'

	it('throw error if Authorization header is not present', async () => {
		const response = await request(app).get(currentUserUrl).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error if Authorization type is not Bearer token', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.get(currentUserUrl)
			.set('Authorization', token)
			.expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error if token is expired or invalid', async () => {
		const response = await request(app)
			.get(currentUserUrl)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzI4MDk0NWRlZmJkYTg0YjdhNmIwMCIsImlhdCI6MTcwMzY5MzkxMSwiZXhwIjoxNzAzNjk0MDMxLCJpc3MiOiJPcGVuRmFzaGlvbiJ9.96rVHHGIoBgXoxLBVHkUfnUlaBq21NmHG1OCs8zR7EY'
			)
			.expect(401)

		expect(response.body.message).toEqual('Invalid/expired token')
	})

	it('run next function if successful', async () => {
		const { token } = await SigninUser()

		await request(app)
			.get(currentUserUrl)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
	})
})
