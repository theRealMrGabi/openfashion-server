import { Request, Response, NextFunction } from 'express'
import { AppError } from '../helpers'

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

		return res.status(err?.statusCode).json({
			status: err?.status,
			message: err?.message || 'Something went wrong'
		})
	} catch (error) {
		next(err)
	}
}
