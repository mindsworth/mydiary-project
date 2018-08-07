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

before((done) => {
  chai.request(server)
    .post('/api/v1/auth/login')
    .send(seeder.setUserLogInData(
      'princegoziem@gmail.com',
      'chigodwin1',
    ))
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      if (err) return done(err);
      userToken = res.body.token;
      jwtDecode(userToken).id;
      done();
    });
});

describe('Test categories routes', () => {
  it('should add a new category', (done) => {
    chai.request(server)
      .post('/api/v1/categories')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setCategoryData(
        'Life style',
        3,
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Category created successufully!');
        return done();
      });
  });

  it(`should return status code 409 and 
  a message when title already exist.`, (done) => {
    chai.request(server)
      .post('/api/v1/categories')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setCategoryData(
        'Life style',
        3,
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(409);
        expect(message).to.equal('Category already exist!');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when color ID is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/categories')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setCategoryData(
        'Life style',
        '',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.colorId[0])
          .to
          .equal('The colorId field is required.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when Title is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/categories')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setCategoryData(
        '',
        3,
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.title[0])
          .to
          .equal('The title field is required.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when Title and colorId is not given`, (done) => {
    chai.request(server)
      .post('/api/v1/categories')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setCategoryData(
        '',
        3,
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.title[0])
          .to
          .equal('The title field is required.');
        return done();
      });
  });

  it('should get all categories', (done) => {
    chai.request(server)
      .get('/api/v1/categories')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Get all categories successful.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when the category is not found.`, (done) => {
    chai.request(server)
      .delete('/api/v1/categories/4')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('The category with the ID 4 is not found.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when the category params is not valid.`, (done) => {
    chai.request(server)
      .delete('/api/v1/categories/love')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message)
          .to
          .equal('love is not a valid entry ID.');
        return done();
      });
  });

  it('should delete a specific category', (done) => {
    chai.request(server)
      .delete('/api/v1/categories/1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(message)
          .to
          .equal('Category with related entry(ies) Successfully Deleted!');
        return done();
      });
  });
});