import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../app';

import entrySeeder from './seeder/entrySeeder';

chai.use(chaiHttp);

describe('Test entry routes', () => {
  it('should list all entries', (done) => {
    chai.request(app)
      .get('/api/v1/entries')
      .end((err, res) => {
        const { entries } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(entries.length).to.equal(2);
        return done();
      });
  });

  it('should get a specific entry', (done) => {
    chai.request(app)
      .get('/api/v1/entries/1')
      .end((err, res) => {
        const { entry } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(entry._id).to.equal(1);
        return done();
      });
  });

  it('should add a new entry', (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
        3,
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const { entries } = res.body;
        console.log(entries);
        if (err) return done(err);
        expect(res.statusCode).to.equal(201);
        expect(entries.length).to.equal(3);
        expect(entries[2].title).to.equal('Jenifa\'s Diary');
        console.log('COUNT:', entries.length);
        return done();
      });
  });

  it('should return status code 400 and a message when title'
    + ' is not given', (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
        3,
        '',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const { Message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(Message).to.equal('title Field should not be Empty');
        return done();
      });
  });

  it('should return status code 400 and a message when description'
    + ' is not given', (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
        3,
        'Jenifa\'s Diary',
        '',
      ))
      .end((err, res) => {
        const { Message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(Message).to.equal('description Field should not be Empty');
        return done();
      });
  });

  it('should return status code 400 and a message when title'
    + ' and description is not given', (done) => {
    chai.request(app)
      .post('/api/v1/entries')
      .send(entrySeeder.setEntryData(
        3,
        '',
        '',
      ))
      .end((err, res) => {
        const { Message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(400);
        expect(Message).to.equal('title Field should not be Empty');
        return done();
      });
  });

  it('should modifiy a specific entry', (done) => {
    chai.request(app)
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

  it('should return status code 404 and a message when the'
    + ' entry is not found', (done) => {
    chai.request(app)
      .put('/api/v1/entries/4')
      .send(entrySeeder.setEditEntryData(
        'Jenifa\'s Diary',
        'What if its you with someone else\'s future wife?',
      ))
      .end((err, res) => {
        const { message } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Entry to modify is not available.');
        return done();
      });
  });

  it('should delete a specific entry', (done) => {
    chai.request(app)
      .delete('/api/v1/entries/2')
      .end((err, res) => {
        const { RemainingEntries } = res.body;
        if (err) return done(err);
        expect(res.statusCode).to.equal(200);
        expect(RemainingEntries.length).to.equal(2);
        return done();
      });
  });
});