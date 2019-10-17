import AuthController from '../controllers/AuthController'
import { signupValidation, schemas } from '../helpers/validator'

const authRoutes = router => {
	router
		.route('/auth/signup')
		.post(signupValidation(schemas.signupSchema), AuthController.createUser)
}

export default authRoutes
