import { Response } from 'express'

interface IResponse {
	res: Response
	statusCode?: number
	status?: string
	message?: string
	data?: object | []
}

export const SuccessResponse = ({
	res,
	data,
	statusCode = 200,
	status = 'success',
	message
}: IResponse) => {
	return res.status(statusCode).json({
		status,
		message,
		data
	})
}

export const BadRequestResponse = ({
	res,
	data,
	statusCode = 400,
	status = 'fail',
	message = 'Bad request'
}: IResponse) => {
	return res.status(statusCode).json({
		status,
		message,
		data
	})
}

export const NotFoundResponse = ({
	res,
	data,
	statusCode = 404,
	status = 'fail',
	message = 'Resource not found'
}: IResponse) => {
	return res.status(statusCode).json({
		status,
		message,
		data
	})
}
