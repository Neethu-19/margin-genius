export interface Product {
  id: string
  sku: string
  name: string
  category: string
  region: string
  store?: string
  price: number
  cogs: number
  margin: number
  marginDelta: number
  tariffImpact: number
  shrinkRate: number
  supplier: string
  lastUpdated: string
  status: 'active' | 'discontinued' | 'promotional'
  trafficImpact?: number
}

export interface MarginAnalysis {
  productId: string
  analysis: string
  suggestions: Suggestion[]
  rootCauses: RootCause[]
  timestamp: string
}

export interface Suggestion {
  id: string
  type: 'price_adjustment' | 'supplier_change' | 'promotion_adjustment' | 'bundle_suggestion'
  title: string
  description: string
  impact: number
  confidence: number
  action: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface RootCause {
  factor: string
  impact: number
  description: string
  trend: 'increasing' | 'decreasing' | 'stable'
}

export interface KPIMetric {
  name: string
  value: number
  unit: string
  change: number
  trend: 'up' | 'down' | 'stable'
  status: 'positive' | 'negative' | 'warning' | 'neutral'
}

export interface FilterOptions {
  categories: string[]
  regions: string[]
  stores: string[]
  suppliers: string[]
  dateRange: {
    start: string
    end: string
  }
  marginThreshold: number
  showOnlyNegative: boolean
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    queryType?: string
    products?: string[]
    suggestions?: Suggestion[]
  }
}

export interface DashboardData {
  kpis: KPIMetric[]
  products: Product[]
  topIssues: Product[]
  recentAnalyses: MarginAnalysis[]
  chatHistory: ChatMessage[]
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'analyst' | 'viewer'
  permissions: string[]
}

export interface Region {
  id: string
  name: string
  code: string
  stores: Store[]
}

export interface Store {
  id: string
  name: string
  region: string
  address: string
  performance: {
    margin: number
    sales: number
    shrink: number
  }
}

export interface Category {
  id: string
  name: string
  parentId?: string
  margin: number
  productCount: number
  trend: 'up' | 'down' | 'stable'
} 