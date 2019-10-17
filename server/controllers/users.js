import cloudinary from 'cloudinary'

import client from '../models/database/dbconnect'
import cloudinaryConfig from '../middleware/cloudinaryConfig'

cloudinaryConfig()

/**
 * Class implementation for /api/v1/user routes
 * @class UsersController
 */

class UsersController {
	/**
	 * @description - Getting single User
	 *
	 * @param { object }  req
	 * @param { object }  res
	 *
	 * @returns { object } object
	 */
	async getSingleUser(req, res) {
		try {
			const userId = req.userData.userID

			const query = await client.query(
				`SELECT
        user_id,
        first_name,
        last_name,
        email,
        profile_image,
        profile_image_id,
        phone_number,
        reminder,
        about,
        age,
        createdAt,
        updatedAt  FROM users WHERE  user_id=($1);`,
				[userId]
			)
			const user = query.rows

			if (user.length) {
				return res.status(200).json({
					message: `Get the user with ID ${userId}`,
					user
				})
			}
		} catch (error) {
			return res.status(500).json({
				message: `Error processing request.`,
				error: error.toString()
			})
		}
	}

	/**
	 * @description - Updating User's Record
	 *
	 * @param { object }  req
	 * @param { object }  res
	 *
	 * @returns { object } object
	 */
	async updateProfile(req, res) {
		try {
			const userId = req.userData.userID

			const userQuery = await client.query(
				`SELECT * FROM users WHERE user_id = ($1);`,
				[userId]
			)

			const user = userQuery.rows

			const about = req.body.about ? req.body.about.trim() : user[0].about
			const age = req.body.age ? req.body.age.trim() : user[0].age
			const tel = req.body.tel
				? req.body.tel.trim()
				: user[0].phone_number
			const imagePath = req.file
				? req.file.secure_url
				: user[0].profile_image
			const imagePathId = req.file
				? req.file.public_id
				: user[0].profile_image_id

			const sql = `UPDATE users SET about=($1),
        age=($2),
        profile_image = ($3),
        profile_image_id = ($4),
        updatedAt=($5),
        phone_number = ($6) WHERE user_id = ($7)`

			const values = [
				about,
				age,
				imagePath,
				imagePathId,
				'now',
				tel,
				userId
			]

			await client.query(sql, values)

			const query = await client.query(
				`SELECT
        user_id,
        first_name,
        last_name,
        email,
        about,
        profile_image,
        profile_image_id,
        age,
        phone_number,
        createdAt,
        updatedAt  FROM users WHERE  user_id=${userId};`
			)

			const userUpdated = query.rows
			return res.status(200).json({
				message: 'Profile Successfully Updated',
				userUpdated
			})
		} catch (error) {
			return res.status(500).json({
				message: 'Error processing request.',
				error: error.toString()
			})
		}
	}

	/**
	 * @description - Removing Profile Image
	 *
	 * @param { object }  req
	 * @param { object }  res
	 *
	 * @returns { object } object
	 */
	async deleteProfileImage(req, res) {
		try {
			const userId = req.userData.userID

			const userQuery = await client.query(
				`SELECT * FROM users WHERE user_id = ($1);`,
				[userId]
			)

			const user = userQuery.rows

			if (user.profile_image) {
				await cloudinary.v2.uploader.destroy(
					user[0].profile_image_id,
					(error, result) => {
						console.log(result)
					}
				)
			}

			await client.query(
				`UPDATE users SET profile_image=NULL,
        profile_image_id=NULL WHERE user_id=($1);`,
				[userId]
			)

			return res.status(200).json({
				message: `Profile image removed successfully!`
			})
		} catch (error) {
			return res.status(500).json({
				message: `Error processing request.`,
				error: error.toString()
			})
		}
	}
}

export default new UsersController()
