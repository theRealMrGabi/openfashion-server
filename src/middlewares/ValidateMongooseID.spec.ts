import { Request, Response, NextFunction } from 'express'

import { ValidateMongooseID } from './ValidateMongooseID'
import { BadRequestResponse } from '../helpers'

jest.mock('../helpers/response', () => ({
	BadRequestResponse: jest.fn()
}))

describe('Validate mongoose ID middleware should', () => {
	const mockRequest: Request = { params: {} } as Request
	const mockResponse: Response = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn()
	} as unknown as Response
	const mockNext: NextFunction = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('throw error if Invalid Mongoose ID provided', () => {
		const middleware = ValidateMongooseID({
			id: 'invalidID',
			message: 'Invalid ID'
		})

		middleware(mockRequest, mockResponse, mockNext)

		expect(BadRequestResponse).toHaveBeenCalled()
		expect(mockNext).not.toHaveBeenCalled()
	})

	it('call next fn if valid Mongoose ID provided', () => {
		const middleware = ValidateMongooseID({
			id: '65a71575e741d5ce020c5bd9',
			message: 'Invalid ID'
		})
		middleware(mockRequest, mockResponse, mockNext)

		expect(BadRequestResponse).not.toHaveBeenCalled()
		expect(mockNext).toHaveBeenCalled()
	})

	it('use request parameter if ID is not provided in props', () => {
		const middleware = ValidateMongooseID({
			message: 'Invalid ID'
		})

		mockRequest.params.id = '5f4a5b5f590e744799c0c676'
		middleware(mockRequest, mockResponse, mockNext)

		expect(BadRequestResponse).not.toHaveBeenCalled()
		expect(mockNext).toHaveBeenCalledTimes(1)
	})
})
