process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const Parcel = require('../models/ParcelModel');
const db = require('../Database');
const { response } = require('express');
chai.use(chaiHttp);
const expect = chai.expect;
chai.should();

// let testParcel = Parcel.create({
//   destination: 'Shomolu',
//   presentLocation: 'London',
//   status: 'over the sea',
// })
//   .then((testParcel) => console.log(testParcel.id))
//   .catch((err) => console.log(err));

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

describe('Parcel Routes', () => {
  before((done) => {
    Parcel.sync().then(() => {
      done();
    });
  });

  beforeEach((done) => {
    Parcel.destroy({
      truncate: true,
    }).then(() => {
      done();
    });
  });

  describe('Get all parcels', () => {
    it('Should return an array of all parcel', (done) => {
      chai
        .request(server)
        .get('/api/v1/parcels')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.property('parcels');
          response.body.should.have.property('status').eq('success');
          response.body.should.have.property('No_of_parcels');
          done();
        });
    });
  });

  describe('Create a parcel', () => {
    let testparcel1 = {
      presentLocation: 'London',
      status: 'over the sea',
    };
    it('Should NOT create a new parcel without the destination field', (done) => {
      chai
        .request(server)
        .post('/api/v1/parcels')
        .send(testparcel1)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('status').eq('fail');
          done();
        });
    });

    let testParcel2 = {
      destination: 'Shomolu',
      presentLocation: 'London',
      status: 'over the sea',
    };
    it('Should create a new parcel with the destination field present', (done) => {
      chai
        .request(server)
        .post('/api/v1/parcels')
        .send(testParcel2)
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('newParcel');
          response.body.newParcel.should.have.property('id');
          response.body.newParcel.should.have.property('destination');
          response.body.newParcel.should.have.property('presentLocation');
          response.body.newParcel.should.have.property('status');
          done();
        });
    });
  });

  describe('Get a single parcel', () => {
    it('Should return a parcel when the right ID is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
      }).then((parcel) => {
        chai
          .request(server)
          .get(`/api/v1/parcels/${parcel.id}`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('status').eq('success');
            done();
          });
      });
    });

    it('should not return the parcel', (done) => {
      const parcelID = '1';
      chai
        .request(server)
        .get(`/api/v1/parcels/${parcelID}`)
        .end((err, response) => {
          //console.log(response);
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('cancelling a parcel', () => {
    it('Should cancel a parcel when the right ID is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/cancel`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('status').eq('success');
            response.body.updatedParcel.should.have
              .property('status')
              .eq('cancelled');
            done();
          });
      });
    });

    it('Should not cancel the parcel when the wrong ID is given', (done) => {
      const parcelID = '1111-444a';
      chai
        .request(server)
        .get(`/api/v1/parcels/${parcelID}`)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have
            .property('msg')
            .eq('No Parcel found with that ID');
          done();
        });
    });
  });
});
