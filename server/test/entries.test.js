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
import "babel-polyfill";
import app from '../app';

import seeder from './seeder/seeder';

chai.use(chaiHttp);

before(seeder.emptyUserTable);
before(seeder.addUser);

let userToken;

before((done) => {
  chai.request(app)
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

describe('Test entry routes', () => {
  it('should list all entries', (done) => {
    chai.request(app)
      .get('/api/v1/entries')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          entries,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(entries.length).to.equal(0);
        return done();
      });
  });
  it('should list all entries', (done) => {
    chai.request(app)
      .get('/api/v1/entries')
      .set({
        'x-access-token': 'badassing',
      })
      .end((err, res) => {
        const {
          entries,
          message,
        } = res.body;
        console.log(entries);
        expect(res.statusCode).to.equal(401);
        expect(message).to.equal('Invalid authorization token');
        return done();
      });
  });

  it('should add a new entry', (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEntryData(
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
        3,
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('ENTRY CREATED SUCCESSFULLY.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when title and description is not given`, (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEntryData(
        3,
        '',
        '',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.description[0])
          .to.equal('The description field is required.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when title is not given`, (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEntryData(
        '',
        'What if its you with someone else\'s future wife?',
        3,
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.title[0]).to.equal('The title field is required.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when description is not given`, (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEntryData(
        'Jenifa\'s Diary',
        '',
        4,
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.description[0])
          .to
          .equal('The description field is required.');
        return done();
      });
  });

  it('should get a specific entry', (done) => {
    chai.request(app)
      .get('/api/v1/entries/1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Get the entry with ID 1');
        return done();
      });
  });

  it('should get a specific entry', (done) => {
    chai.request(app)
      .get('/api/v1/entries/2')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal(`The entry with the ID 2 is not found.`);
        return done();
      });
  });

  it('should modifiy a specific entry', (done) => {
    chai.request(app)
      .put('/api/v1/entries/1')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEditEntryData(
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Entry Successfully Updated');
        return done();
      });
  });

  it(`should return status code 404 and 
  a message when the entry is not found`, (done) => {
    chai.request(app)
      .put('/api/v1/entries/4')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEditEntryData(
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('The entry with the ID 4 is not found.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when the title is empty`, (done) => {
    chai.request(app)
      .put('/api/v1/entries/2')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEditEntryData(
        '',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.title[0]).to.equal('The title field is required.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when the when the params is invalid.`, (done) => {
    chai.request(app)
      .put('/api/v1/entries/a')
      .set({
        'x-access-token': userToken,
      })
      .send(seeder.setEditEntryData(
        'title',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('a is not a valid entry ID.');
        return done();
      });
  });

  it('should delete a specific entry', (done) => {
    chai.request(app)
      .delete('/api/v1/entries/1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Entry successfully deleted!');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when the title is empty`, (done) => {
    chai.request(app)
      .delete('/api/v1/entries/4')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Entry to DELETE is not found.');
        return done();
      });
  });
});