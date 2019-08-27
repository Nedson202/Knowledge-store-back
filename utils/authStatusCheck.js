import { AUTH_STATUS_PERMISSION } from '../settings/default';

/**
 *
 *
 * @param {*} authStatus
 */
const authStatusCheck = (authStatus) => {
  if (!authStatus) {
    throw new Error(AUTH_STATUS_PERMISSION);
  }
};

export default authStatusCheck;
