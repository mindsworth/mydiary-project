import client from '../models/database/dbconnect';

class CategoriesController {
  async addCategory(req, res) {
    try {
      let {
        title,
        colorId,
      } = req.body;
      title = title.trim();
      const checkTitle = await client.query(
        `SELECT * FROM categories WHERE title=($1)`, [
          title,
        ],
      );

      console.log(checkTitle);
      if (!checkTitle.rows.length > 0) {
        const sql = `INSERT INTO categories(title,color_id) VALUES($1, $2)`;
        const values = [
          title,
          colorId,
        ];

        await client.query(sql, values);

        const fetchCategory = await client.query(
          `SELECT * FROM categories WHERE title=($1)`, [
            title,
          ],
        );
        const newCategory = fetchCategory.rows;
        return res.status(200).json({
          message: 'Category created successufully!',
          newCategory,
        });
      }

      return res.status(200).json({
        message: 'Category already exist!',
      });
    } catch (error) {
      return res.status(200).json({
        message: 'Error processing request',
        error,
      });
    }
  }
}

export default new CategoriesController();