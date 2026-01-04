/**
 * Helper functions to check user permissions and limits
 */

export type PlanType = 'starter' | 'single' | 'pro'

export interface UserPlan {
  plan_id: PlanType
  status: 'active' | 'pending' | 'canceled'
}

/**
 * Check if a user can edit an ebook based on their plan and edits used
 * 
 * @param plan - User's plan type
 * @param editsUsed - Number of edits already used for this ebook
 * @returns boolean indicating if user can edit
 */
export function canEditEbook(plan: PlanType, editsUsed: number): boolean {
  // Pro plan: unlimited edits
  if (plan === 'pro') {
    return true
  }

  // Single plan: 1 ebook only, but can edit it (no limit specified, so allow)
  if (plan === 'single') {
    return true
  }

  // Starter (free) plan: max 5 edits per ebook
  if (plan === 'starter') {
    return editsUsed < 5
  }

  // Default: no access
  return false
}

/**
 * Get the maximum number of edits allowed for a plan
 */
export function getMaxEdits(plan: PlanType): number | null {
  switch (plan) {
    case 'pro':
      return null // Unlimited
    case 'single':
      return null // No specific limit for single plan
    case 'starter':
      return 5
    default:
      return 0
  }
}

/**
 * Get remaining edits for a user
 */
export function getRemainingEdits(plan: PlanType, editsUsed: number): number | null {
  const maxEdits = getMaxEdits(plan)
  if (maxEdits === null) {
    return null // Unlimited
  }
  return Math.max(0, maxEdits - editsUsed)
}













