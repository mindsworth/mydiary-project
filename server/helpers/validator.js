import Lodash from 'lodash'
import Validator from 'validatorjs'

export const entryValidation = schema => (req, res, next) => {
	const obj = req.body
	const entryDatails = Lodash.pick(obj, ['title', 'description'])

	const validation = new Validator(
		{
			...entryDatails
		},
		schema
	)
	if (validation.fails()) {
		return res.status(400).json({
			message: validation.errors.all()
		})
	}
	next()
}

export const signupValidation = schema => (req, res, next) => {
	const obj = req.body
	const entryDatails = Lodash.pick(obj, [
		'firstName',
		'lastName',
		'email',
		'password',
		'password_confirmation'
	])

	const validation = new Validator(
		{
			...entryDatails
		},
		schema
	)
	if (validation.fails()) {
		return res.status(400).json({
			message: validation.errors.all()
		})
	}
	next()
}

export const categoryValidation = schema => (req, res, next) => {
	const obj = req.body
	const entryDatails = Lodash.pick(obj, ['title', 'colorId'])

	const validation = new Validator(
		{
			...entryDatails
		},
		schema
	)
	if (validation.fails()) {
		return res.status(400).json({
			message: validation.errors.all()
		})
	}
	next()
}

export const schemas = {
	entrySchema: {
		title: 'required|max:50',
		description: 'required|max:1000'
	},
	signupSchema: {
		email: 'required|email',
		password: 'required|min:6|confirmed',
		password_confirmation: 'required',
		firstName: 'required|min:3|string|max:20',
		lastName: 'required|min:3|string|max:20'
	},
	loginSchema: {
		email: 'required|email',
		password: 'required'
	},
	categorySchema: {
		title: 'required|max:50',
		colorId: 'required|integer'
	}
}
