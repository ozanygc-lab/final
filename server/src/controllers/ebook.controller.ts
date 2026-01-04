import { Request, Response, NextFunction } from 'express';
import { generateEbookContent } from '../services/ai.service';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createEbook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { topic, chapters, audience, tone, objective } = req.body;

    if (!topic || !chapters || !audience || !tone) {
      throw new AppError(400, 'Missing required fields');
    }

    // Generate content with AI
    const generatedContent = await generateEbookContent({
      topic,
      chapters,
      audience,
      tone,
      objective,
    });

    // Calculate word count
    const wordCount = generatedContent.chapters.reduce(
      (sum, ch) => sum + ch.wordCount,
      0
    );

    // Create slug
    const slug = generatedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Save to database
    const ebook = await prisma.ebook.create({
      data: {
        title: generatedContent.title,
        subtitle: generatedContent.subtitle,
        slug,
        topic,
        chapters,
        audience,
        tone,
        objective,
        content: generatedContent.chapters,
        wordCount,
        userId,
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'created',
        description: `Ebook créé : ${ebook.title}`,
        ebookId: ebook.id,
      },
    });

    res.status(201).json(ebook);
  } catch (error) {
    next(error);
  }
};

export const getAllEbooks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const ebooks = await prisma.ebook.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        status: true,
        views: true,
        sales: true,
        revenue: true,
        wordCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(ebooks);
  } catch (error) {
    next(error);
  }
};

export const getEbookById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const ebook = await prisma.ebook.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!ebook) {
      throw new AppError(404, 'Ebook not found');
    }

    res.json(ebook);
  } catch (error) {
    next(error);
  }
};

export const updateEbook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updates = req.body;

    // Check edit limits
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Reset monthly edits if needed
    const now = new Date();
    const lastReset = user.lastEditReset;
    const daysSinceReset = Math.floor(
      (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceReset >= 30) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          monthlyEdits: 0,
          lastEditReset: now,
        },
      });
    } else if (user.monthlyEdits >= user.maxMonthlyEdits) {
      throw new AppError(
        403,
        'Monthly edit limit reached. Upgrade your plan for more edits.'
      );
    }

    const ebook = await prisma.ebook.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    // Increment edit count
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyEdits: { increment: 1 },
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'updated',
        description: `Ebook mis à jour : ${ebook.title}`,
        ebookId: ebook.id,
      },
    });

    res.json(ebook);
  } catch (error) {
    next(error);
  }
};

export const deleteEbook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await prisma.ebook.deleteMany({
      where: {
        id,
        userId,
      },
    });

    res.json({ message: 'Ebook deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const publishEbook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const ebook = await prisma.ebook.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'published',
        description: `Ebook publié : ${ebook.title}`,
        ebookId: ebook.id,
      },
    });

    res.json(ebook);
  } catch (error) {
    next(error);
  }
};

export const getPublicEbook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const ebook = await prisma.ebook.findFirst({
      where: {
        slug,
        status: 'published',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ebook) {
      throw new AppError(404, 'Ebook not found');
    }

    // Increment views
    await prisma.ebook.update({
      where: { id: ebook.id },
      data: {
        views: { increment: 1 },
      },
    });

    res.json(ebook);
  } catch (error) {
    next(error);
  }
};
