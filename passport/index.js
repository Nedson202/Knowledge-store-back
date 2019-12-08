import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../controller/User';
import Utils from '../utils';

const saveUser = async (profile, done) => {
  const currentUser = await User.findUser({
    socialId: profile.id
  });

  if (currentUser && currentUser.username) {
    const payload = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      picture: currentUser.picture,
      isVerified: currentUser.isVerified,
    };

    const token = Utils.generateToken(payload);
    payload.token = token;

    return done(null, payload);
  }

  const newUser = {
    username: profile.displayName,
    email: profile.emails && profile.emails[0].value,
    password: process.env.FAKE_PASSWORD,
    socialId: profile.id,
    picture: profile.photos && profile.photos[0].value,
    isVerified: 'true',
    socialAuth: true,
  };

  User.addUser(newUser).then((user) => {
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
    callbackURL: process.env.GOOGLE_CALLBACKURL,
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
  }, (accessToken, refreshToken, profile, done) => {
    saveUser(profile, done);
  })
);
