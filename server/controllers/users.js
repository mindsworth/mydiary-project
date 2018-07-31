import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import Lodash from 'lodash';
import dotenv from 'dotenv';
import client from '../models/database/dbconnect';

dotenv.config();

class UsersController {
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
          `SELECT * FROM users WHERE email = ($1);`, [
            email,
          ],
        );
        const user = newUserQuery.rows;

        const newUser = Lodash.pick(user, [
          'email',
          'user_id',
        ]);
        const token = JWT.sign(newUser, process.env.JWT_KEY, {
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
        error,
      });
    }
  }


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
            if (err) {
              return res.status(401).json({
                message: 'Invalid login credentials',
              });
            }

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
            });
          },
        );
      } else {
        return res.status(401).json({
          message: 'Invalid login credentials',
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "Error processing request.",
        error,
      });
    }
  }
}

export default new UsersController();