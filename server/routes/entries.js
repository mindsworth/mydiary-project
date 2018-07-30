import EntriesController from '../controllers/entries';
import Auth from '../middleware/check-auth';
import {
  entryValidation,
  schemas,
} from '../helpers/validator';

const entryRoutes = (router) => {
  router.route('/abc')
    .get((req, res) => res.status(200).json({
      message: 'Welcome to myDiary app for everyone.',
    }));
  router.route('/entries')
    .get(
      Auth.verifyToken,
      EntriesController.getAllEntries,
    );

  router.route('/entries/:entryId')
    .put(
      Auth.verifyToken,
      entryValidation(schemas.entrySchema),
      EntriesController.editEntry,
    )
    .get(
      Auth.verifyToken,
      EntriesController.getOneEntry,
    )
    .delete(EntriesController.deleteEntry);

  router.route('/entries')
    .post(
      Auth.verifyToken,
      entryValidation(schemas.entrySchema),
      EntriesController.addEntry,
    );
};

export default entryRoutes;