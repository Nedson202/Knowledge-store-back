import request from 'supertest';
import app from '../../appSetup/middlewareHook';

describe('getGenres', () => {
  it('should retrieve all genres in the system', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `{
          getGenres {
            id
            genre
            createdAt
            updatedAt
          }
        }`
      });

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('getGenres');
  });
});
