import UsersController from '../controllers/users';
import Auth from '../middleware/check-auth';
import upload from '../middleware/upload';

const userRoutes = (router) => {
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
};

export default userRoutes;