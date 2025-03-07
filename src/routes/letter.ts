import express, { Request, Response } from 'express';
import { Letter, ILetter } from '../models/Letter';
import { IUser } from '../models/User';
import { saveLetterToDrive, getLetterFromDrive } from '../services/googleDrive';

const router = express.Router();

const ensureAuthenticated = (req: Request, res: Response, next: () => void) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

router.post('/create', ensureAuthenticated, async (req: Request, res: Response) => {
  const { title, content } = req.body as { title: string; content: string };
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const letter = new Letter({
      userId: (req.user as IUser)._id,
      title,
      content
    });
    await letter.save();
    res.status(201).json(letter);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create letter' });
  }
});

router.put('/edit/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body as { title: string; content: string };
  try {
    const letter = await Letter.findOneAndUpdate(
      { _id: id, userId: (req.user as IUser)._id },
      { title, content, updatedAt: new Date() },
      { new: true }
    );
    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    res.json(letter);
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit letter' });
  }
});

router.get('/list', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const letters = await Letter.find({ userId: (req.user as IUser)._id });
    res.json(letters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

router.post('/save-to-drive/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const letter = await Letter.findOne({ _id: id, userId: (req.user as IUser)._id });
    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    const googleDriveId = await saveLetterToDrive(req.user as IUser, letter.title, letter.content);
    letter.googleDriveId = googleDriveId;
    await letter.save();
    res.json({ googleDriveId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save to Google Drive' });
  }
});

router.get('/drive/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const letter = await Letter.findOne({ _id: id, userId: (req.user as IUser)._id });
    if (!letter || !letter.googleDriveId) {
      return res.status(404).json({ error: 'Letter not found or not saved to Drive' });
    }
    const content = await getLetterFromDrive(req.user as IUser, letter.googleDriveId);
    res.json({ title: letter.title, content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Google Drive' });
  }
});

// New Route: Get a letter from Google Drive
router.get('/fetch-from-drive/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const letter = await Letter.findOne({ _id: id, userId: (req.user as IUser)._id });
    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    if (!letter.googleDriveId) {
      return res.status(400).json({ error: 'Letter has not been saved to Google Drive' });
    }
    const content = await getLetterFromDrive(req.user as IUser, letter.googleDriveId);
    res.json({
      title: letter.title,
      content,
      googleDriveId: letter.googleDriveId
    });
  } catch (err) {
    console.error('Fetch from Drive Error:', err);
    res.status(500).json({ error: 'Failed to fetch from Google Drive' });
  }
});

export default router;