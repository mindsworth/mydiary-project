import entryRoutes from './entries';
import favoriteRoutes from './favorite';
import userRoutes from './users';
import reminderRoutes from './reminder';
import categoryRoutes from './categories';
import authRoutes from './auth';
import tableRoutes from '../models/database/tables';

const routes = (router) => {
  router.route('/')
    .get((req, res) => res.status(200).json({
      message: 'Welcome to myDiary app for everyone.',
    }));

  /* Auth Routes */
  authRoutes(router);

  /* Users Routes */
  userRoutes(router);

  /* Reminder Routes */
  reminderRoutes(router);

  /* Entries Routes */
  entryRoutes(router);

  /* Favorite Routes */
  favoriteRoutes(router);

  /* Category Routes */
  tableRoutes(router);

  /* Category Routes */
  categoryRoutes(router);
};

export default routes;