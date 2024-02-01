import { Response, Request } from 'express'
import { Query } from 'express-serve-static-core'

import { UserInterface } from './../app/user'

export interface IResponse {
	res: Response
	statusCode?: number
	status?: boolean | 'error'
	message?: string
	data?: object | []
}

export interface TypedRequestBody<T> extends Request {
	body: T
}

export interface TypedRequest<B, Q extends Query> extends Express.Request {
	body: B | Required<B> | Exclude<B, undefined>
	query: Q | Required<Q> | Exclude<Q, undefined>
}

export interface DecryptedUserToken {
	user: UserInterface
	iat: number
	exp: number
	iss: string
}

export interface CustomPaginateResult<T> {
	data: T[]
	total: number
	pages: number
	prev?: number | null | undefined
	next?: number | null | undefined
	page?: number | undefined
	limit: number
	hasPrevPage: boolean
	hasNextPage: boolean
	offset: number
}
