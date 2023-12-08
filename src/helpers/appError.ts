/** Handles App Error Response */
export class AppError extends Error {
	statusCode: number
	message: string
	status?: boolean | 'error'
	isOperational?: boolean

	constructor(statusCode: number, message: string) {
		super(message)

		this.statusCode = statusCode
		this.message = message
		this.isOperational = true
		this.status = statusCode.toString().startsWith('4') ? false : 'error'

		Error.captureStackTrace(this, this.constructor)
	}
}
