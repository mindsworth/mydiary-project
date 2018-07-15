import Entry from '../models/enteries';

let entries = Entry;

export const entriesGetAll = (req, res) => {
  const count = entries.length;
  res.status(200).json({
    message: "List of all entries",
    "Number of entries added": count,
    entries,
  });
};

export const entriesAddEntry = (req, res) => {
  const entry = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    category_id: 3,
    user_id: 3,
  };

  console.log(entry);

  entries = [...entries, entry];

  res.status(200).json({
    message: "Adding new entry",
    entries,
  });
};

export const entriesGetOne = (req, res) => {
  const { params } = req;

  const fetchedEntry = entries
    .find(entry => entry._id === Number(params.entryId));
  console.log(fetchedEntry);
  console.log(params.entryId);
  if (fetchedEntry) {
    // const fetchedEntry = entries[params.entryId - 1];
    res.status(200).json({
      message: `Get the entry with ID ${params.entryId}`,
      entryId: fetchedEntry,
    });
  } else {
    res.status(404).json({
      message: `The entry with the ID ${params.entryId} is not found.`,
    });
  }
};