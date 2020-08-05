const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
chai.should();
chai.use(chaiHttp);

describe('Dummy Test', () => {
  it('Should pass no matter what', (done) => {
    chai
      .request(server)
      .get('/dummy')
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });
});
