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
    _id: req.body._id.trim(),
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    category_id: 3,
    user_id: 3,
  };

  if (!req.body.title) {
    return res.status(400).json({
      Message: 'title Field should not be Empty',
    });
  }

  if (!req.body.description) {
    return res.status(400).json({
      Message: 'description Field should not be Empty',
    });
  }

  entries = [...entries, entry];

  return res.status(200).json({
    message: "Adding new entry",
    entries,
  });
};

export const entriesGetOne = (req, res) => {
  const { params } = req;

  const fetchedEntry = entries
    .find(entry => entry._id === Number(params.entryId));

  if (fetchedEntry) {
    return res.status(200).json({
      message: `Get the entry with ID ${params.entryId}`,
      entryId: fetchedEntry,
    });
  }
  return res.status(404).json({
    message: `The entry with the ID ${params.entryId} is not found.`,
  });
};

export const entriesEdit = (req, res) => {
  const { params } = req;

  const fetchedEntry = entries
    .find(entry => entry._id === Number(params.entryId));
  console.log(fetchedEntry);

  if (!fetchedEntry) {
    return res.status(200).json({
      message: `Entry to modify is not available.`,
    });
  }

  for (const props of req.body) {
    if (!props.value) {
      return res.status(400).json({
        Message: `${props.propName} Field should not be Empty`,
      });
    }
    fetchedEntry[props.propName] = props.value;
  }

  return res.status(200).json({
    message: `Modify an Entry`,
    fetchedEntry,
  });
};