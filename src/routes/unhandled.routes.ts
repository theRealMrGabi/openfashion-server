/* eslint-disable no-unused-vars */
import { Router, Request, NextFunction } from 'express'
import { AppError } from '../helpers'

export default (app: Router) => {
	app.all('*', (req: Request, _res, next: NextFunction) => {
		return next(
			new AppError(400, `Can't find ${req.originalUrl} on this server`)
		)
	})
}
