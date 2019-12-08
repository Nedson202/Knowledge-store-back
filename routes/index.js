import express from 'express';
import passport from 'passport';
import SocialAuth from '../controller/SocialAuth';

const router = express.Router();
const socialAuth = new SocialAuth();

// auth with google
router.get('/google', socialAuth.googleAuth);

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login'
}), (req, res) => {
  socialAuth.authRedirectCallback(req, res);
});

// auth with facebook
router.get('/facebook', socialAuth.facebookAuth);

router.get('/facebook/redirect', passport.authenticate('facebook', {
  session: false,
  failureRedirect: '/login'
}), (req, res) => {
  socialAuth.authRedirectCallback(req, res);
});

router.get('/health', (req, res) => res.status(200).json({
  error: false,
  message: 'Health check completed, server is online'
}));

export default router;
