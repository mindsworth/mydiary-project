import Entries from '../models/enteries';

let entries = Entries;

class EntriesController {
  getAllEntries(req, res) {
    const count = entries.length;
    return res.status(200).json({
      message: "List of all entries",
      "Number of entries added": count,
      entries,
    });
  }

  addEntry(req, res) {
    const {
      _id,
      title,
      description,
    } = req.body;

    const entry = {
      _id,
      title,
      description,
      category_id: 3,
      user_id: 3,
    };

    entries = [...entries, entry];

    return res.status(201).json({
      message: "Added new entry",
    });
  }

  getOneEntry(req, res) {
    const {
      params,
    } = req;

    const fetchedEntry = entries
      .find(entry => entry._id === Number(params.entryId));

    if (fetchedEntry) {
      return res.status(200).json({
        message: `Get the entry with ID ${params.entryId}`,
        entry: fetchedEntry,
      });
    }
    return res.status(404).json({
      message: `The entry with the ID ${params.entryId} is not found.`,
    });
  }

  editEntry(req, res) {
    const {
      params,
      body,
    } = req;

    const fetchedEntry = entries
      .find(entry => entry._id === Number(params.entryId));

    if (!fetchedEntry) {
      return res.status(404).json({
        message: `Entry to modify is not found.`,
      });
    }

    fetchedEntry.title = body.title ? body.title.trim() : fetchedEntry.title;
    fetchedEntry.description = body.description ? body
      .description.trim() : fetchedEntry.description;

    return res.status(200).json({
      message: `Entry Successfully Updated`,
      fetchedEntry,
    });
  }

  deleteEntry(req, res) {
    const {
      params,
    } = req;

    const fetchedEntry = entries
      .filter(entry => entry._id !== Number(params.entryId));

    if (fetchedEntry.length === 0 || entries.length < params.entryId) {
      return res.status(404).json({
        message: 'Entry does not exist',
      });
    }
    entries = fetchedEntry;

    return res.status(202).json({
      message: `Entry successfully deleted!`,
    });
  }
}

export default new EntriesController();