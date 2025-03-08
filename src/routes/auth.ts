import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
  // accessType: 'offline',
  // prompt: 'consent',
} as any));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URI}` }),
  (req: Request, res: Response) => {   
    res.redirect(`${process.env.CLIENT_URI}/dashboard`);
  }
);

router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true, message: 'Logged out' });
  });
});

router.get('/user', (req: Request, res: Response) => {
  res.json(req.user || null);
});

export default router;