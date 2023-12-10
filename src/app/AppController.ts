/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import mongoose from 'mongoose'

import { SuccessResponse, BadRequestResponse } from '../helpers'
import config from '../config'

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
		message: ''
	}

	const healthyDB = mongoose.connection.readyState === 1
	if (healthyDB) {
		healthCheck.database = true
		healthCheck.message = `${config.APP_NAME} up and running`
		return SuccessResponse({ res, data: healthCheck })
	}

	return BadRequestResponse({
		res,
		statusCode: 503,
		message: `${config.APP_NAME} doesn't work properly, mongoose connection stage is ${mongoose.connection.readyState}`
	})
}
