import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { OrderRepository, OrderModel } from './'
import { BadRequestResponse, SuccessResponse } from '../../helpers'
import { redisKeys, isObjectEmpty } from '../../utils'
import { redisClient } from '../../startup'
import { CustomPaginateResult } from './../../interface'
import { ProductRepository } from '../product'

type OrdersResponse = CustomPaginateResult<OrderModel>

export const GetAllOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let orders!: OrdersResponse

		const emptyQuery = isObjectEmpty(req.query)
		const cachedOrders = await redisClient.get(redisKeys.Orders)

		if (cachedOrders && emptyQuery) {
			orders = JSON.parse(cachedOrders)
			const { data, ...others } = orders

			return SuccessResponse({
				res,
				data: {
					orders: data,
					...others
				},
				message: 'All orders fetched'
			})
		}

		const status = req.query.status
		const query = {
			...(status && {
				query: {
					status
				}
			}),
			...req.query
		}

		if (!emptyQuery) {
			orders = (await OrderRepository.find({
				...query
			})) as unknown as OrdersResponse
		}

		if (!cachedOrders) {
			orders = (await OrderRepository.find({
				...query
			})) as unknown as OrdersResponse
			redisClient.setex(redisKeys.Orders, 3600, JSON.stringify(orders))
		}

		const transformOrders = await Promise.all(
			orders.data.map(async (order) => {
				const fetchProducts = order.cartItems.map(async (cart) => {
					try {
						const productId = new mongoose.Types.ObjectId(
							cart.product.toString()
						)
						const product = await ProductRepository.findById(productId)

						if (product) {
							return {
								productId: product.id,
								name: product.title,
								image: product.image,
								price: product.price,
								quantity: cart.quantity,
								totalProductPrice: product.price * cart.quantity
							}
						}
					} catch (error) {
						console.error('🚀 ==> error fetching cart products:', error)
					}
				})

				const products = await Promise.all(fetchProducts)

				return {
					id: order.id,
					user: order.user,
					cartItems: products,
					totalPrice: order.totalPrice,
					totalQuantity: order.totalQuantity,
					checkoutSessionId: order.checkoutSessionId,
					status: order.status,
					createdAt: order.createdAt,
					updatedAt: order.updatedAt
				}
			})
		)

		// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
		const { data, ...others } = orders

		return SuccessResponse({
			res,
			data: {
				orders: transformOrders,
				...others
			},
			message: 'All orders fetched'
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

export const GetOrderByID = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id

		const orderId = new mongoose.Types.ObjectId(id)
		const order = await OrderRepository.findById(orderId)

		if (!order) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'Order not found!'
			})
		}

		const populateProducts = await Promise.all(
			order.cartItems.map(async (cart) => {
				try {
					const productId = new mongoose.Types.ObjectId(cart.product.toString())
					const product = await ProductRepository.findById(productId)

					if (product) {
						return {
							productId: product.id,
							name: product.title,
							image: product.image,
							price: product.price,
							quantity: cart.quantity,
							totalProductPrice: product.price * cart.quantity
						}
					}
				} catch (error) {
					console.error('🚀 ==> error fetching cart product:', error)
				}
			})
		)

		return SuccessResponse({
			res,
			data: {
				cartItems: populateProducts,
				id: order.id,
				user: order.user,
				totalPrice: order.totalPrice,
				totalQuantity: order.totalQuantity,
				checkoutSessionId: order.checkoutSessionId,
				status: order.status,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt
			},
			message: 'order fetched'
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
