const errorMessages = {
  titleCharNum: 'Your title can not be more than 50 characters',
  descriptionCharNum: 'Your title can not be more than 1000 characters',
};

class Validator {
  checkValidId(entryId) {
    return (req, res, next) => {
      const {
        params,
      } = req;
      const id = params[entryId];
      if (!Number(id)) {
        return res.status(404).json({
          message: `${id} is not a valid ID.`,
        });
      }
      return next();
    };
  }

  checkValidEntryInput(...params) {
    const errors = [];
    return (req, res, next) => {
      params.forEach((p) => {
        if (req.body[p] === 'title') {
          console.log(p);
          if (req.body[p].length > 50) {
            return res.status(400).json({
              message: errorMessages.titleCharNum,
            });
          }
        }

        if (req.body[p] === 'description') {
          if (req.body[p].length > 1000) {
            return res.status(400).json({
              message: errorMessages.descriptionCharNum,
            });
          }
        }

        if (req.body[p] === undefined || req.body[p].trim() === '') {
          errors.push(p);
        }
      });

      if (errors.length || errors === undefined) {
        const str = errors.toString();
        errors.length = 0;
        return res.status(400).json({
          message: `${str} fields are required`,
        });
      }
      return next();
    };
  }
}

export default new Validator();