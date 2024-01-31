import { Router } from 'express'

import { Authenticate } from '../middlewares'
import { PaymentCheckout } from '../app/payment'

const route = Router()

export default (app: Router) => {
	app.use('/v1/payment', route)

	route.post('/check-out', Authenticate, PaymentCheckout)
}
