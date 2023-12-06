import { PaginateModel } from 'mongoose'
import { BaseRepository } from '../Repository'

import { User, IUserModel } from '.'

export interface IPaginateModel<T> extends PaginateModel<T> {}

class UserRepository extends BaseRepository<IUserModel> {
	constructor(model: PaginateModel<IUserModel>) {
		super(model)
	}
}

export default new UserRepository(User)
