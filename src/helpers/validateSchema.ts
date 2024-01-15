import * as Yup from 'yup'
import { Request, Response, NextFunction } from 'express'

import { BadRequestResponse } from './response'

interface Props {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	schema: Yup.ObjectSchema<any>
	requestLocation: keyof Request
}

export const ValidateSchema = ({ schema, requestLocation }: Props) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.validate(req[requestLocation], {
				abortEarly: false
			})
			return next()
		} catch (error) {
			const errors = error as Yup.ValidationError

			const message = errors.errors[0]

			return BadRequestResponse({
				res,
				statusCode: 400,
				message
			})
		}
	}
}
