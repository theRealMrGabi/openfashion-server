import request from 'supertest'
import {
	randEmail,
	randFirstName,
	randLastName,
	randPassword
} from '@ngneat/falso'

import app from '../../app'

const signupUrl = '/api/v1/auth/signup'

const payload = {
	email: randEmail(),
	password: 'P@ssword123!',
	firstName: randFirstName(),
	lastName: randLastName(),
	phoneNumber: '+2348023456789'
}

export const SignupUser = async () => {
	return await request(app).post(signupUrl).send(payload)
}

describe('Signup controller should', () => {
	it('return 400 error code if required fields are not passed', async () => {
		const response = await request(app).post(signupUrl).send()

		expect(response.statusCode).toBe(400)
	})

	it('signup user with valid data', async () => {
		const response = await request(app).post(signupUrl).send(payload)

		expect(response.statusCode).toBe(201)
		expect(response.body.message).toEqual('Signup successful')
	})

	it('register unique email address or phone number', async () => {
		const response = await request(app).post(signupUrl).send(payload)

		expect(response.statusCode).toBe(201)
		expect(response.body.message).toEqual('Signup successful')

		const uniqueErrorResponse = await request(app).post(signupUrl).send(payload)

		expect(uniqueErrorResponse.statusCode).toBe(422)
		expect(uniqueErrorResponse.body.message).toEqual(
			'Unable to process request. Try changing details'
		)
	})
})

describe('Signin controller should', () => {
	const signinUrl = '/api/v1/auth/signin'

	it('return 400 status code if required fields are not passed', async () => {
		const response = await request(app).post(signinUrl).send()

		expect(response.statusCode).toBe(400)
	})

	it('return error when email/password does not match', async () => {
		await SignupUser()

		const response = await request(app).post(signinUrl).send({
			email: randEmail(),
			password: randPassword()
		})

		expect(response.statusCode).toBe(403)
		expect(response.body.message).toEqual('Invalid credentials')
	})

	it('return 200 statusCode for a successul login', async () => {
		await SignupUser()

		const response = await request(app).post(signinUrl).send({
			email: payload.email,
			password: payload.password
		})

		expect(response.statusCode).toBe(200)
		expect(response.body).toMatchObject({
			status: true,
			message: 'Signin successful',
			data: expect.any(Object)
		})
	})
})
