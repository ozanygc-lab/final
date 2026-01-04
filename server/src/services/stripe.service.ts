import Stripe from 'stripe';
import prisma from '../config/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export const createCheckoutSession = async (
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  let customerId = user.stripeCustomerId;

  // Create customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: user.id,
    },
  });

  return session;
};

export const createEbookPaymentLink = async (
  ebookId: string,
  amount: number,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Ebook Purchase',
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      ebookId,
    },
  });

  return session;
};

export const handleWebhook = async (
  body: Buffer,
  signature: string
): Promise<void> => {
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await updateSubscriptionStatus(subscription);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const handleSuccessfulPayment = async (session: Stripe.Checkout.Session): Promise<void> => {
  const { userId, ebookId } = session.metadata || {};

  // Record payment
  await prisma.payment.create({
    data: {
      stripePaymentId: session.payment_intent as string,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || 'eur',
      status: 'succeeded',
      customerId: session.customer as string,
      customerEmail: session.customer_email || '',
      metadata: session.metadata,
    },
  });

  // Update ebook sales if applicable
  if (ebookId) {
    await prisma.ebook.update({
      where: { id: ebookId },
      data: {
        sales: { increment: 1 },
        revenue: { increment: (session.amount_total || 0) / 100 },
      },
    });
  }
};

const updateSubscriptionStatus = async (subscription: Stripe.Subscription): Promise<void> => {
  const userId = subscription.metadata.userId;

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: subscription.status,
      },
    });
  }
};

export default stripe;
