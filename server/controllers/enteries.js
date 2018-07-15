import Entry from '../models/enteries';

let entries = Entry;

export const entriesGetAll = (req, res) => {
  const count = entries.length;
  res.status(200).json({
    message: "List of all entries",
    "Number of entries": count,
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