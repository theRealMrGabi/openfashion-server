import { IResponse } from './../interface'

export const SuccessResponse = ({
	res,
	data,
	statusCode = 200,
	status = true,
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
	status = false,
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
	status = false,
	message = 'Resource not found'
}: IResponse) => {
	return res.status(statusCode).json({
		status,
		message,
		data
	})
}
