import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

import client from '../models/database/dbconnect';
import cloudinaryConfig from '../middleware/cloudinaryConfig';

dotenv.config();
cloudinaryConfig();

/**
 * Class implementation for /api/v1/user routes
 * @class UsersController
 */

class UsersController {
  /**
   * @description - Creating new User
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */
  async createUser(req, res) {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    try {
      const query = await client.query(
        `SELECT * FROM users WHERE email = ($1);`, [
          email,
        ],
      );
      const checkEmail = query.rows;

      if (!checkEmail.length) {
        const hashPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users(
          first_name,
          last_name,
          email,
          password,
          createdAt,
          updatedAt)
          VALUES($1, $2, $3, $4, $5, $6)`;

        const values = [
          firstName,
          lastName,
          email,
          hashPassword,
          'now',
          'now',
        ];

        await client.query(sql, values);

        const newUserQuery = await client.query(
          `SELECT
          user_id,
          first_name,
          last_name,
          email,
          createdAt FROM users WHERE email = ($1);`, [
            email,
          ],
        );
        const user = newUserQuery.rows;

        const token = JWT.sign({
          email: user[0].email,
          userID: user[0].user_id,
        }, process.env.JWT_KEY, {
          expiresIn: '1hr',
        });

        return res.status(201).json({
          message: 'Registration Successful',
          user,
          token,
        });
      }
      return res.status(409).json({
        message: `Email "${email}" already exist`,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request.",
        error: error.toString(),
      });
    }
  }

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
      const userId = req.userData.userID;
      if (!Number(userId)) {
        return res.status(400).json({
          message: `${userId} is not a valid user ID.`,
        });
      }

      const query = await client.query(
        `SELECT
        user_id,
        first_name,
        last_name,
        email,
        about,
        age,
        createdAt,
        updatedAt  FROM users WHERE  user_id=($1);`, [
          userId,
        ],
      );
      const user = query.rows;

      if (user.length) {
        return res.status(200).json({
          message: `Get the user with ID ${userId}`,
          user,
        });
      }

      return res.status(400).json({
        message: `The user with the ID ${userId} is not found.`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error processing request.`,
        error: error.toString(),
      });
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
    const {
      email,
      password,
    } = req.body;

    try {
      const query = await client.query(
        `SELECT * FROM users WHERE email = ($1);`, [
          email,
        ],
      );

      const user = query.rows;

      if (user[0]) {
        bcrypt.compare(
          password,
          user[0].password,
          (err, result) => {
            if (result) {
              const token = JWT.sign({
                email: user[0].email,
                userID: user[0].user_id,
              }, process.env.JWT_KEY, {
                expiresIn: '1hr',
              });

              return res.status(200).json({
                message: 'Logged in successfully.',
                token,
              });
            }
            return res.status(401).json({
              message: 'Invalid login credentials',
              error: err,
            });
          },
        );
      } else {
        return res.status(401).json({
          message: 'Invalid login credentials',
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request.",
        error: error.toString(),
      });
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
      const userId = req.userData.userID;

      const userQuery = await client.query(
        `SELECT * FROM users WHERE user_id = ($1);`, [
          userId,
        ],
      );

      const user = userQuery.rows;
      console.log(userId);

      const about = req.body.about ? req.body.about.trim() : user[0].about;
      const age = req.body.age ? req.body.age.trim() : user[0].age;
      const tel = req.body.tel ? req.body.tel.trim() : user[0].phone_number;
      const imagePath = req.file ? req.file.secure_url : user[0].profile_image;
      const imagePathId = req.file ? req.file.public_id : user[0]
        .profile_image_id;

      console.log(about);

      const sql = `UPDATE users SET about=($1),
        age=($2),
        profile_image = ($3),
        profile_image_id = ($4),
        updatedAt=($5),
        phone_number = ($6) WHERE user_id = ($7)`;

      const values = [
        about,
        age,
        imagePath,
        imagePathId,
        'now',
        tel,
        userId,
      ];

      await client.query(sql, values);

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
        updatedAt  FROM users WHERE  user_id=${userId};`,
      );

      const userUpdated = query.rows;
      return res.status(200).json({
        message: 'Profile Successfully Updated',
        userUpdated,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request.",
        error: error.toString(),
      });
    }
  }

  /**
   * @description - Deleting an Entry
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */
  async deleteProfileImage(req, res) {
    try {
      const userId = req.userData.userID;

      const userQuery = await client.query(
        `SELECT * FROM users WHERE user_id = ($1);`, [
          userId,
        ],
      );

      const user = userQuery.rows;

      await cloudinary.v2.uploader.destroy(user[0].profile_image_id,
        (error, result) => {
          console.log(result);
        });

      await client.query(
        `UPDATE users SET profile_image=null,
        profile_image_id=null WHERE user_id=${userId};`,
      );

      return res.status(200).json({
        message: `Profile image removed successfully!`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error processing request.`,
        error: error.toString(),
      });
    }
  }
}

export default new UsersController();