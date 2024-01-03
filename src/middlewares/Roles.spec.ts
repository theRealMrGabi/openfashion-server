import request from 'supertest'

import app from '../app'
import { SigninUser, SigninAdmin } from '../../test/helpers'

describe('Role restriction middleware should', () => {
	const currentUserUrl = '/api/v1/user/me'
	const getAllUsersUrl = '/api/v1/user/all'

	it('throw error if Authorization header is not present', async () => {
		const response = await request(app).get(currentUserUrl).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error if user doesnt have required role', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.get(getAllUsersUrl)
			.set('Authorization', `Bearer ${token}`)
			.expect(403)

		expect(response.body.message).toEqual(
			'You do not have permission to access this route'
		)
	})

	it('return admin role', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.get(currentUserUrl)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		const user = response.body.data

		expect(response.body.data).toBeDefined()
		expect(user.email).toBeDefined()
		expect(user.firstName).toBeDefined()
		expect(user.lastName).toBeDefined()
		expect(user.phoneNumber).toBeDefined()
		expect(user.id).toBeDefined()
		expect(user.access).toBeDefined()
		expect(user.emailVerifiedAt).toBeDefined()
		expect(user.phoneVerifiedAt).toBeDefined()
		expect(user.role).toEqual('admin')
	})

	it('grants permission to user with required role', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.get(getAllUsersUrl)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		const user = response.body.data.users.data[0]
		expect(response.body.data.users.data).toBeInstanceOf(Array)

		expect(user.email).toBeDefined()
		expect(user.firstName).toBeDefined()
		expect(user.lastName).toBeDefined()
		expect(user.phoneNumber).toBeDefined()
		expect(user.id).toBeDefined()
		expect(user.access).toBeDefined()
		expect(user.emailVerifiedAt).toBeDefined()
		expect(user.phoneVerifiedAt).toBeDefined()
	})
})
