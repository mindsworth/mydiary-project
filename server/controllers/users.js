import client from '../../dbconnect';

class UsersController {
  createUser(req, res) {
    res.status(200).json({
      message: 'Registration Successful',
    });
  }


  userLogin(req, res) {
    res.status(200).json({
      message: 'Logged in successfully',
    });
  }
}

export default new UsersController();