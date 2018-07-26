import TablesController from '../controllers/tables';

const tableRoutes = (router) => {
  router.route('/createuserstable')
    .post(TablesController.createUsersTable);

  router.route('/createentriestable')
    .post(TablesController.createEntriesTable);

  router.route('/createcategoriesTable')
    .post(TablesController.createCategoriesTable);
};

export default tableRoutes;