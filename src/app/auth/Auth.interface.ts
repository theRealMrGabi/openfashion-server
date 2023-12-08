import { InferType } from 'yup'
import { SignupSchema, SigninSchema } from './'

export type SignupPayload = InferType<typeof SignupSchema>

export type SigninPayload = InferType<typeof SigninSchema>
