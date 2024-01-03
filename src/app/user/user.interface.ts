/* eslint-disable no-unused-vars */
import { Document } from 'mongoose'

export interface UserInterface extends Document {
	id: string
	email: string
	firstName: string
	lastName: string
	password: string
	phoneNumber: string
	access: UserAccessEnum
	emailVerifiedAt?: Date | null
	phoneVerifiedAt?: Date | null
	createdAt: Date
	updatedAt: Date
	role: UserRole
}

export enum UserAccessEnum {
	GRANTED = 'granted',
	REVOKED = 'revoked'
}

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user'
}
