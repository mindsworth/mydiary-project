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
    return [
      { propName: 'title', value: title },
      { propName: 'description', value: description },
    ];
  },
};

export default entrySeeder;