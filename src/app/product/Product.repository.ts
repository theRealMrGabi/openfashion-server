import { PaginateModel } from 'mongoose'
import { BaseRepository } from '../Repository'

import { Product, ProductModel } from './'

export interface PaginateProductModel<T> extends PaginateModel<T> {}

class ProductRepository extends BaseRepository<ProductModel> {
	constructor(model: PaginateModel<ProductModel>) {
		super(model)
	}
}

export default new ProductRepository(Product)
