import AuthController from '../controllers/auth';
import {
  signupValidation,
  schemas,
} from '../helpers/validator';

const authRoutes = (router) => {
  router.route('/auth/signup')
    .post(
      signupValidation(schemas.signupSchema),
      AuthController.userSignup,
    );
  router.route('/auth/login')
    .post(
      signupValidation(schemas.loginSchema),
      AuthController.userLogin,
    );
};

export default authRoutes;