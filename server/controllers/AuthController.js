/**
 * @class UserController
 */
class AuthController {
	/**
	 * @description - Creating new User
	 *
	 * @param { object }  request
	 * @param { object }  response
	 *
	 */
	async createUser(request, response) {
		console.log('request :', request, response)
		return response.status(201).json({
			status: 'Success',
			message: 'You signed up'
		})
	}
}

export default new AuthController()
