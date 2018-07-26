import entryRoutes from './entries';
import userRoutes from './users';
import tableRoutes from './tables';
// import categoryRoutes from './order';

const routes = (router) => {
  router.route('/')
    .get((req, res) => res.status(200).json({
      message: 'Welcome to myDiary app for everyone.',
    }));

  /* Users Routes */
  userRoutes(router);

  /* Entries Routes */
  entryRoutes(router);

  /* Category Routes */
  tableRoutes(router);

  /* Category Routes */
  // categoryRoutes(router);
};

export default routes;