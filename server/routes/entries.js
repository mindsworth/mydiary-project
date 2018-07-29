import EntriesController from '../controllers/entries';

import {
  entryValidation,
  schemas,
} from '../helpers/validator';

const entryRoutes = (router) => {
  router.route('/abc')
    .get((req, res) => res.status(200).json({
      message: 'Welcome to myDiary app for everyone.aaaa',
    }));
  router.route('/entries')
    .get(EntriesController.getAllEntries);

  router.route('/entries/:entryId')
    .put(entryValidation(schemas.entrySchema), EntriesController.editEntry)
    .get(EntriesController.getOneEntry)
    .delete(EntriesController.deleteEntry);

  router.route('/entries')
    .post(entryValidation(schemas.entrySchema), EntriesController.addEntry);
};

export default entryRoutes;