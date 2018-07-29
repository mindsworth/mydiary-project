import JWT from "jsonwebtoken";
import dotenv from 'dotenv';

import client from '../models/database/dbconnect';

dotenv.config();

class Auth {
  async verifyToken(req, res, next) {
    const token = req
      .body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      JWT.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: 'Invalid authorization token',
          });
        }

        client.query(
          `SELECT * FROM users WHERE user_id = ($1);`, [
            decoded.userID,
          ],
        ).then(() => {
          req.userData = decoded;
          return next();
        }).catch(error => res.status(400).json({
          message: 'This user does not exist',
          error,
        }));
      });
    } else {
      res.status(403).json({
        message: 'Token not provided',
      });
    }
  }
}

export default new Auth();