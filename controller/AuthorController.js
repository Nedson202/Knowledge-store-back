import models from '../models';
import Utils from '../utils/helper';

class AuthorController {
  /**
   *
   *
   * @static
   * @param {*} author
   * @returns
   * @memberof AuthorController
   */
  static async addAuthor(author) {
    try {
      return await models.Author.create({
        id: Utils.generateId(),
        name: author.name,
        age: author.age
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default AuthorController;
