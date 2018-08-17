import client from '../models/database/dbconnect';

/**
 * Class implementation for /api/v1/user routes
 * @class CategoriesController
 */

class CategoriesController {
  /**
   * @description - Creating new Category
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */
  async addCategory(req, res) {
    try {
      const {
        title,
        colorId,
      } = req.body;

      const userId = req.userData.userID;

      const checkTitle = await client.query(
        `SELECT * FROM categories WHERE title=($1) AND user_id=($2)`, [
          title,
          userId,
        ],
      );

      if (!checkTitle.rows.length > 0) {
        const sql = `INSERT INTO categories
          (title,color_id, user_id) VALUES($1, $2, $3)`;
        const values = [
          title.trim(),
          colorId,
          userId,
        ];

        await client.query(sql, values);

        const fetchCategory = await client.query(
          `SELECT * FROM categories WHERE title=($1) AND user_id=($2)`, [
            title,
            userId,
          ],
        );
        const newCategory = fetchCategory.rows;
        return res.status(201).json({
          message: 'Category created successufully!',
          newCategory,
        });
      }

      return res.status(409).json({
        message: 'Category already exist!',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error processing request',
        error: error.toString(),
      });
    }
  }

  /**
   * @description - Deleting category
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */
  async deleteCategory(req, res) {
    try {
      const {
        categoryid,
      } = req.params;

      const userId = req.userData.userID;

      if (!Number(categoryid)) {
        return res.status(400).json({
          message: `${categoryid} is not a valid entry ID.`,
        });
      }

      const fetchCategory = await client.query(
        `DELETE FROM categories WHERE category_id=($1) AND user_id=($2)`, [
          categoryid,
          userId,
        ],
      );

      if (fetchCategory.rowCount === 1) {
        await client.query(
          `DELETE FROM entries WHERE user_id=($1) AND category_id=($2)`, [
            userId,
            categoryid,
          ],
        );
        return res.status(200).json({
          message: 'Category with related entry(ies) Successfully Deleted!',
        });
      }
      return res.status(400).json({
        message: `The category with the ID ${categoryid} is not found.`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error Processing Request`,
        error: error.toString(),
      });
    }
  }

  /**
   * @description - Fetching all categories
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */

  async getAllCategories(req, res) {
    try {
      const userId = req.userData.userID;
      const query = await client.query(
        `SELECT * FROM categories WHERE user_id=${userId}`,
      );

      const categories = query.rows;

      return res.status(200).json({
        message: 'Get all categories successful.',
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error Processing Request`,
        error: error.toString(),
      });
    }
  }

  /**
   * @description - Fetch a single category
   *
   * @param { object }  req
   * @param { object }  res
   *
   * @returns { object } object
   */

  async getSingleCategory(req, res) {
    try {
      const {
        categoryid,
      } = req.params;
      const userId = req.userData.userID;
      if (!Number(categoryid)) {
        return res.status(400).json({
          message: `${categoryid} is not a valid user ID.`,
        });
      }

      const query = await client.query(
        `SELECT * FROM categories WHERE category_id=($1) AND user_id=($2);`, [
          categoryid,
          userId,
        ],
      );
      const category = query.rows;

      if (category.length) {
        return res.status(200).json({
          message: `Get the category with ID ${categoryid}`,
          category,
        });
      }

      return res.status(400).json({
        message: `The category with the ID ${categoryid} is not found.`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error processing request.`,
        error: error.toString(),
      });
    }
  }
}

export default new CategoriesController();