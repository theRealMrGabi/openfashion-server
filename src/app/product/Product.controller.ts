import { Request, Response, NextFunction } from 'express'
import { PaginateResult } from 'mongoose'

import { BadRequestResponse, SuccessResponse, AppError } from '../../helpers'
import { TypedRequestBody } from './../../interface'
import {
	CreateProductPayload,
	Product,
	ProductModel,
	ProductRepository
} from './'
import { redisClient } from '../../startup'
import { redisKeys, isObjectEmpty } from '../../utils'

type ProductResponse = ProductModel[] | PaginateResult<ProductModel>

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
		let products!: ProductResponse

		const emptyQuery = isObjectEmpty(req.query)

		const cachedProducts = await redisClient.get(redisKeys.Products)

		if (cachedProducts && emptyQuery) {
			products = JSON.parse(cachedProducts)
		}

		if (!emptyQuery) {
			products = await ProductRepository.find({ ...req.query })
		}

		if (!cachedProducts) {
			products = await ProductRepository.find({ ...req.query })
			redisClient.setex(redisKeys.Products, 3600, JSON.stringify(products))
		}

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