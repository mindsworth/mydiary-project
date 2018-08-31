import client from '../models/database/dbconnect';

class ReminderController {
  /**
   * @description - Deleting an Entry
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */

  async updateReminder(req, res) {
    try {
      const userId = req.userData.userID;

      const {
        reminder,
      } = req.body;

      await client.query(`UPDATE users SET reminder=($1) 
        WHERE user_id = ($2)`, [
        reminder,
        userId,
      ]);

      const query = await client.query(
        `SELECT reminder FROM users WHERE  user_id=${userId};`,
      );
      const reminderUpdated = query.rows;
      return res.status(200).json({
        message: 'Profile Successfully Updated',
        reminderUpdated,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request.",
        error: error.toString(),
      });
    }
  }
}

export default new ReminderController();