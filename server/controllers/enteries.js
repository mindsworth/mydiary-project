import Entry from '../models/enteries';

const entries = Entry;

export const entriesGetAll = (req, res) => {
  const count = entries.length;
  res.status(200).json({
    message: "List of all entries",
    "Number of entries": count,
    entries,
  });
};

export const entriesAddEntry = (req, res) => {
  res.status(200).json({
    message: "Adding new entry",
  });
};

export const entriesGetOne = (req, res) => {
  const { params } = req;
  res.status(200).json({
    message: "Getting one entry",
    entryId: params.entryId,
  });
};