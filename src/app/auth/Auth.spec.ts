import request from 'supertest'
import { randEmail, randFirstName, randLastName } from '@ngneat/falso'

import app from '../../app'

describe('Signup controller should', () => {
	const signupUrl = '/api/v1/auth/signup'

	const email = randEmail()
	const password = 'P@ssword123!'
	const firstName = randFirstName()
	const lastName = randLastName()
	const phoneNumber = '+2348023456789'

	const payload = {
		email,
		password,
		phoneNumber,
		firstName,
		lastName
	}

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
