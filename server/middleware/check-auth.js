import JWT from "jsonwebtoken";
import dotenv from 'dotenv';

import client from '../models/database/dbconnect';

dotenv.config();

class Auth {
  async verifyToken(req, res, next) {
    const token = req
      .body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      JWT.verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) {
          return res.status(401).json({
            message: 'Invalid authorization token',
          });
        }

        const query = client.query(
          `SELECT * FROM users WHERE user_id = ($1);`, [
            decoded.userId,
          ],
        );

        const user = query.rows;
        if (!user.length) {
          return res.status(400).json({
            message: 'This user does not exist',
          });
        }
        req.userData = decoded;
        return next();

        // .catch(err => res.status(404).json(err)
      });
    } else {
      res.status(403).json({
        message: 'Token not provided',
      });
    }
  }
}

export default new Auth();