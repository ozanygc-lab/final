import { createServerClient } from '@/lib/supabase/server'

export type PlanType = 'free' | 'basic' | 'premium' | 'starter' | 'pro' | 'single'

export interface UserSubscription {
  plan: PlanType
  maxPdfEdits: number | null // null means unlimited
}

export interface UserPlanData {
  plan: PlanType
  pdf_edits_used?: number
}

/**
 * Get user's subscription plan from profiles table
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single()

    if (error || !data) {
      // User doesn't have a profile yet, return default free plan
      return {
        plan: 'free',
        maxPdfEdits: 0,
      }
    }

    const plan = (data.plan as PlanType) || 'free'

    // Return max PDF edits based on plan
    let maxPdfEdits: number | null
    switch (plan) {
      case 'free':
        maxPdfEdits = 0
        break
      case 'basic':
        maxPdfEdits = 5
        break
      case 'premium':
        maxPdfEdits = null // unlimited
        break
      default:
        maxPdfEdits = 0
    }

    return {
      plan,
      maxPdfEdits,
    }
  } catch (error) {
    console.error('Error in getUserSubscription:', error)
    // Return free plan on error
    return {
      plan: 'free',
      maxPdfEdits: 0,
    }
  }
}

/**
 * Get remaining PDF edits for a user
 */
export async function getRemainingPdfEdits(userId: string): Promise<number | null> {
  try {
    const supabase = await createServerClient()

    // Get user's subscription
    const subscription = await getUserSubscription(userId)

    // If unlimited (premium), return null
    if (subscription.maxPdfEdits === null) {
      return null
    }

    // Get current edit count for user's ebooks
    const { data: ebooks } = await supabase
      .from('ebooks')
      .select('edit_count')
      .eq('user_id', userId)

    const totalEdits = ebooks?.reduce((sum, ebook) => sum + (ebook.edit_count || 0), 0) || 0

    // Calculate remaining
    const remaining = Math.max(0, subscription.maxPdfEdits - totalEdits)

    return remaining
  } catch (error) {
    console.error('Error in getRemainingPdfEdits:', error)
    return 0
  }
}

/**
 * Get user's plan from subscriptions table
 */
export async function getUserPlan(userId: string): Promise<UserPlanData | null> {
  try {
    const supabase = await createServerClient()

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()

    if (!subscription) {
      return { plan: 'free' }
    }

    // Get edits used from ebooks
    const { data: ebooks } = await supabase
      .from('ebooks')
      .select('edits_used')
      .eq('user_id', userId)

    const pdf_edits_used = ebooks?.reduce((sum, ebook) => sum + (ebook.edits_used || 0), 0) || 0

    return {
      plan: (subscription.plan_id as PlanType) || 'free',
      pdf_edits_used,
    }
  } catch (error) {
    console.error('Error in getUserPlan:', error)
    return { plan: 'free' }
  }
}

/**
 * Check if user can generate PDF based on plan
 */
export function canGeneratePdf(plan: PlanType): boolean {
  return plan !== 'free' && plan !== 'starter'
}

/**
 * Check if user can edit PDF based on plan and edits used
 */
export function canEditPdf(plan: PlanType, editsUsed: number): boolean {
  if (plan === 'pro' || plan === 'premium') {
    return true // Unlimited
  }
  if (plan === 'basic') {
    return editsUsed < 5
  }
  return false
}

/**
 * Increment PDF edits count for user
 */
export async function incrementPdfEdits(userId: string): Promise<void> {
  try {
    const supabase = await createServerClient()

    // Get all user's ebooks and increment edits_used
    const { data: ebooks } = await supabase
      .from('ebooks')
      .select('id, edits_used')
      .eq('user_id', userId)

    if (ebooks && ebooks.length > 0) {
      // Increment edits_used for the first ebook (or distribute across all)
      const firstEbook = ebooks[0]
      await supabase
        .from('ebooks')
        .update({ edits_used: (firstEbook.edits_used || 0) + 1 })
        .eq('id', firstEbook.id)
    }
  } catch (error) {
    console.error('Error in incrementPdfEdits:', error)
  }
}
