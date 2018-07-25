// import entries from '../../models/enteries';


const entrySeeder = {
  setEntryData(_id, title, description) {
    return {
      _id,
      title,
      description,
    };
  },

  setEditEntryData(title, description) {
    return {
      title,
      description,
    };
  },
};

export default entrySeeder;