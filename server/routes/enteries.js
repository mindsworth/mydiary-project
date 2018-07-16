import express from 'express';
import {
  entriesGetAll,
  entriesGetOne,
  entriesEdit,
  entryDelete,
  entriesAddEntry,
} from '../controllers/enteries';

const router = express.Router();

router.get('/', entriesGetAll);
router.post('/', entriesAddEntry);
router.get('/:entryId', entriesGetOne);
router.put('/:entryId', entriesEdit);
router.delete('/:entryId', entryDelete);

export default router;