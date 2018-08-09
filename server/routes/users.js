import UsersController from '../controllers/users';
import Auth from '../middleware/check-auth';
import {
  signupValidation,
  schemas,
} from '../helpers/validator';

const userRoutes = (router) => {
  router.route('/auth/signup')
    .post(
      signupValidation(schemas.signupSchema),
      UsersController.createUser,
    );
  router.route('/auth/login')
    .post(
      signupValidation(schemas.loginSchema),
      UsersController.userLogin,
    );
  router.route('/user')
    .get(
      Auth.verifyToken,
      UsersController.getSingleUser,
    );
};

export default userRoutes;