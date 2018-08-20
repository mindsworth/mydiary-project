import UsersController from '../controllers/users';
import Auth from '../middleware/check-auth';
import upload from '../middleware/upload';
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
  router.route('/user/update')
    .put(
      Auth.verifyToken,
      upload.single('profileImage'),
      UsersController.updateProfile,
    );
  router.route('/user/removeprofileimage')
    .put(
      Auth.verifyToken,
      UsersController.deleteProfileImage,
    );
  router.route('/user/reminder')
    .put(
      Auth.verifyToken,
      UsersController.updateReminder,
    );
};

export default userRoutes;