import { authStatusPermission } from './default';

const authStatusCheck = (authStatus) => {
  if (!authStatus) {
    throw new Error(authStatusPermission);
  }
};

export default authStatusCheck;
