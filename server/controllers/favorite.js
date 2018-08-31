import client from '../models/database/dbconnect';

class FavoriteController {
  /**
   * @description - handling favorite Entry
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */

  async toggleFavoriate(req, res) {
    try {
      const {
        favStatus,
      } = req.body;

      const userId = req.userData.userID;
      const {
        entryId,
      } = req.params;

      await client.query(
        `UPDATE entries SET favorite=($1)
        WHERE user_id = ($2) AND entry_id = ($3)
        `, [
          favStatus,
          userId,
          req.params.entryId,
        ],
      );

      const query = await client.query(
        `SELECT favorite FROM entries
        WHERE user_id = ($1) AND entry_id = ($2)
        `, [
          userId,
          entryId,
        ],
      );
      const newFavStatus = query.rows;

      return res.status(200).json({
        message: `Favorite status Successfully Updated.`,
        newFavStatus,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error processing request.`,
        error: error.toString(),
      });
    }
  }

  /**
   * @description - Get all Favorite Entries
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */
  async getAllFavoriteEntries(req, res) {
    try {
      const userId = req.userData.userID;

      const query = await client.query(
        `SELECT * FROM entries
        WHERE favorite=($1) AND user_id=($2) ORDER BY entry_id ASC;`, [
          true,
          userId,
        ],
      );
      const favEntries = query.rows;
      const count = favEntries.length;

      if (count === 0) {
        return res.status(200).json({
          message: 'There\'s no Favorite entry to display',
        });
      }

      return res.status(200).json({
        message: "List of all entries",
        "Number of entries added": count,
        favEntries,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request",
        error: error.toString(),
      });
    }
  }
}

export default new FavoriteController();