import chai, {
  expect,
} from 'chai';
import {
  describe,
  it,
  before,
} from 'mocha';
import chaiHttp from 'chai-http';
import jwtDecode from 'jwt-decode';
import server from '../server';

import seeder from './seeder/seeder';

chai.use(chaiHttp);

before(seeder.emptyUserTable);
before(seeder.addUser);

let userToken;
let userId;
describe('POST api/v1/auth/signup', () => {
  it(`should return status code 400 and 
  a message when firstname is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(seeder.setUserSignUpData(
        '',
        'Nwaiwu',
        'princegoziem@gmail.com',
        'chigodwin1',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message.firstName[0])
          .to.deep.equal('The firstName field is required.');
        done();
      });
  });

  it(`should return status code 400 and 
  a message when lastname is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(seeder.setUserSignUpData(
        'Chigoziem',
        '',
        'princegoziem@gmail.com',
        'chigodwin1',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message.lastName[0])
          .to.deep.equal('The lastName field is required.');
        done();
      });
  });

  it(`should return status code 400 and 
  a message when email is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(seeder.setUserSignUpData(
        'Chigoziem',
        'Nwaiwu',
        '',
        'chigodwin1',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message.email[0])
          .to.deep.equal('The email field is required.');
        done();
      });
  });

  it(`should return status code 400 and 
  a message when password is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(seeder.setUserSignUpData(
        'Chigoziem',
        'Nwaiwu',
        'princegoziem@gmail.com',
        '',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message.password[0])
          .to.deep.equal('The password field is required.');
        done();
      });
  });

  it(`should return status code 400 and 
  a message when password_confirmation is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(seeder.setUserSignUpData(
        'Chigoziem',
        'Nwaiwu',
        'princegoziem@gmail.com',
        'chigodwin1',
        '',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message.password[0])
          .to.deep.equal('The password confirmation does not match.');
        done();
      });
  });

  it(`should return status code 409 and 
  a message when user Email already exist.`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(seeder.setUserSignUpData(
        'Chigoziem',
        'Nwaiwu',
        'princegoziem@gmail.com',
        'chigodwin1',
        'chigodwin1',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(409);
        expect(res.body.message)
          .to.deep.equal('Email "princegoziem@gmail.com" already exist');
        done();
      });
  });

  it(`should return status code 201 and 
  a message when user signed up successfully`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(seeder.setUserSignUpData(
        'Chidinma',
        'Dalacus',
        'chiddybabe@gmail.com',
        'chigodwin2',
        'chigodwin2',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.message)
          .to.deep.equal('Registration Successful');
        done();
      });
  });
});

describe('POST api/v1/auth/login', () => {
  it(`should return status code 400 and 
  a message when email is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(seeder.setUserLogInData(
        '',
        'chigodwin1',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message.email[0])
          .to.deep.equal('The email field is required.');
        done();
      });
  });

  it(`should return status code 400 and 
  a message when password is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(seeder.setUserLogInData(
        'princegoziem@gmail.com',
        '',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message.password[0])
          .to.deep.equal('The password field is required.');
        done();
      });
  });

  it(`should return status code 400 and 
  a message when a wrong email is provided`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(seeder.setUserLogInData(
        'chiddybabe001@gmail.com',
        'chigodwin2',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message)
          .to.deep.equal('Invalid login credentials');
        done();
      });
  });

  it(`should return status code 200 and 
  a message when credientials are valid`, (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send(seeder.setUserLogInData(
        'chiddybabe@gmail.com',
        'chigodwin2',
      ))
      .end((err, res) => {
        userToken = res.body.token;
        userId = jwtDecode(userToken).userID;
        expect(res.statusCode).to.equal(200);
        expect(res.body.message)
          .to.deep.equal('Logged in successfully.');
        done();
      });
  });
});

describe('POST api/v1/user', () => {
  it(`should return status code 200 and 
  a message for the validated user`, (done) => {
    chai.request(server)
      .get('/api/v1/user')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message)
          .to.deep.equal(`Get the user with ID ${userId}`);
        done();
      });
  });

  it(`should return status code 200 and 
  a message for the validated user`, (done) => {
    chai.request(server)
      .put('/api/v1/user/update')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message)
          .to.deep.equal(`Profile Successfully Updated`);
        done();
      });
  });
  it(`should return status code 200 and 
  a message for the validated user`, (done) => {
    chai.request(server)
      .put('/api/v1/user/update')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setUpdateProfileData(
        'I\'m a software developer',
        '30',
        '08039216673',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message)
          .to.deep.equal(`Profile Successfully Updated`);
        done();
      });
  });
  it(`should return status code 200 and 
  a message for the validated user`, (done) => {
    chai.request(server)
      .put('/api/v1/user/reminder')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setReminderData(
        true,
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message)
          .to.deep.equal(`Profile Successfully Updated`);
        done();
      });
  });
  it(`should return status code 200 and 
  a message when user deletes their profile image`, (done) => {
    chai.request(server)
      .put('/api/v1/user/removeprofileimage')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message)
          .to.deep.equal(`Profile image removed successfully!`);
        done();
      });
  });
});
