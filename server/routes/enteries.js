import express from 'express';
import EntriesController from '../controllers/enteries';
import Validator from '../Helpers/validator';

const router = express.Router();


router.get('/', EntriesController.getAllEntries);
router.post('/', Validator
  .checkValidEntryInput('title', 'description'), EntriesController.AddEntry);
router.get('/:entryId', Validator
  .checkValidId('entryId'), EntriesController.getOneEntry);
router.put('/:entryId', Validator
  .checkValidId('entryId'), EntriesController.editEntries);
router.delete('/:entryId', Validator
  .checkValidId('entryId'), EntriesController.deleteEntry);

export default router;