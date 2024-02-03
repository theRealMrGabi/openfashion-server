import { Request, Response, NextFunction } from 'express'

import { AppError } from '../helpers'
import { UserRole } from '../app/user'

export const RoleRestriction = (roles: UserRole[]) => {
	// eslint-disable-next-line no-unused-vars
	return (req: Request, _res: Response, next: NextFunction) => {
		const role = req?.user && req?.user.user.role

		if (role && !roles.includes(role)) {
			return next(
				new AppError(403, 'You do not have permission to access this resource')
			)
		}

		next()
	}
}
