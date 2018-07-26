import EntriesController from '../controllers/entries';
import Validator from '../Helpers/validator';

// const router = express.Router();

const entryRoutes = (router) => {
  router.route('/abc')
    .get((req, res) => res.status(200).json({
      message: 'Welcome to myDiary app for everyone.aaaa',
    }));
  router.route('/entries')
    .get(EntriesController.getAllEntries);

  router.route('/entries/:entryId')
    .put(Validator.checkValidId('entryId'), EntriesController.editEntry)
    .get(Validator.checkValidId('entryId'), EntriesController.getOneEntry)
    .delete(Validator.checkValidId('entryId'), EntriesController.deleteEntry);

  router.route('/entries')
    .post(Validator.checkValidEntryInput(
      'title',
      'description',
    ), EntriesController.addEntry);
};

export default entryRoutes;