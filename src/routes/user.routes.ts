import { Router } from 'express'

import { GetCurrentUser, GetAllUsers, GetUserByID } from '../app/user'
import { Authenticate } from '../middlewares'

const route = Router()

export default (app: Router) => {
	app.use('/v1/user', route)

	route.get('/me', Authenticate, GetCurrentUser)
	route.get('/all', Authenticate, GetAllUsers)
	route.get('/:id', Authenticate, GetUserByID)
}
