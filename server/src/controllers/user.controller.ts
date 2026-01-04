import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    // Get ebooks count
    const totalEbooks = await prisma.ebook.count({
      where: { userId },
    });

    // Get total views
    const viewsResult = await prisma.ebook.aggregate({
      where: { userId },
      _sum: { views: true },
    });
    const totalViews = viewsResult._sum.views || 0;

    // Get total sales
    const salesResult = await prisma.ebook.aggregate({
      where: { userId },
      _sum: { sales: true },
    });
    const totalReaders = salesResult._sum.sales || 0;

    // Get total revenue
    const revenueResult = await prisma.ebook.aggregate({
      where: { userId },
      _sum: { revenue: true },
    });
    const totalRevenue = revenueResult._sum.revenue || 0;

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      where: {
        ebook: {
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        ebook: {
          select: {
            title: true,
          },
        },
      },
    });

    res.json({
      totalEbooks,
      totalViews,
      totalReaders,
      totalRevenue,
      recentActivities,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { name } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
