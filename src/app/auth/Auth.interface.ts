import { InferType } from 'yup'
import {
	SignupSchema,
	SigninSchema,
	ResetPasswordSchema,
	EmailSchema
} from './'
import { UserInterface } from '../user'

export type SignupPayload = InferType<typeof SignupSchema>

export type SigninPayload = InferType<typeof SigninSchema>

export type ResetPasswordPayload = InferType<typeof ResetPasswordSchema>

export type EmailPayload = InferType<typeof EmailSchema>

export interface SigninResponse {
	user: UserInterface
	token: string
}
