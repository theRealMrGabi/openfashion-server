import request from 'supertest'

import app from '../../app'
import {
	SigninUser,
	SigninAdmin,
	SigninPayload,
	signinUrl,
	RevokeUserAccess
} from '../../../test/helpers'

const expiredToken =
	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzI4MDk0NWRlZmJkYTg0YjdhNmIwMCIsImlhdCI6MTcwMzYzNzUwNSwiZXhwIjoxNzAzODk2NzA1LCJpc3MiOiJPcGVuRmFzaGlvbiJ9.fxfULqwKLeX74G_4w_Bn-60Jo4VxHglKm4Yl3pdJ9l0'

describe('Get current user controller should', () => {
	const currentUserUrl = '/api/v1/user/me'

	it('throw error when no authorization token is passed', async () => {
		const response = await request(app).get(currentUserUrl).expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error when user is not found or expired authorization token is used', async () => {
		const response = await request(app)
			.get(currentUserUrl)
			.set('Authorization', expiredToken)
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
			'You do not have permission to access this resource'
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
			.set('Authorization', expiredToken)
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
			'You do not have permission to access this resource'
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

describe('Change password controller should', () => {
	const url = '/api/v1/user/change-password'
	const randomPassword = 'R@ndomP@ssword091!'
	const oldPassword = SigninPayload.password
	const newPassword = 'P@ssword1234556!'

	it('throw authentication error if user is not signed in', async () => {
		const response = await request(app).post(url).send().expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw error if required fields are not passed', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Current password is required')
	})

	it('throw error if new password and confirm password do not match', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				password: oldPassword,
				newPassword,
				confirmNewPassword: randomPassword
			})
			.expect(400)

		expect(response.body.message).toEqual('Passwords must match')
	})

	it('throw error if old password is not correct', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				password: randomPassword,
				newPassword,
				confirmNewPassword: newPassword
			})
			.expect(400)

		expect(response.body.message).toEqual('Invalid credentials')
	})

	it('successfully change a users password', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				password: oldPassword,
				newPassword,
				confirmNewPassword: newPassword
			})
			.expect(200)

		expect(response.body.message).toEqual('Password updated')
	})

	it('be able to sign in with newly changed password', async () => {
		const { token } = await SigninUser()

		await request(app)
			.post(url)
			.set('Authorization', `Bearer ${token}`)
			.send({
				password: oldPassword,
				newPassword,
				confirmNewPassword: newPassword
			})
			.expect(200)

		const loginResponse = await request(app)
			.post(signinUrl)
			.send({
				email: SigninPayload.email,
				password: newPassword
			})
			.expect(200)

		expect(loginResponse.body.message).toEqual('Signin successful')
	})
})

describe('Grant or Revoke user access controller should', () => {
	const url = '/api/v1/user/access'

	it('throw error if user id path is not present', async () => {
		const response = await request(app).patch(url).send().expect(400)

		expect(response.body.message).toEqual(
			// eslint-disable-next-line quotes
			"Can't find /api/v1/user/access on this server"
		)
	})

	it('throw authentication error if user is not signed in', async () => {
		const response = await request(app)
			.patch(`${url}/jfj3j3j3j3j`)
			.send()
			.expect(403)

		expect(response.body.message).toEqual('Authentication failed')
	})

	it('throw authentication error if user does not have access', async () => {
		const { token } = await SigninUser()

		const response = await request(app)
			.patch(`${url}/jfj3j3j3j3j`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(403)

		expect(response.body.message).toEqual(
			'You do not have permission to access this resource'
		)
	})

	it('throw error if invalid user id is passed', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.patch(`${url}/jfj3j3j3j3j`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(400)

		expect(response.body.message).toEqual('Invalid User ID!')
	})

	it('throw error if user is not found', async () => {
		const { token } = await SigninAdmin()

		const response = await request(app)
			.patch(`${url}/65764abe36b987632e2f0800`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(404)

		expect(response.body.message).toEqual('User not found!')
	})

	it('throw error if admin tries to revoke his/her/their access', async () => {
		const { token, adminUser } = await SigninAdmin()

		const response = await request(app)
			.patch(`${url}/${adminUser.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(403)

		expect(response.body.message).toEqual('You can not update your own access')
	})

	it('successfully revoke user access', async () => {
		const { token } = await SigninAdmin()
		const { user } = await SigninUser()

		const response = await request(app)
			.patch(`${url}/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(200)

		expect(response.body.message).toEqual('User access updated')
	})

	it('throw error if user with revoked access tries to login', async () => {
		const { token } = await SigninAdmin()
		const { user } = await SigninUser()

		const response = await request(app)
			.patch(`${url}/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(200)

		expect(response.body.message).toEqual('User access updated')

		const loginResponse = await request(app)
			.post(signinUrl)
			.send({
				email: SigninPayload.email,
				password: SigninPayload.password
			})
			.expect(403)

		expect(loginResponse.body.message).toEqual(
			'Your access to the platform has been revoked'
		)
	})

	it('allow user login successfully once their access is revoked and then granted again', async () => {
		const { user } = await SigninUser()

		const { token } = await RevokeUserAccess(user.id)

		await request(app)
			.patch(`${url}/${user.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(200)

		const response = await request(app)
			.post(signinUrl)
			.send({
				email: SigninPayload.email,
				password: SigninPayload.password
			})
			.expect(200)

		expect(response.body.message).toEqual('Signin successful')
	})
})
