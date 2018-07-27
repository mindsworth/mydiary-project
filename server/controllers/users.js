import bcrypt from "bcrypt";
import client from "../../dbconnect";

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
      console.log(checkEmail);

      if (!checkEmail.length) {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);
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

        const newUser = await client.query(
          `SELECT * FROM users WHERE email = ($1);`, [
            email,
          ],
        );
        const user = newUser.rows;
        return res.status(201).json({
          message: 'Registration Successful',
          user,
        });
      }
      return res.status(302).json({
        message: `email "${email}" already exist`,
      });
    } catch (error) {
      return res.status(500).json({
        message: "FAILED TO CREATE DUE TO SOME REASONS.",
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

      if (user.length) {
        res.status(200).json({
          message: 'Logged in successfully',
        });
      }
      res.status(200).json({
        message: 'You are not a registered member',
      });
    } catch (error) {
      return res.status(500).json({
        message: "FAILED TO LOG IN DUE TO SOME REASONS.",
        error,
      });
    }
  }
}

export default new UsersController();