import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { UserRepository, ChangePasswordPayload, UserAccessEnum } from '../user'
import { BadRequestResponse, SuccessResponse, AppError } from '../../helpers'
import { isValidMongooseObjectId } from '../../utils'
import { TypedRequestBody } from './../../interface'
import { PasswordService } from '../auth'

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

export const ChangePassword = async (
	req: TypedRequestBody<ChangePasswordPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { password, newPassword } = req.body

		const id = req.user?.user?.id

		if (id && !isValidMongooseObjectId(id)) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'User not found'
			})
		}

		const userId = new mongoose.Types.ObjectId(id)
		const user = await UserRepository.findById(userId)

		if (!user) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'User not found'
			})
		}

		const validOldPassword = await PasswordService.compare(
			password,
			user.password
		)

		if (!validOldPassword) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Invalid credentials'
			})
		}

		user.password = newPassword
		await user.save()

		return SuccessResponse({
			res,
			statusCode: 200,
			message: 'Password updated'
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

export const GrantOrRevokeUserAccess = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id
		const authUser = req.user?.user

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

		if (authUser?.id === user.id) {
			return BadRequestResponse({
				res,
				statusCode: 403,
				message: 'You can not update your own access'
			})
		}

		let access: UserAccessEnum = UserAccessEnum.GRANTED

		if (user.access === UserAccessEnum.GRANTED) {
			access = UserAccessEnum.REVOKED
		} else if (user.access === UserAccessEnum.REVOKED) {
			access = UserAccessEnum.GRANTED
		}

		user.access = access
		await user.save()

		return SuccessResponse({
			res,
			statusCode: 200,
			message: 'User access updated'
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
