import { Request, Response, NextFunction } from 'express';
import { chatWithAI, improveContent } from '../services/ai.service';
import { AuthRequest } from '../middleware/auth';

export const chat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatWithAI(message, context);

    res.json({ response });
  } catch (error) {
    next(error);
  }
};

export const improve = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, instruction } = req.body;

    if (!content || !instruction) {
      return res.status(400).json({ error: 'Content and instruction are required' });
    }

    const improved = await improveContent(content, instruction);

    res.json({ improved });
  } catch (error) {
    next(error);
  }
};
