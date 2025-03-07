import express, { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
  accessType: 'offline'
}));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://letter-app-client.vercel.app' }),
  (req: Request, res: Response) => {
    
    res.redirect('https://letter-app-client.vercel.app/dashboard');
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