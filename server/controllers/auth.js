import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

import client from '../models/database/dbconnect'

dotenv.config()

class AuthController {
	/**
	 * @description - Creating new User
	 *
	 * @param { object }  req
	 * @param { object }  res
	 *
	 * @returns { object } object
	 */
	async userSignup(req, res) {
		const { firstName, lastName, email, password } = req.body
		console.log(req.body)

		try {
			const query = await client.query(
				`SELECT * FROM users WHERE email = ($1);`,
				[email]
			)
			const checkEmail = query.rows

			if (!checkEmail.length) {
				const hashPassword = await bcrypt.hash(password, 10)
				const sql = `INSERT INTO users(
          first_name,
          last_name,
          email,
          password,
          reminder,
          createdAt,
          updatedAt)
          VALUES($1, $2, $3, $4, $5, $6, $7)`

				const values = [
					firstName,
					lastName,
					email,
					hashPassword,
					false,
					'now',
					'now'
				]

				await client.query(sql, values)

				const newUserQuery = await client.query(
					`SELECT
          user_id,
          first_name,
          last_name,
          email,
          createdAt FROM users WHERE email = ($1);`,
					[email]
				)
				const user = newUserQuery.rows

				const token = JWT.sign(
					{
						email: user[0].email,
						userID: user[0].user_id
					},
					process.env.JWT_KEY,
					{
						expiresIn: '1hr'
					}
				)

				return res.status(201).json({
					message: 'Registration Successful',
					user,
					token
				})
			}
			return res.status(409).json({
				message: `Email "${email}" already exist`
			})
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				message: 'Error processing request.',
				error: error.toString()
			})
		}
	}

	/**
	 * @description -Logging in a User
	 *
	 * @param { object }  req
	 * @param { object }  res
	 *
	 * @returns { object } object
	 */
	async userLogin(req, res) {
		const { email, password } = req.body

		try {
			const query = await client.query(
				`SELECT * FROM users WHERE email = ($1);`,
				[email]
			)

			const checkedUser = query.rows
			let token

			if (checkedUser[0]) {
				bcrypt.compare(
					password,
					checkedUser[0].password,
					(err, result) => {
						console.log(result)
						if (result) {
							token = JWT.sign(
								{
									email: checkedUser[0].email,
									userID: checkedUser[0].user_id
								},
								process.env.JWT_KEY,
								{
									expiresIn: '1hr'
								}
							)
							client
								.query(
									`SELECT
                user_id,
                first_name,
                last_name,
                email,
                createdAt FROM users WHERE email = ($1);`,
									[email]
								)
								.then(queryUser => {
									const user = queryUser.rows[0]
									console.log(token)
									return res.status(200).json({
										message: 'Logged in successfully.',
										token,
										user
									})
								})
						} else {
							return res.status(400).json({
								message: 'Invalid login credentials'
							})
						}
					}
				)
			} else {
				return res.status(400).json({
					message: 'Invalid login credentials'
				})
			}
		} catch (error) {
			return res.status(500).json({
				message: 'Error processing request.',
				error: error.toString()
			})
		}
	}
}

export default new AuthController()
