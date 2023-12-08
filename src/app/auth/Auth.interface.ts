import { InferType } from 'yup'
import { SignupSchema } from './'

export type SignupPayload = InferType<typeof SignupSchema>
