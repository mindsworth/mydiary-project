import express from 'express';
import {
  entriesGetAll,
  entriesGetOne,
  entriesEdit,
  entriesAddEntry,
} from '../controllers/enteries';

const router = express.Router();

router.get('/', entriesGetAll);
router.post('/', entriesAddEntry);
router.get('/:entryId', entriesGetOne);
router.put('/:entryId', entriesEdit);


export default router;