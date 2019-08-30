import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import UserController from '../controller/UserController';
import utils from '../utils';

const { checkUserExists } = UserController;

const saveUser = async (profile, done) => {
  const currentUser = await checkUserExists(profile.id);
  if (currentUser.username) {
    const payload = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      picture: currentUser.picture,
      isVerified: currentUser.isVerified,
    };
    const token = utils.helper.generateToken(payload);
    payload.token = token;
    return done(null, payload);
  }
  const newUser = {
    username: profile.displayName,
    email: profile.emails[0].value,
    password: process.env.FAKE_PASSWORD,
    socialId: profile.id,
    picture: profile.photos[0].value,
    isVerified: 'true',
    socialAuth: true,
  };
  UserController.addUser(newUser).then((user) => {
    done(null, user);
  });
};

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APPID,
  clientSecret: process.env.FACEBOOK_APPSECRET,
  callbackURL: process.env.FACEBOOK_CALLBACKURL,
  profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => {
  saveUser(profile, done);
}));

passport.use(
  new GoogleStrategy({
    // options for google strategy
    callbackURL: process.env.GOOGLE_CALLBACKURL,
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
  }, (accessToken, refreshToken, profile, done) => {
    saveUser(profile, done);
  })
);
