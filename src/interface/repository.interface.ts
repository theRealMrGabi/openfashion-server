/* eslint-disable no-unused-vars */
import mongoose, { ObjectId, Collection, FilterQuery, Document } from 'mongoose'

/**
 * Fields you want to order by. For mongodb it is a key-value pair.
 * Key is the name of the field and Value is 1 (ascending) or -1 (descending).
 * Example: { username: 1 } (Sort result by username in ascending order)
 */
export interface Sort {
	[key: string]: 1 | -1
}

export interface IRepository<T extends Document> {
	/**
	 * Insert a single item into the collection
	 * @param item Object you want to save
	 */
	create(item: Partial<T>): Promise<T>

	/**
	 * Insert multiple items into the collection
	 * @param item Array of objects you want to save
	 * @returns Array of created documents
	 */
	createMany(item: Partial<T[]>): Promise<T[]>

	/**
	 * Find single item in the collection
	 * @param query Filter query parameters of item
	 */
	findOne(query: FilterQuery<T>): void

	/**
	 * Find single item by id in the collection
	 * @param id Filter query parameters of item
	 */
	findById(id: mongoose.Types.ObjectId): void

	/**
	 * Find single or multiple documents from collection
	 * @param query Filter query parameters
	 * @param sort Sort collection e.g { username: 1 } (Sort result by username in ascending order). NB: Sort value can only be either 1 or -1
	 * @param page Current pagination page number
	 * @param limit Pagination limit per page
	 * @returns Array of documents
	 */

	find({
		query,
		sort,
		page,
		limit
	}: {
		query?: FilterQuery<T>
		sort?: Sort
		page?: number
		limit?: number
	}): Promise<T[]>

	findOrCreate(query: FilterQuery<T>, item: Partial<T>): Promise<T>

	/**
	 * Delete document(s) from collection
	 * @param query Filter query parameters
	 * @param multiple Delete single or multiple documents
	 */
	delete(query: FilterQuery<T>, multiple?: boolean): void

	/**
	 * Remove document from the collection by given ID(s). This method receives one or more IDs
	 * @param ids ObjectId | ObjectId[]
	 */
	deleteById(ids: ObjectId | ObjectId[]): void

	/**
	 * Update document(s) from collection
	 * @param query Filter query parameters
	 * @param item Item to be updated with
	 * @param multiple Update single or multiple documents
	 */
	update(query: FilterQuery<T>, item: Partial<T>, multiple?: boolean): void

	/**
	 * Update document from the collection by given ID(s). This method receives one or more IDs
	 * @param ids ObjectId | ObjectId[]
	 */
	updateById(ids: ObjectId | ObjectId[], item: Partial<T>): void

	/**
	 * Get collection instance of the repository
	 * @returns MongoDB Collection instance
	 */
	getCollection(): Collection
}
