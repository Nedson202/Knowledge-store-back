import models from '../models';
import utils from '../utils';

const { helper, validator } = utils;

class ReplyController {
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
      return error;
    }
  }

  static async deleteReply(data, authStatus) {
    const { replyId } = data;
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const deletedReply = await models.Reply.destroy(
        {
          returning: true,
          where: {
            id: replyId,
            userId: authStatus.id
          }
        }
      );
      if (!deletedReply) throw new Error('Reply not found');
      return deletedReply;
    } catch (error) {
      return error;
    }
  }

  static async getReview(reviewId) {
    try {
      return await models.Review.findById(reviewId);
    } catch (error) {
      return error;
    }
  }

  static async getReplies(reviewId) {
    const Users = models.User;
    try {
      const replies = await models.Reply.findAll({
        where: {
          reviewId
        },
        include: [{
          model: Users,
          as: 'replier',
          attributes: ['username', 'picture', 'avatarColor']
        }]
      });
      if (replies.length === 0) throw new Error('No reply found');
      return replies;
    } catch (error) {
      return error;
    }
  }

  static async returnReplies(reviewId) {
    try {
      const reviews = await ReplyController.getReplies(reviewId);
      return await ReplyController.flattenReplies(reviews);
    } catch (error) {
      return error;
    }
  }

  static async flattenReplies(replies) {
    try {
      const newReplies = replies.length && replies.map(reply => ({
        id: reply.id,
        reply: reply.reply,
        replier: reply.replier.username,
        picture: reply.replier.picture || '',
        avatarColor: reply.replier.avatarColor,
        likes: reply.likes,
        userId: reply.userId,
        reviewId: reply.userId,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      }));
      return newReplies || [];
    } catch (error) {
      return error;
    }
  }
}

export default ReplyController;
