import { Request, Response, NextFunction } from 'express';
import { createCheckoutSession, createEbookPaymentLink, handleWebhook } from '../services/stripe.service';
import { AuthRequest } from '../middleware/auth';

export const createSubscription = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { priceId } = req.body;

    const successUrl = `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/pricing`;

    const session = await createCheckoutSession(
      userId,
      priceId,
      successUrl,
      cancelUrl
    );

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
};

export const createEbookCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ebookId, amount } = req.body;

    const successUrl = `${process.env.FRONTEND_URL}/success?ebook=${ebookId}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/ebook/${ebookId}`;

    const session = await createEbookPaymentLink(
      ebookId,
      amount,
      successUrl,
      cancelUrl
    );

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
};

export const webhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    await handleWebhook(req.body, signature);

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};
