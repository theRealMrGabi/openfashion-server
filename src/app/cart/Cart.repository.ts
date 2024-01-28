import { PaginateModel } from 'mongoose'

import { BaseRepository } from '../Repository'
import { Cart, CartModel } from './'

class CartRepository extends BaseRepository<CartModel> {
	constructor(model: PaginateModel<CartModel>) {
		super(model)
	}
}

export default new CartRepository(Cart)
