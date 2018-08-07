import chai, {
  expect,
} from 'chai';
import {
  describe,
  it,
} from 'mocha';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);

describe('', () => {
  it(`Should return status code 201 
  when user access /api/v1/createuserstable`, (done) => {
    chai.request(server)
      .post('/api/v1/createuserstable')
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.message).to.eql('USERS TABLE CREATED SUCCESSFULLY.');
        done();
      });
  });

  it(`Should return status code 201 
  when user access /api/v1/createentriestable`, (done) => {
    chai.request(server)
      .post('/api/v1/createentriestable')
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.message).to.eql('ENTRIES TABLE CREATED SUCCESSFULLY.');
        done();
      });
  });

  it(`Should return status code 201 
  when user access /api/v1/createcategoriestable`, (done) => {
    chai.request(server)
      .post('/api/v1/createcategoriestable')
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.message)
          .to
          .equal('CATEGORIES TABLE CREATED SUCCESSFULLY.');
        done();
      });
  });
});