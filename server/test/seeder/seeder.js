import bcrypt from "bcrypt";
import client from '../../models/database/dbconnect';

const seeder = {
  setEntryData(title, description, categoryId) {
    return {
      title,
      description,
      categoryId,
    };
  },

  setEditEntryData(title, description) {
    return {
      title,
      description,
    };
  },

  setCategoryData(title, colorId) {
    return {
      title,
      colorId,
    };
  },

  setUserSignUpData(
    firstName,
    lastName,
    email,
    password,
    password_confirmation, // eslint-disable-line camelcase
  ) {
    return {
      firstName,
      lastName,
      email,
      password,
      password_confirmation,
    };
  },

  setUpdateProfileData(
    about,
    age,
    tel,
    reminder,
    imagePath,
    imagePathId, // eslint-disable-line camelcase
  ) {
    return {
      about,
      age,
      tel,
      reminder,
      imagePath,
      imagePathId,
    };
  },

  setReminderData(reminder) {
    return {
      reminder,
    };
  },
  setFavoriteData(favStatus) {
    return {
      favStatus,
    };
  },

  setUserLogInData(email, password) {
    return {
      email,
      password,
    };
  },

  async emptyUserTable() {
    try {
      await client.query(`TRUNCATE ONLY users`);
    } catch (error) {
      console.log(error);
    }
  },

  async addUser() {
    try {
      const password = 'chigodwin1';
      const userHash = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO users(
          first_name,
          last_name,
          email,
          password,
          reminder,
          createdAt,
          updatedAt)
          VALUES($1, $2, $3, $4, $5, $6, $7)`;

      const user1 = [
        'Chigoziem',
        'Nwaiwu',
        'princegoziem@gmail.com',
        userHash,
        false,
        'now',
        'now',
      ];

      const user2 = [
        'Adewale',
        'Adetiba',
        'adetibawaley@gmail.com',
        userHash,
        false,
        'now',
        'now',
      ];

      await client.query(sql, user1);
      await client.query(sql, user2);
    } catch (error) {
      console.log(error);
    }
  },
};

export default seeder;