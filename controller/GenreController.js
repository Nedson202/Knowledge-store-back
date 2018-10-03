import models from '../models';
import utils from '../utils';
import stackTracer from '../helper/stackTracer';

const { helper, validator } = utils;

class GenreController {
  static async addReply(data, authStatus) {
    const newData = data;
    const errors = validator.validateAddReply({
      ...newData
    });
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const review = await models.Review.find({
        where: {
          id: newData.reviewId
        }
      });
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      return review && await models.Reply.create(newData);
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async editReply(data, authStatus) {
    const newData = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const editedReply = await models.Reply.update(
        { reply: newData.reply },
        {
          returning: true,
          where: {
            id: newData.replyId,
            userId: authStatus.id
          }
        }
      );
      if (!editedReply) throw new Error('Reply not found');
      return editedReply;
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }

  static async getGenres() {
    try {
      return await models.Genre.findAll({
        order: [['genre', 'ASC']]
      });
    } catch (error) {
      stackTracer(error);
      return error;
    }
  }
}

export default GenreController;
