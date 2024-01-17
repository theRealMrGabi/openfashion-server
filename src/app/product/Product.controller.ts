import { Request, Response, NextFunction } from 'express'

import { BadRequestResponse, SuccessResponse, AppError } from '../../helpers'
import { TypedRequestBody } from './../../interface'
import { CreateProductPayload, Product, ProductRepository } from './'

export const CreateProduct = async (
	req: TypedRequestBody<CreateProductPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { title, price, description, image, category } = req.body
		const user = req.user?.user

		const product = new Product({
			title,
			price,
			description,
			image,
			category
		})

		if (user) {
			product.createdBy = user.id
		}

		await ProductRepository.create(product)

		return SuccessResponse({
			res,
			statusCode: 201,
			message: 'Product created'
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

export const FetchProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		//! Fetch products from Redis instead of DB and alos check if a new product has been created so it can update that in redis cache

		const products = await ProductRepository.find({ ...req.query })

		return SuccessResponse({
			res,
			data: products,
			message: 'All products fetched'
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
