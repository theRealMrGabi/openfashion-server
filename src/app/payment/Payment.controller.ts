import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Stripe from 'stripe'

import config from '../../config'
import { CartRepository } from '../cart'
import { BadRequestResponse, SuccessResponse } from '../../helpers'
import { Order, OrderRepository } from '../order'

const stripe = new Stripe(config.STRIPE_SECRET_KEY)

export const PaymentCheckout = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reqUser = req.user?.user
		const userId = new mongoose.Types.ObjectId(reqUser?.id)

		const products = await CartRepository.getCartItemProducts(userId)

		if (!products.length) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'User cart is empty'
			})
		}

		let totalPrice = 0
		let totalQuantity = 0

		products.forEach((product) => {
			totalPrice += product.price * product.quantity
			totalQuantity += product.quantity
		})

		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
			products.map((item) => ({
				price_data: {
					currency: 'usd',
					product_data: {
						name: item.name,
						images: [item.image]
					},
					unit_amount: item.price * 100 //Amount is accepted in cents, hence the conversion
				},
				quantity: item.quantity
			}))

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items,
			mode: 'payment',
			success_url: config.FRONTEND_STRIPE_SUCCESS_URL,
			cancel_url: config.FRONTEND_STRIPE_CANCEL_URL,
			customer_email: reqUser?.email
		})

		const order = new Order({
			user: userId,
			cartItems: products.map((item) => {
				const productId = new mongoose.Types.ObjectId(item.id)

				return {
					product: productId,
					quantity: item.quantity
				}
			}),
			totalPrice,
			totalQuantity,
			checkoutSessionId: session.id,
			status: 'accepted'
		})

		await OrderRepository.create(order)
		await CartRepository.delete({ user: userId }, false)

		return SuccessResponse({
			res,
			message: 'Checkout initiated',
			data: {
				sessionId: session.id
			}
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
