import EntriesController from '../controllers/entries';
import Auth from '../middleware/check-auth';
import {
  entryValidation,
  schemas,
} from '../helpers/validator';

const entryRoutes = (router) => {
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
    .delete(
      Auth.verifyToken,
      EntriesController.deleteEntry,
    );

  router.route('/entries')
    .post(
      Auth.verifyToken,
      entryValidation(schemas.entrySchema),
      EntriesController.addEntry,
    );
  router.route('/favorite')
    .get(
      Auth.verifyToken,
      EntriesController.getAllFavoriteEntries,
    );
  router.route('/favorite/:entryId')
    .put(
      Auth.verifyToken,
      EntriesController.toggleFavoriate,
    );
};

export default entryRoutes;