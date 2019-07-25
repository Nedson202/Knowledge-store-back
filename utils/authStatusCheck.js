const authStatusCheck = (authStatus) => {
  if (!authStatus) {
    throw new Error('Permission denied, you need to signup/login');
  }
};

export default authStatusCheck;
