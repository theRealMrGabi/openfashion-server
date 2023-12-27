import { InferType } from 'yup'
import { SignupSchema, SigninSchema } from './'
import { UserInterface } from '../user'

export type SignupPayload = InferType<typeof SignupSchema>

export type SigninPayload = InferType<typeof SigninSchema>

export interface SigninResponse {
	user: UserInterface
	token: string
}
