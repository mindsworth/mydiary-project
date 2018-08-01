import chai, {
  expect,
} from 'chai';
import {
  describe,
  it,
} from 'mocha';
import chaiHttp from 'chai-http';
import jwtDecode from 'jwt-decode';
import server from '../server';

import entrySeeder from './seeder/entrySeeder';

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

describe('Test entry routes', () => {
  it('should list all entries', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .end((err, res) => {
        const {
          entries,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(entries.length).to.equal(2);
        return done();
      });
  });

  it('should list all entries', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .set({
        'x-access-token': 'badassing',
      })

      .end((err, res) => {
        const {
          entry,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(entry._id).to.equal(1);
        return done();
      });
  });

  it('should get a specific entry', (done) => {
    chai.request(app)
      .get('/api/v1/entries/3')
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal(`The entry with the ID 3 is not found.`);
        return done();
      });
  });
  
  it('should add a new entry', (done) => {
    chai.request(server)
      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
        3,
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Added new entry');
        return done();
      });
  });


  it(`should return status code 400 and 
  a message when title and description is not given`, (done) => {
    chai.request(server)

      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
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
        expect(message).to.equal('title,description fields are required');
        return done();
      });
  });


  it(`should return status code 400 and 
  a message when title is not given`, (done) => {
    chai.request(server)

      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
        3,
        '',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const { message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('title fields are required');
        return done();
      });
  });


  it(`should return status code 400 and 
  a message when description is not given`, (done) => {
    chai.request(server)

      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
        3,
        'Jenifa\'s Diary',
        '',
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
    chai.request(server)
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
    chai.request(server)
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
        expect(message).to.equal('description fields are required');
        return done();
      });
  });

  it('should modifiy a specific entry', (done) => {
    chai.request(server)
      .put('/api/v1/entries/1')
      .send(entrySeeder.setEditEntryData(
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const { fetchedEntry } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(fetchedEntry._id).to.equal(1);
        expect(fetchedEntry.title).to.equal('Jenifa\'s Diary');
        return done();
      });
  });


  it(`should return status code 404 and 
  a message when the entry is not found`, (done) => {
    chai.request(server)

      .put('/api/v1/entries/4')
      .send(entrySeeder.setEditEntryData(
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const { message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Entry to modify is not found.');
        return done();
      });
  });


  it(`should return status code 400 and 
  a message when the title is empty`, (done) => {
    chai.request(server)

      .put('/api/v1/entries/2')
      .send(entrySeeder.setEditEntryData(
        '',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const { message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(message.title[0]).to.equal('The title field is required.');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when the when the params is invalid.`, (done) => {
    chai.request(server)
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
    chai.request(server)
      .delete('/api/v1/entries/1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const { message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(202);
        expect(message).to.equal('Entry successfully deleted!');
        return done();
      });
  });

  it(`should return status code 400 and 
  a message when the title is empty`, (done) => {
    chai.request(server)

      .delete('/api/v1/entries/4')
      .end((err, res) => {
        const { message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Entry does not exist');
        return done();
      });
  });
});