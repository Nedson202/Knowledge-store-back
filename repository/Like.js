import BaseRepository from '.';
import Utils from '../utils/helper';

class LikeRepository extends BaseRepository {
  constructor() {
    super('Likes');
  }

  async toggleLike(findQuery, userId) {
    try {
      let existingLike = await this.findOne(findQuery);
      if (existingLike) {
        let users = existingLike.users
          ? JSON.parse(existingLike.users) : [];

        if (users.includes(userId)) {
          users = users.filter(user => user !== userId);
          existingLike.likes -= 1;
        } else {
          existingLike.likes += 1;
          users.push(userId);
        }
        const updateObject = {
          likes: existingLike.likes,
          users: JSON.stringify(users),
        };
        await this.updateOne(findQuery, updateObject);

        return;
      }

      const dbFindKey = Object.keys(findQuery);
      const dbFindValue = Object.values(findQuery);

      const likeObject = {
        id: Utils.generateId(),
        [dbFindKey]: dbFindValue[0],
        likes: 1,
        users: JSON.stringify([userId])
      };
      existingLike = await this.create(likeObject);

      return existingLike;
    } catch (error) {
      return error;
    }
  }
}

export default LikeRepository;
