import { Response, Request } from 'express'
import { Query } from 'express-serve-static-core'

export interface IResponse {
	res: Response
	statusCode?: number
	status?: boolean
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
