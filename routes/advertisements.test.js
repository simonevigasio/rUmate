const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');


describe('Advertisement', () => {

    let connection;
    
    beforeAll( async () => {
      jest.setTimeout(5000);
      jest.unmock('mongoose');
      connection = await  mongoose.connect(process.env.DATABASE_URL);
      console.log('Database connected');
    });
  
    afterAll( () => {
      mongoose.connection.close(true);
      console.log("Database connection closed");
    });
    
    // create a valid token
    //var token = jwt.sign(
    //  {email: 'John@mail.com'},
    //  process.env.SUPER_SECRET,
    //  {expiresIn: 86400}
    //);
  
    test('GET /advertisements all advertisement', () => {
      return request(app)
        .get('/advertisements')
        .expect(200);
    });
    /*
    test('POST /advertisements with Book not specified', () => {
      return request(app)
        .post('/api/v1/booklendings')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .send({ student: 'whatever' }) // sends a JSON post body
        .expect(400, { error: 'Book not specified' });
    });
    
    test('POST /advertisements Student does not exist', () => {
      return request(app)
        .post('/api/v1/booklendings')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .send({ student: '/api/v1/students/111', book: '/api/v1/books/0' }) // sends a JSON post body
        .expect(400, { error: 'Student does not exist' });
    });
    
    test('POST /advertisements Book does not exist', () => {
      return request(app)
        .get('/api/v1/students')
        .expect('Content-Type', /json/)
        .expect(200)
        .then( (res) => {
          return request(app)
            .post('/api/v1/booklendings')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .send({ student: res.body[0].self, book: '/api/v1/books/0' }) // sends a JSON post body
            .expect(400, { error: 'Book does not exist' });
        });
    });*/
  
  });