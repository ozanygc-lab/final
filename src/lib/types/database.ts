export interface Ebook {
  id: string
  user_id: string
  title: string
  description: string | null
  slug: string
  status: 'draft' | 'published' | 'archived'
  price_cents: number
  currency: string
  cover_image_url: string | null
  total_sales: number
  total_revenue_cents: number
  generation_prompt: string | null
  ai_metadata: any | null
  edit_count: number
  created_at: string
  updated_at: string
  published_at?: string | null
}

export interface Chapter {
  id: string
  ebook_id: string
  title: string
  content: string
  position: number
  word_count: number | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_type: 'free' | 'basic' | 'pro' | 'business'
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

