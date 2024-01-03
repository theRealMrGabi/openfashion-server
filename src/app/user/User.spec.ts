import request from 'supertest'

import app from '../../app'
import { SigninUser, SigninAdmin } from '../../../test/helpers'

describe('Get current user controller should', () => {
	const currentUserUrl = '/api/v1/user/me'

	it('throw error when no authorization token is passed', async () => {
		const response = await request(app).get(currentUserUrl).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error when user is not found or expired authorization token is used', async () => {
		const response = await request(app)
			.get(currentUserUrl)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzI4MDk0NWRlZmJkYTg0YjdhNmIwMCIsImlhdCI6MTcwMzYzNzUwNSwiZXhwIjoxNzAzODk2NzA1LCJpc3MiOiJPcGVuRmFzaGlvbiJ9.fxfULqwKLeX74G_4w_Bn-60Jo4VxHglKm4Yl3pdJ9l0'
			)
			.expect(401)

		expect(response.body.message).toEqual('Invalid/expired token')
	})

	it('successfully return currently signed in user', async () => {
		const { token } = await SigninUser()

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
	})
})

describe('Get all users should controller', () => {
	const getAllUsersUrl = '/api/v1/user/all'

	it('throw error when no authorization token is passed', async () => {
		const response = await request(app).get(getAllUsersUrl).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error for user without adequate permission', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.get(getAllUsersUrl)
			.set('Authorization', `Bearer ${token}`)
			.expect(403)

		expect(response.body.message).toEqual(
			'You do not have permission to access this route'
		)
	})

	it('return array of users for authenticated and authorized user', async () => {
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

describe('Get user by ID controller should', () => {
	const getUserByIdURL = '/api/v1/user/:id'

	it('throw error when no authorization token is passed', async () => {
		const response = await request(app).get(getUserByIdURL).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error when user is not found or expired authorization token is used', async () => {
		const response = await request(app)
			.get(getUserByIdURL)
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzI4MDk0NWRlZmJkYTg0YjdhNmIwMCIsImlhdCI6MTcwMzYzNzUwNSwiZXhwIjoxNzAzODk2NzA1LCJpc3MiOiJPcGVuRmFzaGlvbiJ9.fxfULqwKLeX74G_4w_Bn-60Jo4VxHglKm4Yl3pdJ9l0'
			)
			.expect(401)

		expect(response.body.message).toEqual('Invalid/expired token')
	})

	it('throw error for user without adequate permission', async () => {
		const { token, user } = await SigninUser()

		const response = await request(app)
			.get(`/api/v1/user/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(403)

		expect(response.body.message).toEqual(
			'You do not have permission to access this route'
		)
	})

	it('successfully return user fetched by ID', async () => {
		const { token, adminUser: user } = await SigninAdmin()

		const response = await request(app)
			.get(`/api/v1/user/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)

		const responseData = response.body.data

		expect(responseData).toBeDefined()
		expect(responseData.email).toBeDefined()
		expect(responseData.firstName).toBeDefined()
		expect(responseData.lastName).toBeDefined()
		expect(responseData.phoneNumber).toBeDefined()
		expect(responseData.id).toBeDefined()
		expect(responseData.access).toBeDefined()
		expect(responseData.emailVerifiedAt).toBeDefined()
		expect(responseData.phoneVerifiedAt).toBeDefined()
	})
})
