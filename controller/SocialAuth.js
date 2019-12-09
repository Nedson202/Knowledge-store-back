import passport from 'passport';

class SocialAuth {
  constructor() {
    this.mobileRedirectUrl = '';
  }

  getRedirectURL() {
    return process.env.NODE_ENV.match('production')
      ? process.env.PROD_SERVER : 'http://localhost:3000';
  }

  authRedirectCallback(req, res) {
    let buildRedirectURL = this.getRedirectURL();
    const { token } = req.user;

    if (this.mobileRedirectUrl) {
      buildRedirectURL = this.mobileRedirectUrl;
    }

    return res.redirect(`${buildRedirectURL}?token=${token}`);
  }

  googleAuth = (req, res, next) => {
    const { redirect_uri: customRedirectURL } = req.query;

    this.mobileRedirectUrl = customRedirectURL;

    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read',
        'email',
        'profile'
      ]
    })(req, res, next);
  }

  facebookAuth = (req, res, next) => {
    const { redirect_uri: customRedirectURL } = req.query;

    this.mobileRedirectUrl = customRedirectURL;

    passport.authenticate('facebook', {
      scope: 'email'
    })(req, res, next);
  }
}

export default SocialAuth;
