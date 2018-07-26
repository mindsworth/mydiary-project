import UsersController from '../controllers/users';

const userRoutes = (router) => {
  router.route('/auth/signup')
    .post(UsersController.createUser);
  router.route('/auth/login')
    .post(UsersController.userLogin);
};

export default userRoutes;