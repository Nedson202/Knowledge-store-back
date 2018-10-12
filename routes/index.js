import express from 'express';
import passport from 'passport';

const router = express.Router();

// auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/fail' }),
    (req, res) => {
      res.send(req.user);
    }
)

// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

router.get('/facebook/redirect',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
    (req, res) => {
      res.send(req.user);
    }
);

export default router;