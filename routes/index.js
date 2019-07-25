import express from 'express';
import passport from 'passport';

const router = express.Router();

const redirectUrl = process.env.NODE_ENV.match('production')
  ? process.env.PROD_SERVER : 'http://localhost:3000';

// auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google',
  { session: false, failureRedirect: '/login' }),
(req, res) => {
  const { token } = req.user;
  return res.redirect(`${redirectUrl}/?token=${token}`);
});

// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

router.get('/facebook/redirect',
  passport.authenticate('facebook',
    { session: false, failureRedirect: '/login' }),
  (req, res) => {
    res.send(req.user);
  });

router.get('/healthChecker', (req, res) => res.status(200).json({
  error: false,
  message: 'Health check completed, server is online'
}));

export default router;
