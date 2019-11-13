import express from 'express';
import passport from 'passport';

const router = express.Router();

const redirectUrl = process.env.NODE_ENV.match('production')
  ? process.env.PROD_SERVER : 'http://localhost:3000';

let mobileRedirectUrl;

const authRedirectCallback = (req, res) => {
  let buildRedirectURL = redirectUrl;
  const { token } = req.user;

  if (mobileRedirectUrl) {
    buildRedirectURL = mobileRedirectUrl;
  }

  return res.redirect(`${buildRedirectURL}?token=${token}`);
};

// auth with google
router.get('/google', (req, res, next) => {
  const { redirect_uri: customRedirectURL } = req.query;

  mobileRedirectUrl = customRedirectURL;

  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read',
      'email',
      'profile'
    ]
  })(req, res, next);
});

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login'
}), (req, res) => {
  let buildRedirectURL = redirectUrl;
  const { token } = req.user;

  console.log(mobileRedirectUrl, 'mobileRedirectUrl');
  if (mobileRedirectUrl) {
    buildRedirectURL = mobileRedirectUrl;
  }

  return res.redirect(`${buildRedirectURL}?token=${token}`);
});

// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

router.get('/facebook/redirect', passport.authenticate('facebook', {
  session: false,
  failureRedirect: '/login'
}), (req, res) => {
  authRedirectCallback(req, res);
});

router.get('/health', (req, res) => res.status(200).json({
  error: false,
  message: 'Health check completed, server is online'
}));

export default router;
