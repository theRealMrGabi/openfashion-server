import mongoose, { PaginateModel } from 'mongoose'

import { BaseRepository } from '../Repository'
import { Cart, CartModel, CartProduct } from './'
import { ProductRepository } from '../product'

class CartRepository extends BaseRepository<CartModel> {
	constructor(model: PaginateModel<CartModel>) {
		super(model)
	}

	async getCartItemProducts(
		userId: mongoose.Types.ObjectId
	): Promise<CartProduct[]> {
		const userCart = await this.findOne({
			user: userId
		})

		if (!userCart) {
			return []
		}

		const cartItems = userCart.items

		const products = await Promise.all(
			cartItems.map(async (cartItem) => {
				try {
					const productId = new mongoose.Types.ObjectId(cartItem.product)
					const product = await ProductRepository.findById(productId)

					if (product) {
						return {
							id: product.id,
							name: product.title,
							image: product.image,
							price: product.price,
							quantity: cartItem.quantity
						}
					}
				} catch (error) {
					console.error('🚀 ==> getCartItemProducts error:', error)
				}
			})
		)

		const validProducts = products.filter(
			(product) => product !== null
		) as CartProduct[]

		return validProducts
	}
}

export default new CartRepository(Cart)
