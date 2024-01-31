import { Request, Response, NextFunction } from 'express'
import mongoose, { PaginateResult } from 'mongoose'

import { BadRequestResponse, SuccessResponse } from '../../helpers'
import { TypedRequestBody } from './../../interface'
import {
	CreateProductPayload,
	Product,
	ProductModel,
	ProductRepository,
	RateProductPayload
} from './'
import { redisClient } from '../../startup'
import { redisKeys, isObjectEmpty } from '../../utils'
import { UserRepository } from '../user'

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
		await redisClient.del(redisKeys.Products)

		return SuccessResponse({
			res,
			statusCode: 201,
			message: 'Product created'
		})
	} catch (error) {
		if (error instanceof Error) {
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

		const query = {
			query: {
				isDeleted: false
			},
			...req.query
		}

		if (!emptyQuery) {
			products = await ProductRepository.find({ ...query })
		}

		if (!cachedProducts) {
			products = await ProductRepository.find({ ...query })
			redisClient.setex(redisKeys.Products, 3600, JSON.stringify(products))
		}

		return SuccessResponse({
			res,
			data: products,
			message: 'All products fetched'
		})
	} catch (error) {
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

export const UpdateProduct = async (
	req: TypedRequestBody<CreateProductPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { title, price, description, image, category } = req.body
		const id = req.params.id
		const user = req.user?.user

		const productId = new mongoose.Types.ObjectId(id)

		const product = await ProductRepository.findById(productId)

		if (!product) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'Product not found'
			})
		}

		product.title = title
		product.price = price
		product.image = image
		product.description = description
		product.category = category
		if (user) {
			product.updatedBy = user?.id
		}

		await product.save()
		await redisClient.del(redisKeys.Products)

		return SuccessResponse({
			res,
			message: 'Product updated'
		})
	} catch (error) {
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

export const RateProduct = async (
	req: TypedRequestBody<RateProductPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { rating } = req.body

		const id = req.params.id
		const reqUser = req.user?.user

		const productId = new mongoose.Types.ObjectId(id)
		const userId = new mongoose.Types.ObjectId(reqUser?.id)

		const product = await ProductRepository.findById(productId)

		if (!product) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'Product not found'
			})
		}

		if (product.createdBy === reqUser?.id) {
			return BadRequestResponse({
				res,
				statusCode: 403,
				message: 'You can not rate your own product'
			})
		}

		const user = await UserRepository.findById(userId)

		if (user) {
			const hasPreviouslyRatedThisProduct = user.ratedProducts.includes(id)

			if (hasPreviouslyRatedThisProduct) {
				return BadRequestResponse({
					res,
					statusCode: 403,
					message: 'You have previously rated this product'
				})
			}

			const oldRating = product.rating.rate
			const oldCount = product.rating.count

			const newAverageRating = (oldRating * oldCount + rating) / (oldCount + 1)

			product.rating.rate = newAverageRating
			product.rating.count++

			user.ratedProducts = [id, ...user.ratedProducts]

			await product.save()
			await redisClient.del(redisKeys.Products)

			await user.save()

			return SuccessResponse({
				res,
				message: 'Product rated'
			})
		}
	} catch (error) {
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}

export const DeleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id
		const user = req.user?.user

		const productId = new mongoose.Types.ObjectId(id)
		const product = await ProductRepository.findById(productId)

		if (!product || product.isDeleted) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'Product not found'
			})
		}

		product.isDeleted = true
		product.deletedAt = Date.now()
		if (user) {
			product.updatedBy = user?.id
		}

		await product.save()
		await redisClient.del(redisKeys.Products)

		return SuccessResponse({
			res,
			message: 'Product deleted'
		})
	} catch (error) {
		if (error instanceof Error) {
			BadRequestResponse({
				res,
				statusCode: 500,
				message: error.message
			})
			return next(error)
		}
	}
}
