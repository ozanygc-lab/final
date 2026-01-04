import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { sendMagicLink, sendWelcomeEmail } from '../services/email.service';
import { AppError } from '../middleware/errorHandler';

export const sendMagicLinkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
      await sendWelcomeEmail(email);
    }

    // Create magic link token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.magicLink.create({
      data: {
        token,
        email,
        userId: user.id,
        expiresAt,
      },
    });

    // Send email
    await sendMagicLink(email, token);

    res.json({
      message: 'Magic link sent to your email',
      isNewUser,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMagicLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError(400, 'Token is required');
    }

    // Find magic link
    const magicLink = await prisma.magicLink.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!magicLink) {
      throw new AppError(404, 'Invalid magic link');
    }

    if (magicLink.used) {
      throw new AppError(400, 'Magic link already used');
    }

    if (new Date() > magicLink.expiresAt) {
      throw new AppError(400, 'Magic link expired');
    }

    if (!magicLink.user) {
      throw new AppError(404, 'User not found');
    }

    // Mark as used
    await prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { used: true },
    });

    // Generate JWT
    const jwtToken = jwt.sign(
      {
        userId: magicLink.user.id,
        email: magicLink.user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token: jwtToken,
      user: {
        id: magicLink.user.id,
        email: magicLink.user.email,
        name: magicLink.user.name,
        subscriptionTier: magicLink.user.subscriptionTier,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        monthlyEdits: true,
        maxMonthlyEdits: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
