import 'mongoose-paginate-v2'
import mongoose, {
	isValidObjectId,
	ObjectId,
	Collection,
	FilterQuery,
	Document,
	PaginateModel,
	PaginateResult,
	UpdateWriteOpResult
} from 'mongoose'

import { Sort, IRepository } from '../interface'

/** Custom pagination props */
const customLabels = {
	docs: 'data',
	totalDocs: 'total',
	totalPages: 'pages',
	nextPage: 'next',
	prevPage: 'prev',
	pagingCounter: false
}

export interface IPaginateModel<T> extends PaginateModel<T> {}

export class BaseRepository<T extends Document> implements IRepository<T> {
	private model: IPaginateModel<T>

	constructor(model: PaginateModel<T>) {
		this.model = model
	}

	public create(item: Partial<T>): Promise<T> {
		if (!item) {
			throw new Error('Empty item provided')
		}
		return this.model.create(item)
	}

	public createMany(item: Partial<T[]>): Promise<T[]> {
		if (!item.length) {
			throw new Error('Empty item provided')
		}
		return this.model.insertMany(item)
	}

	public async findOne(query: FilterQuery<T>) {
		return await this.model.findOne(query)
	}

	public async findById(id: mongoose.Types.ObjectId) {
		if (!isValidObjectId(id)) throw new Error('Invalid object id')
		return await this.model.findById(id)
	}

	public async find({
		query,
		sort = undefined,
		page = 1,
		limit = 20
	}: {
		query?: FilterQuery<T>
		sort?: Sort
		page?: number
		limit?: number
	}): Promise<T[] | PaginateResult<T>> {
		const options = {
			page,
			limit,
			sort,
			customLabels
		}

		return await this.model.paginate(query, {
			...options
		})
	}

	public async findOrCreate(
		query: FilterQuery<T>,
		item: Partial<T>
	): Promise<T> {
		return (
			(await this.model.findOne(query)) ||
			(await this.create({ ...query, ...item }))
		)
	}

	public async delete(query: FilterQuery<T>, multiple?: boolean) {
		if (multiple) {
			return await this.model.deleteMany(query)
		} else {
			return await this.model.deleteOne(query)
		}
	}

	public async deleteById(ids: ObjectId | ObjectId[]) {
		let objectIds = []

		if (Array.isArray(ids)) {
			objectIds = ids?.map((id) => {
				if (!isValidObjectId(id)) throw new Error('Invalid object id')
			})
		} else {
			if (!isValidObjectId(ids)) throw new Error('Invalid object id')
			objectIds = [ids]
		}

		const query = await this.model.deleteMany({ _id: { $in: objectIds } })

		return query
	}

	public async update({
		query,
		item,
		multiple = false
	}: {
		query: FilterQuery<T>
		item: Partial<T>
		multiple: boolean
	}): Promise<UpdateWriteOpResult> {
		try {
			if (multiple) {
				const response = await this.model.updateMany(query, {
					$set: item,
					upsert: true
				})
				return response
			} else {
				const response = await this.model.updateOne(query, {
					$set: item,
					upsert: true
				})
				return response
			}
		} catch (error) {
			console.error('Error updating documents:', error)
			throw error
		}
	}

	public updateById(ids: ObjectId | ObjectId[], item: Partial<T>) {
		let objectIds = []

		if (Array.isArray(ids)) {
			objectIds = ids?.map((id) => {
				if (!isValidObjectId(id)) throw new Error('Invalid object id')
			})
		} else {
			if (!isValidObjectId(ids)) throw new Error('Invalid object id')
			objectIds = [ids]
		}

		return this.model.updateMany(
			{ _id: { $in: objectIds } },
			{ $set: item, upsert: true }
		)
	}

	public getCollection(): Collection {
		return this.model.collection
	}
}
