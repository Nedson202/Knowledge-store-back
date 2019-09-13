import { stackLogger } from 'info-logger';
import utils from '../utils';
import { NO_REPLY, } from '../settings/default';
import authStatusCheck from '../utils/authStatusCheck';
import ReplyRepository from '../repository/Reply';
import ReviewRepository from '../repository/Review';
import LikeRepository from '../repository/Like';

const { helper, validator } = utils;

const replyRepository = new ReplyRepository();
const reviewRepository = new ReviewRepository();
const likeRepository = new LikeRepository();

class ReplyController {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReplyController
   */
  static async addReply(data, authStatus) {
    const newData = data;
    const errors = validator.validateAddReply({
      ...newData
    });
    try {
      authStatusCheck(authStatus);

      const review = await reviewRepository.findOne({
        id: newData.reviewId,
      });

      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }

      return review && await replyRepository.create(newData);
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReplyController
   */
  static async editReply(data, authStatus) {
    const newData = data;
    try {
      authStatusCheck(authStatus);
      const editedReply = await replyRepository.updateOne({
        id: newData.replyId,
        userId: authStatus.id
      }, {
        reply: newData.reply
      });

      if (!editedReply || !editedReply.id) throw new Error(NO_REPLY);
      return editedReply;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReplyController
   */
  static async toggleLikeOnReply(data, authStatus) {
    const {
      replyId,
    } = data;
    try {
      authStatusCheck(authStatus);

      await likeRepository.toggleLike({
        replyId
      }, authStatus.id);
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReplyController
   */
  static async deleteReply(data, authStatus) {
    const { replyId } = data;
    try {
      authStatusCheck(authStatus);

      const deletedReply = await replyRepository.deleteOne({
        id: replyId,
        userId: authStatus.id,
      });

      if (!deletedReply) throw new Error(NO_REPLY);
      return deletedReply;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} reviewId
   * @returns
   * @memberof ReplyController
   */
  static async getReplies(reviewId) {
    try {
      const replies = await replyRepository.getAll({
        reviewId,
      });

      if (replies.length === 0) throw new Error(NO_REPLY);
      return !replies.length ? [] : replies;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} reviewId
   * @returns
   * @memberof ReplyController
   */
  static async returnReplies(reviewId) {
    try {
      const replies = await ReplyController.getReplies(reviewId);
      return await ReplyController.flattenReplies(replies);
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} replies
   * @returns
   * @memberof ReplyController
   */
  static async flattenReplies(replies) {
    try {
      const newReplies = replies.length && replies.map(reply => ({
        id: reply.id,
        reply: reply.reply,
        replier: reply.username,
        picture: reply.picture || '',
        avatarColor: reply.avatarColor,
        likes: reply.likes,
        repliesLikedBy: reply.users,
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
