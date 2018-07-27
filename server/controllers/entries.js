// import Entries from '../models/enteries';
import client from '../../dbconnect';

class EntriesController {
  async getAllEntries(req, res) {
    try {
      const query = await client.query(
        'SELECT * FROM entries ORDER BY entry_id ASC;',
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
        message: "FAILED TO GET ENTRIES.",
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
        userId,
      } = req.body;

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
      return res.status(201).json({
        message: 'ENTRY CREATED SUCCESSFULLY.',
      });
    } catch (error) {
      return res.status(500).json({
        message: "FAILED TO CREATE DUE TO SOME REASONS",
        error,
      });
    }
  }

  async getOneEntry(req, res) {
    const {
      params,
    } = req;

    try {
      const query = await client.query(
        `SELECT * FROM entries WHERE entry_id = ${params.entryId};`,
      );
      const entry = query.rows;

      if (entry.length) {
        return res.status(200).json({
          message: `Get the entry with ID ${params.entryId}`,
          entry,
        });
      }

      return res.status(404).json({
        message: `The entry with the ID ${params.entryId} is not found.`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `FAILED DUE TO SOME REASONS.`,
      });
    }
  }

  async editEntry(req, res) {
    const {
      params,
      body,
    } = req;
    try {
      const currentQuery = await client.query(
        `SELECT * FROM entries WHERE entry_id = ${params.entryId};`,
      );
      const currentEntry = currentQuery.rows;

      if (!currentEntry.length) {
        return res.status(404).json({
          message: `Entry to modify is not found.`,
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
        updatedAt=($3) WHERE entry_id=($4)`, [
          data.title,
          data.description,
          'now',
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
        message: `FAILED DUE TO SOME REASONS.`,
      });
    }
  }

  async deleteEntry(req, res) {
    const {
      params,
    } = req;

    try {
      const currentQuery = await client.query(
        `SELECT * FROM entries WHERE entry_id = ${params.entryId};`,
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
        message: `FAILED DUE TO SOME REASONS.`,
      });
    }
  }
}

export default new EntriesController();