process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const Parcel = require('../models/ParcelModel');
const User = require('../models/UserModel');
const authController = require('../controllers/authController');
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
let testUser1;
let testUser1token;
let testAdmin;
let testAdmintoken;

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

describe('Auth Routes', () => {
  before((done) => {
    db.sync({ force: true }).then(() => {
      done();
    });
  });

  it('Should successfully register a user', (done) => {
    const testCredentials = {
      firstname: 'Eyitade',
      lastname: 'Ogunbiyi',
      username: 'tade',
      email: 'Ogunbiyiola@gmail.com',
      password: 'test1234',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        testUser1 = res.body.user;
        testUser1token = res.body.token;
        res.should.have.status(201);
        res.body.should.have.property('status').eq('success');
        res.body.should.have.property('token');
        res.body.should.have.property('user');
        res.body.user.should.have
          .property('userName')
          .eq(testCredentials.username);
        console.log(testUser1.firstName);
        console.log(typeof testUser1.id);
        console.log(testUser1token);
        done();
      });
  });
  it('Should successfully register an admin user', (done) => {
    const testCredentials = {
      firstname: 'Admin',
      lastname: 'Admin',
      username: 'Admin',
      email: 'Admin@gmail.com',
      password: 'test1234',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        testAdmin = res.body.user;
        testAdmintoken = res.body.token;
        res.should.have.status(201);
        console.log(testAdmin.firstName);
        console.log(testAdmin.role);
        User.update({ role: 'admin' }, { where: { id: testAdmin.id } });
        done();
      });
  });

  it('Should log in a user when valid credenetials are given', (done) => {
    const loginCredentials = {
      username: 'tade',
      password: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send(loginCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(200);
        res.body.should.have.property('status').eq('success');
        done();
      });
  });

  it('Should  Not log in a user when incorrect username is given', (done) => {
    const loginCredentials = {
      username: 'test',
      password: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send(loginCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(404);
        res.body.should.have.property('status').eq('fail');
        res.body.should.have
          .property('message')
          .eq('No user found with that username');
        done();
      });
  });

  it('Should  Not log in a user when incorrect password is given', (done) => {
    const loginCredentials = {
      username: 'tade',
      password: 'test123456666',
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send(loginCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(403);
        res.body.should.have.property('status').eq('fail');
        res.body.should.have
          .property('message')
          .eq('Incorrect username or password');
        done();
      });
  });

  it('Should  Not log in a user when credentials arent provided', (done) => {
    const loginCredentials = {};
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send(loginCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        res.body.should.have
          .property('message')
          .eq('Please enter your username or password');
        done();
      });
  });

  it('Should NOT register a user where firstName is absent', (done) => {
    const testCredentials = {
      lastname: 'Eyimofe',
      email: 'Ogunbiyiola1@gmail.com',
      username: 'testing',
      password: 'test1234',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });

  it('Should NOT register a user where lastname is absent', (done) => {
    const testCredentials = {
      firstname: 'Eyimofe',
      username: 'hello',
      email: 'Ogunbiyiola1@gmail.com',
      password: 'test1234',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });

  it('Should NOT register a user where username is absent', (done) => {
    const testCredentials = {
      firstname: 'Eyimofe',
      lastname: 'Eyimofe',
      email: 'Ogunbiyiola1@gmail.com',
      password: 'test1234',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });

  it('Should NOT register a user where email is absent', (done) => {
    const testCredentials = {
      firstname: 'Eyimofe',
      lastname: 'Eyimofe',
      username: 'tade1',
      password: 'test1234',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });

  it('Should NOT register a user where email is invalid', (done) => {
    const testCredentials = {
      firstname: 'Eyimofe',
      lastname: 'Eyimofe',
      username: 'tade1',
      email: 'Ogunbiyiola1',
      password: 'test1234',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });

  it('Should NOT register a user where passwords do not match', (done) => {
    const testCredentials = {
      firstname: 'Eyimofe',
      lastname: 'Eyimofe',
      username: 'tade1',
      email: 'Ogunbiyiola1',
      password: 'test123',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });

  it('Should NOT register a user where username matches one in the DB', (done) => {
    const testCredentials = {
      firstname: 'Eyimofe',
      lastname: 'Eyimofe',
      username: 'tade',
      email: 'Ogunbiyioladapo@yahoo.com',
      password: 'test123',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });

  it('Should NOT register a user where email matches one in the DB', (done) => {
    const testCredentials = {
      firstname: 'Eyimofe',
      lastname: 'Eyimofe',
      username: 'tade',
      email: 'Ogunbiyiola@gmail.com',
      password: 'test123',
      passwordConfirm: 'test1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(testCredentials)
      .then((res) => {
        //console.log(res);
        res.should.have.status(400);
        res.body.should.have.property('status').eq('fail');
        done();
      })
      .catch((err) => {});
  });
});

describe('Parcel Routes', () => {
  // before((done) => {
  //   db.sync({ force: true }).then(() => {
  //     done();
  //   });
  // });

  // before((done) => {
  //   Parcel.destroy({
  //     truncate: true,
  //   }).then(() => {
  //     done();
  //   });
  // });

  // before((done) => {
  //   User.destroy({
  //     truncate: true,
  //   }).then(() => {
  //     done();
  //   });
  // });

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
        .set('Authorization', `Bearer ${testUser1token}`)
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
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          //console.log(response);
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
          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('status').eq('success');
            done();
          });
      });
    });

    it('should not return the parcel when a wrong ID is given', (done) => {
      const parcelID = 'ac6e7e73-0ade-430f-9b07-c370653f364b';
      chai
        .request(server)
        .get(`/api/v1/parcels/${parcelID}`)
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          //console.log(response);
          response.should.have.status(404);
          response.body.should.have.property('status').eq('fail');
          done();
        });
    });

    it('should not return the parcel when an invalid ID is given', (done) => {
      const parcelID = '1';
      chai
        .request(server)
        .get(`/api/v1/parcels/${parcelID}`)
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          //console.log(response);
          response.should.have.status(400);
          response.body.should.have.property('status').eq('fail');
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
        userId: testUser1.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/cancel`)
          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('status').eq('success');
            response.body.parcel.should.have.property('status').eq('cancelled');
            done();
          });
      });
    });

    it('Should not cancel the parcel when an invalid ID is given', (done) => {
      const parcelID = '1111-444a';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/cancel`)
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not cancel the parcel when an wrong ID is given', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      //b81ae776-f906-47a8-a144-55044c509237
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/cancel`)
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not cancel the parcel when a user is not logged in ', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/cancel`)
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.have.property('message');
          done();
        });
    });
    it('Should not cancel the parcel when user logged in is not the user who created the parcel ', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testAdmin.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/cancel`)
          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(401);
            response.body.should.have
              .property('message')
              .eq(
                'Parcels can only be cancelled by thier makers, Please log in as the parcel owner to cancel this parcel '
              );
            done();
          });
      });
    });
  });

  /**
   * Test parcel destination change routes
   */

  describe('Change parcel destination', () => {
    it('Should change a parcels destination when the right ID is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testUser1.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/destination`)
          .send({ destination: 'testing' })
          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('status').eq('success');
            response.body.parcel.should.have
              .property('destination')
              .eq('testing');
            done();
          });
      });
    });

    it('Should NOT change a parcels destination when no new destination is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testUser1.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/destination`)

          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(400);
            response.body.should.have.property('status').eq('fail');
            done();
          });
      });
    });

    it('Should not change destination when an invalid ID is given', (done) => {
      const parcelID = '1111-444a';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/destination`)
        .send({ destination: 'testing' })
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel destination when an wrong ID is given', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      //b81ae776-f906-47a8-a144-55044c509237
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/destination`)
        .send({ destination: 'testing' })
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel destination when a user is not logged in ', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/destination`)
        .send({ destination: 'testing' })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel destination when user logged in is not the user who created the parcel ', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testAdmin.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/destination`)
          .send({ destination: 'testing' })
          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(401);
            response.body.should.have
              .property('message')
              .eq(
                'Parcel destinations can only be changed by thier makers, Please log in as the parcel owner to change this parcels destination '
              );
            done();
          });
      });
    });
  });

  /**
   * Test parcel status change routes
   */

  describe('Change parcel status', () => {
    it('Should change a parcels startus when the right ID is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testUser1.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/status`)
          .send({ status: 'testing' })
          .set('Authorization', `Bearer ${testAdmintoken}`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('status').eq('success');
            response.body.updatedParcel.should.have
              .property('status')
              .eq('testing');
            done();
          });
      });
    });

    it('Should NOT change a parcels destination when no new status is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testUser1.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/status`)
          .set('Authorization', `Bearer ${testAdmintoken}`)
          .end((err, response) => {
            response.should.have.status(400);
            response.body.should.have.property('status').eq('fail');
            done();
          });
      });
    });

    it('Should not change destination when an invalid ID is given', (done) => {
      const parcelID = '1111-444a';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/status`)
        .send({ status: 'testing' })
        .set('Authorization', `Bearer ${testAdmintoken}`)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel destination when an wrong ID is given', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      //b81ae776-f906-47a8-a144-55044c509237
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/status`)
        .send({ status: 'testing' })
        .set('Authorization', `Bearer ${testAdmintoken}`)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel destination when a user is not logged in ', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/status`)
        .send({ status: 'testing' })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel destination when user accessing is not and admin ', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testAdmin.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/status`)
          .send({ status: 'testing' })
          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(403);
            response.body.should.have
              .property('message')
              .eq('You do not have the authorization to perform this action');
            done();
          });
      });
    });
  });

  /**
   * Test parcel presentLocation change routes
   */

  describe('Change parcel presentLocation', () => {
    it('Should change a parcels presentLocation when the right ID is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testUser1.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/presentLocation`)
          .send({ newLocation: 'testing' })
          .set('Authorization', `Bearer ${testAdmintoken}`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('status').eq('success');
            response.body.updatedParcel.should.have
              .property('presentLocation')
              .eq('testing');
            done();
          });
      });
    });

    it('Should NOT change a parcels presentLocation when no new location is given', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testUser1.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/presentLocation`)
          .set('Authorization', `Bearer ${testAdmintoken}`)
          .end((err, response) => {
            response.should.have.status(400);
            response.body.should.have.property('status').eq('fail');
            done();
          });
      });
    });

    it('Should not change presentLocation when an invalid ID is given', (done) => {
      const parcelID = '1111-444a';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/presentLocation`)
        .send({ newLocation: 'testing' })
        .set('Authorization', `Bearer ${testAdmintoken}`)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel present Location when an wrong ID is given', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      //b81ae776-f906-47a8-a144-55044c509237
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/presentLocation`)
        .send({ newLocation: 'testing' })
        .set('Authorization', `Bearer ${testAdmintoken}`)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel presentLocation when a user is not logged in ', (done) => {
      const parcelID = 'b81ae776-f906-47a8-a144-55044c509237';
      chai
        .request(server)
        .put(`/api/v1/parcels/${parcelID}/presentLocation`)
        .send({ newLocation: 'testing' })
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.have.property('message');
          done();
        });
    });

    it('Should not change the parcel presentLocation when user accessing is not an admin ', (done) => {
      let parcel = Parcel.create({
        destination: 'Shomolu',
        presentLocation: 'London',
        status: 'over the sea',
        userId: testAdmin.id,
      }).then((parcel) => {
        chai
          .request(server)
          .put(`/api/v1/parcels/${parcel.id}/presentLocation`)
          .send({ newLocation: 'testing' })
          .set('Authorization', `Bearer ${testUser1token}`)
          .end((err, response) => {
            response.should.have.status(403);
            response.body.should.have
              .property('message')
              .eq('You do not have the authorization to perform this action');
            done();
          });
      });
    });
  });

  describe('Should get all parcels belonging to a user', () => {
    it('Should return all parcels belonging a user', (done) => {
      chai
        .request(server)
        .get(`/api/v1/users/${testUser1.id}/parcels`)
        .set('Authorization', `Bearer ${testUser1token}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have.property('status').eq('success');
          response.body.should.have.property('no_of_parcels');
          response.body.should.have.property('parcelOwner');
          response.body.should.have.property('userParcels');
          done();
        });
    });
  });
});
