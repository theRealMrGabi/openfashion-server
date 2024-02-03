import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { BadRequestResponse, SuccessResponse } from '../../helpers'
import { TypedRequestBody } from './../../interface'
import { AddItemToCartPayload, Cart, CartRepository } from './'
import { ProductRepository } from '../product'

export const AddItemToCart = async (
	req: TypedRequestBody<AddItemToCartPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { productId, quantity } = req.body
		const reqUser = req.user?.user

		const productID = new mongoose.Types.ObjectId(productId)
		const userId = new mongoose.Types.ObjectId(reqUser?.id)

		const product = await ProductRepository.findById(productID)

		if (!product || product.isDeleted) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'Product not found'
			})
		}

		const userCart = await CartRepository.findOne({
			user: userId
		})

		if (!userCart) {
			const cartItem = new Cart({
				user: userId,
				items: [{ product: productId, quantity }]
			})

			await CartRepository.create(cartItem)
		} else {
			const productExistInCart = userCart.items.some((item) => {
				const itemId = item.product.toString()
				return itemId === productId
			})

			if (productExistInCart) {
				return BadRequestResponse({
					res,
					statusCode: 400,
					message: 'This item already exists in user cart'
				})
			}

			userCart.items.unshift({ product: productId, quantity })
			await userCart.save()
		}

		return SuccessResponse({
			res,
			message: 'Item added to cart'
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

export const RemoveItemFromCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id
		const reqUser = req.user?.user
		const productId = new mongoose.Types.ObjectId(id)

		const userId = new mongoose.Types.ObjectId(reqUser?.id)

		const product = await ProductRepository.findById(productId)

		if (!product || product.isDeleted) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'Product not found'
			})
		}

		const cart = await CartRepository.findOne({
			user: userId
		})

		if (!cart) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'User cart is empty'
			})
		}

		const productExistInCart = await CartRepository.findOne({
			'items.product': productId
		})

		if (!productExistInCart) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Product not in cart'
			})
		}

		const removeItemFromCart = cart.items.filter((item) => {
			const cartProductId = item.product.toString()
			return cartProductId !== id
		})

		cart.items = removeItemFromCart
		await cart.save()

		return SuccessResponse({
			res,
			message: 'Cart updated'
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

export const UpdateCartItem = async (
	req: TypedRequestBody<AddItemToCartPayload>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { productId, quantity } = req.body
		const reqUser = req.user?.user

		const productID = new mongoose.Types.ObjectId(productId)

		const userId = new mongoose.Types.ObjectId(reqUser?.id)

		const product = await ProductRepository.findById(productID)

		if (!product || product.isDeleted) {
			return BadRequestResponse({
				res,
				statusCode: 404,
				message: 'Product not found'
			})
		}

		const cart = await CartRepository.findOne({
			user: userId
		})

		if (!cart) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'User cart is empty'
			})
		}

		const productExistInCart = await CartRepository.findOne({
			'items.product': productID
		})

		if (!productExistInCart) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Product not in cart'
			})
		}

		const productIndex = cart.items.findIndex((item) => {
			const cartProductId = item.product.toString()

			return cartProductId === productId
		})

		if (productIndex === -1) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'Item not found in the cart for the given productId.'
			})
		}

		cart.items[productIndex] = {
			...cart.items[productIndex],
			...{
				product: productId,
				quantity
			}
		}

		await cart.save()

		return SuccessResponse({
			res,
			message: 'Cart updated'
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

export const EmptyCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reqUser = req.user?.user
		const userId = new mongoose.Types.ObjectId(reqUser?.id)

		const userCart = await CartRepository.findOne({
			user: userId
		})

		if (!userCart) {
			return BadRequestResponse({
				res,
				statusCode: 400,
				message: 'No item in cart to empty'
			})
		}

		await CartRepository.deleteById(userCart.id)

		return SuccessResponse({
			res,
			message: 'Cart emptied'
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

export const GetCartItems = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reqUser = req.user?.user
		const userId = new mongoose.Types.ObjectId(reqUser?.id)

		const cartProducts = await CartRepository.getCartItemProducts(userId)

		if (!cartProducts.length) {
			return SuccessResponse({
				res,
				message: 'Cart is empty',
				data: cartProducts
			})
		}

		return SuccessResponse({
			res,
			data: cartProducts,
			message: 'Cart items fetched'
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
