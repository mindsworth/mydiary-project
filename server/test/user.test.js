import chai, {
  expect,
} from 'chai';
import {
  describe,
  it,
  before,
} from 'mocha';
import chaiHttp from 'chai-http';
// import jwtDecode from 'jwt-decode';
import "babel-polyfill";
import app from '../app';

import seeder from './seeder/seeder';

chai.use(chaiHttp);

before(seeder.emptyUserTable);
before(seeder.addUser);

describe('POST api/v1/users/signup', () => {
  it(`should return status code 400 and 
  a message when firstname is not given`, (done) => {
    chai.request(app)
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
    chai.request(app)
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
    chai.request(app)
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
    chai.request(app)
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
    chai.request(app)
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
    chai.request(app)
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
    chai.request(app)
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

describe('POST api/v1/users/login', () => {
  it(`should return status code 400 and 
  a message when email is not given`, (done) => {
    chai.request(app)
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
    chai.request(app)
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

  it(`should return status code 401 and 
  a message when is invalid credentials`, (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(seeder.setUserLogInData(
        'princegoziem@gmail.com',
        'chigodwin23',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.message)
          .to.deep.equal('Invalid login credentials');
        done();
      });
  });

  it(`should return status code 200 and 
  a message when email is not given`, (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(seeder.setUserLogInData(
        'chiddybabe@gmail.com',
        'chigodwin2',
      ))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message)
          .to.deep.equal('Logged in successfully.');
        done();
      });
  });
});