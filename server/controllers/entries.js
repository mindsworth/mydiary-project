import client from '../models/database/dbconnect';

class EntriesController {
  async getAllEntries(req, res) {
    try {
      const userId = req.userData.userID;

      const query = await client.query(
        `SELECT * FROM entries WHERE user_id=($1) ORDER BY entry_id ASC;`, [
          userId,
        ],
      );
      const entries = query.rows;
      const count = entries.length;
      return res.status(200).json({
        message: "List of all entries",
        "Number of entries added": count,
        entries,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request",
        error,
      });
    }
  }

  async addEntry(req, res) {
    try {
      const {
        title,
        description,
        categoryId,
      } = req.body;

      const userId = req.userData.userID;

      const query = await client.query(
        `SELECT * FROM entries WHERE user_id=($1) AND title=($2)`, [
          userId,
          title,
        ],
      );

      if (query.rows.length) {
        return res.status(409).json({
          message: "Title already exist.",
        });
      }

      const sql = `INSERT INTO entries(
        title,
        description,
        category_id,
        user_id,
        createdAt,
        updatedAt
        ) VALUES($1, $2, $3, $4, $5, $6)`;

      const values = [
        title,
        description,
        categoryId,
        userId,
        'now',
        'now',
      ];

      await client.query(sql, values);

      const fetchUser = await client.query(
        `SELECT * FROM entries WHERE user_id=($1) AND title=($2)`, [
          userId,
          title,
        ],
      );

      const newEntry = fetchUser.rows;

      return res.status(201).json({
        message: 'ENTRY CREATED SUCCESSFULLY.',
        newEntry,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request",
        error,
      });
    }
  }

  async getOneEntry(req, res) {
    try {
      const {
        params,
      } = req;

      const userId = req.userData.userID;
      if (!Number(params.entryId)) {
        return res.status(400).json({
          message: `${params.entryId} is not a valid entry ID.`,
        });
      }

      const query = await client.query(
        `SELECT * FROM entries WHERE  user_id=($1) AND entry_id = $2;`, [
          userId,
          params.entryId,
        ],
      );
      const entry = query.rows;

      if (entry.length) {
        return res.status(200).json({
          message: `Get the entry with ID ${params.entryId}`,
          entry,
        });
      }

      return res.status(400).json({
        message: `The entry with the ID ${params.entryId} is not found.`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error processing request.`,
        error,
      });
    }
  }

  async editEntry(req, res) {
    try {
      const {
        params,
        body,
      } = req;

      const userId = req.userData.userID;

      if (!Number(params.entryId)) {
        return res.status(400).json({
          message: `${params.entryId} is not a valid entry ID.`,
        });
      }

      const currentQuery = await client.query(
        `SELECT * FROM entries WHERE  user_id=($1) AND entry_id = $2;`, [
          userId,
          params.entryId,
        ],
      );
      const currentEntry = currentQuery.rows;

      if (!currentEntry.length) {
        return res.status(400).json({
          message: `The entry with the ID ${params.entryId} is not found.`,
        });
      }

      const data = {
        title: body.title ? body.title.trim() : currentEntry[0].title,
        description: body.description ? body
          .description.trim() : currentEntry[0].description,
      };

      await client.query(
        `UPDATE entries SET title=($1),
        description=($2),
        updatedAt = ($3) WHERE user_id = ($4) AND entry_id = ($5)
        `, [
          data.title,
          data.description,
          'now',
          userId,
          params.entryId,
        ],
      );

      const query = await client.query(
        `SELECT * FROM entries WHERE entry_id = ${params.entryId};`,
      );
      const updatedEntry = query.rows;

      return res.status(200).json({
        message: `Entry Successfully Updated`,
        updatedEntry,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error processing request.`,
        error,
      });
    }
  }

  async deleteEntry(req, res) {
    try {
      const {
        params,
      } = req;

      const userId = req.userData.userID;

      const currentQuery = await client.query(
        `SELECT * FROM entries WHERE  user_id=($1) AND entry_id = $2;`, [
          userId,
          params.entryId,
        ],
      );
      const currentEntry = currentQuery.rows;

      if (!currentEntry.length) {
        return res.status(404).json({
          message: `Entry to DELETE is not found.`,
        });
      }
      await client.query(
        `DELETE FROM entries WHERE entry_id=${params.entryId};`,
      );

      return res.status(202).json({
        message: `Entry successfully deleted!`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error processing request.`,
        error,
      });
    }
  }
}

export default new EntriesController();