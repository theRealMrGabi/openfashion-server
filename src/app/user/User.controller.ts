import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { UserRepository } from '../user'
import { BadRequestResponse, SuccessResponse, AppError } from '../../helpers'
import { isValidMongooseObjectId } from '../../utils'

export const GetCurrentUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.user?.user?.id

		if (id && !isValidMongooseObjectId(id)) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Invalid User ID!'
			})
		}

		const userId = new mongoose.Types.ObjectId(id)
		const user = await UserRepository.findById(userId)

		if (!user) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Error fetching user'
			})
		}

		return SuccessResponse({
			res,
			data: user,
			message: 'User fetched successfully'
		})
	} catch (error) {
		if (error instanceof AppError) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

export const GetAllUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await UserRepository.find({ ...req.query })

		return SuccessResponse({
			res,
			data: { users },
			message: 'All users fetched'
		})
	} catch (error) {
		if (error instanceof AppError) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

export const GetUserByID = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id

		if (!isValidMongooseObjectId(id)) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Invalid User ID!'
			})
		}

		const userId = new mongoose.Types.ObjectId(id)

		const user = await UserRepository.findById(userId)

		if (!user) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'User not found!'
			})
		}

		return SuccessResponse({
			res,
			data: user,
			message: 'User fetched'
		})
	} catch (error) {
		if (error instanceof AppError) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

// export const UpdateUserScript = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		await UserRepository.update({
// 			query: { access: { $exists: false } },
// 			item: { access: UserAccessEnum.GRANTED },
// 			multiple: true
// 		})

// 		await UserRepository.update({
// 			query: { role: { $exists: false } },
// 			item: {
// 				role: UserRole.USER
// 			},
// 			multiple: true
// 		})

// 		return SuccessResponse({
// 			res,
// 			message: 'Update transaction successful'
// 		})
// 	} catch (error) {
// 		if (error instanceof AppError) {
// 			return BadRequestResponse({
// 				res,
// 				statusCode: 500,
// 				message: error.message
// 			})
// 		}
// 	}
// }
