import express from 'express';
import {
  entriesGetAll,
  // entriesGetOne,
  entriesAddEntry,
} from '../controllers/enteries';

const router = express.Router();

router.get('/', entriesGetAll);
router.post('/', entriesAddEntry);
// router.get('/:entryId', entriesGetOne);


export default router;