import shortid from 'shortid';
import jwt from 'jsonwebtoken';

class Utils {
  static generateId() {
    return shortid.generate();
  }

  static generateToken(payload) {
    return jwt.sign(payload, process.env.SECRET);
  }

  static authenticate(token) {
    return jwt.verify(token, process.env.SECRET, (err, decoded) => {
      return decoded;
    });
  }
}

export default Utils;