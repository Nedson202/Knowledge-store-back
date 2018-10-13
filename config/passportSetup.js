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
      email: currentUser.email
    };
    const token = utils.helper.generateToken(payload);
    payload.token = token;
    done(null, payload);
  }

  const newUser = {
    username: profile.displayName,
    email: `${profile.name.familyName}@gmail.com`,
    password: '123eeR456',
    socialId: profile.id,
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
