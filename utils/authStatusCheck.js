import { authStatusPermission } from './default';

/**
 *
 *
 * @param {*} authStatus
 */
const authStatusCheck = (authStatus) => {
  if (!authStatus) {
    throw new Error(authStatusPermission);
  }
};

export default authStatusCheck;
