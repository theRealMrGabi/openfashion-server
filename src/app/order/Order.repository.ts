import { PaginateModel } from 'mongoose'
import { BaseRepository } from '../Repository'

import { Order, OrderModel } from '.'

class OrderRepository extends BaseRepository<OrderModel> {
	constructor(model: PaginateModel<OrderModel>) {
		super(model)
	}
}

export default new OrderRepository(Order)
