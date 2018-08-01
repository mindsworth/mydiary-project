import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);

// Test for API home route and invalid routes
describe('GET: /api/v1', () => {
  it('Should return status code 404 when user accesses non-existent route',
    (done) => {
      chai.request(server)
        .get('/*')
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.eql({
            message: 'Request Not Found!',
          });
          done();
        });
    });

  it('Should return status code 200 when user access /api/v1', (done) => {
    chai.request(server)
      .get('/api/v1')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.eql({
          message: 'Welcome to myDiary app for everyone.',
        });
        done();
      });
  });
});