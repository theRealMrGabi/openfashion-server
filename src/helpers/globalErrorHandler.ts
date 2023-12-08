import { Request, Response, NextFunction } from 'express'
import { AppError, BadRequestResponse } from '../helpers'

/** Handles unexceptional error */
export const globalErrorHandler = (
	err: AppError,
	// eslint-disable-next-line no-unused-vars
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		console.log('error stack -->', err?.stack)

		err.statusCode = err?.statusCode || 500
		err.status = err?.status || 'error'

		return BadRequestResponse({
			res,
			statusCode: err.statusCode,
			status: err.status,
			message: err?.message || 'Internal server error'
		})
	} catch (error) {
		next(err)
	}
}
