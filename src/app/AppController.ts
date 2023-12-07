/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'

import { SuccessResponse, BadRequestResponse } from '../helpers'
import config from '../config'
import { UserRepository } from './user'

export const Index = async (_req: Request, res: Response) => {
	try {
		return SuccessResponse({
			res,
			message: 'Welcome to Open Fashion API'
		})
	} catch (error) {
		return BadRequestResponse({
			res,
			message: 'Unable to reach Open Fashion API'
		})
	}
}

export const HealthCheck = async (_req: Request, res: Response) => {
	const healthCheck = {
		uptime: process.uptime(),
		database: false,
		timestamp: Date.now(),
		message: `${config.APP_NAME} up and running`
	}

	try {
		await UserRepository.findOne({ id: -1 })
		healthCheck.database = true
		return SuccessResponse({ res, data: healthCheck })
	} catch (error) {
		console.log('health error -->', error)
		if (typeof error === 'string') {
			healthCheck.message = error
			return BadRequestResponse({ res, message: error })
		}
	}
}
