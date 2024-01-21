import { Request, Response, NextFunction } from 'express'

import { isValidMongooseObjectId } from '../utils'
import { BadRequestResponse } from '../helpers'

interface Props {
	id?: string
	message: string
}

export const ValidateMongooseID = ({ id, message }: Props) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const mongooseId = id || req?.params?.id || (req.user?.user?.id as string)

		if (!isValidMongooseObjectId(mongooseId)) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message
			})
		}

		next()
	}
}
