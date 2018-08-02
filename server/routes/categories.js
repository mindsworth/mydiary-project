import CategoriesController from '../controllers/categories';
import Auth from '../middleware/check-auth';
import {
  categoryValidation,
  schemas,
} from '../helpers/validator';

const categoryRoutes = (router) => {
  router.route('/categories')
    .post(
      categoryValidation(schemas.categorySchema),
      Auth.verifyToken,
      CategoriesController.addCategory,
    );
};

export default categoryRoutes;