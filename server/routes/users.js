import UsersController from '../controllers/users';
import {
  signupValidation,
  schemas,
} from '../helpers/validator';
import Auth from '../middleware/check-auth';

const userRoutes = (router) => {
  router.route('/auth/signup')
    .post(signupValidation(schemas.signupSchema), UsersController.createUser);
  router.route('/auth/login')
    .post(
      Auth.verifyToken,
      signupValidation(schemas.loginSchema),
      UsersController.userLogin,
    );
};

export default userRoutes;