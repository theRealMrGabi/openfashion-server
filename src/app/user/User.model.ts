import mongoose, { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import { UserInterface } from './'
import { UserAccessEnum, UserRole } from './user.interface'
import { PasswordService } from '../auth'

export interface IUserModel extends UserInterface {}

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true
		},
		access: {
			type: String,
			enum: Object.values(UserAccessEnum),
			default: UserAccessEnum.GRANTED
		},
		role: {
			type: String,
			enum: Object.values(UserRole),
			default: UserRole.USER
		},
		emailVerifiedAt: { type: Date, default: null },
		phoneVerifiedAt: { type: Date, default: null }
	},
	{
		timestamps: true,
		toJSON: {
			// eslint-disable-next-line no-unused-vars
			transform(_doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.__v
				delete ret.password
			}
		}
	}
)

UserSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashedPassword = await PasswordService.hash(this.get('password'))
		this.set('password', hashedPassword)
	}
	done()
})

UserSchema.plugin(paginate)

const User = model<IUserModel, mongoose.PaginateModel<IUserModel>>(
	'User',
	UserSchema
)

export default User
