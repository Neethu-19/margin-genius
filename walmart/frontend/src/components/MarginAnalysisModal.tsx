import axios from 'axios'
import { useState } from 'react'
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Product, Suggestion, RootCause } from '@/types'
import { formatCurrency, formatPercentage, getMarginColor, getMarginBgColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface MarginAnalysisModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

// Mock AI analysis data
const mockAnalysis = {
  summary: "Margin fell due to 12% increase in import duty from Italy and higher shrink in refrigerated storage at 243 locations.",
  suggestions: [
    {
      id: '1',
      type: 'price_adjustment' as const,
      title: 'Raise price from $3.98 → $4.28',
      description: 'Increase price by 7.5% to maintain target margin',
      impact: 0.30,
      confidence: 0.85,
      action: 'price_adjustment',
      status: 'pending' as const
    },
    {
      id: '2',
      type: 'supplier_change' as const,
      title: 'Use domestic supplier (save $0.40/unit)',
      description: 'Switch to US-based supplier to avoid tariff impact',
      impact: 0.40,
      confidence: 0.92,
      action: 'supplier_change',
      status: 'pending' as const
    },
    {
      id: '3',
      type: 'promotion_adjustment' as const,
      title: 'Remove current promotion',
      description: 'Current promotion is hurting margin by 2.1%',
      impact: 0.08,
      confidence: 0.78,
      action: 'promotion_removal',
      status: 'pending' as const
    }
  ],
  rootCauses: [
    {
      factor: 'Import Tariffs',
      impact: 0.8,
      description: '12% increase in olive oil import duties from Italy',
      trend: 'increasing' as const
    },
    {
      factor: 'Shrink Rate',
      impact: 1.2,
      description: 'Higher than average shrink in refrigerated storage',
      trend: 'stable' as const
    },
    {
      factor: 'Supplier Costs',
      impact: 0.5,
      description: 'Supplier increased base cost by 3.2%',
      trend: 'increasing' as const
    }
  ]
}

export default function MarginAnalysisModal({ product, isOpen, onClose }: MarginAnalysisModalProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Dynamic AI analysis logic
  function getRootCauses(product: Product) {
    const causes = [];
    if (product.tariffImpact > 0.5) {
      causes.push({
        factor: 'Import Tariffs',
        impact: product.tariffImpact,
        description: `Increase in import duties affecting ${product.name}`,
        trend: product.tariffImpact > 1 ? 'increasing' : 'stable',
      });
    }
    if (product.shrinkRate > 1) {
      causes.push({
        factor: 'Shrink Rate',
        impact: product.shrinkRate,
        description: 'Higher than average shrink in storage',
        trend: product.shrinkRate > 2 ? 'increasing' : 'stable',
      });
    }
    if (product.marginDelta < 0) {
      causes.push({
        factor: 'Supplier Costs',
        impact: Math.abs(product.marginDelta),
        description: 'Supplier increased base cost',
        trend: 'increasing',
      });
    }
    return causes;
  }

  function getSummary(product: Product, causes: any[]) {
    if (product.marginDelta < 0 && causes.length > 0) {
      return `Margin fell due to ${causes.map(c => c.factor.toLowerCase()).join(' and ')}.`;
    } else if (product.marginDelta < 0) {
      return 'Margin is declining due to multiple factors.';
    } else if (product.marginDelta > 0) {
      return 'Margin is improving due to positive business factors.';
    } else {
      return 'Margin is stable.';
    }
  }

  // Dynamic AI suggestions for local vendors
  function getSuggestions(product: Product) {
    const suggestions = [];
    if (product.margin < 0) {
      suggestions.push('Review your costs and selling price. Consider negotiating with suppliers or adjusting prices to cover expenses.');
    }
    if (product.shrinkRate > 1) {
      suggestions.push('Check your storage and handling processes. Reducing product loss can help improve your profits.');
    }
    if (product.tariffImpact > 0.5) {
      suggestions.push('Look for local suppliers or alternative products to reduce import costs.');
    }
    if (product.marginDelta < 0) {
      suggestions.push('Compare your recent purchase costs and sales prices. If costs have gone up, talk to your supplier or adjust your pricing.');
    }
    if (suggestions.length === 0) {
      suggestions.push('Your product is performing well. Keep up the good work and look for new ways to grow your sales!');
    }
    return suggestions;
  }

  const rootCauses = getRootCauses(product);
  const summary = getSummary(product, rootCauses);
  const aiSuggestions = getSuggestions(product);

  const handleSuggestionAction = (suggestionId: string, action: 'approve' | 'reject') => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId 
        ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' }
        : s
    ))
  }

  const handleApplyChanges = async () => {
    setIsSaving(true)
    try {
      // Only send suggestions that are not pending (i.e., changed)
      const changed = suggestions.filter(s => s.status !== 'pending')
      for (const s of changed) {
        if (s.status === 'approved') {
          await axios.put(`/api/suggestions/${s.id}/approve`)
        } else if (s.status === 'rejected') {
          await axios.put(`/api/suggestions/${s.id}/reject`)
        }
      }
      setIsSaving(false)
      onClose()
      // Optionally: show a toast here
    } catch (err) {
      setIsSaving(false)
      // Optionally: show error toast here
      alert('Failed to save changes. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-card rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
              <p className="text-sm text-foreground/80">SKU: {product.sku} • {product.category}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground/80">Current Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "text-2xl font-bold",
                    getMarginColor(product.margin)
                  )}>
                    {formatPercentage(product.margin)}
                  </div>
                  <p className={cn(
                    "text-sm",
                    product.marginDelta >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {product.marginDelta >= 0 ? '+' : ''}{formatPercentage(product.marginDelta)} from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground/80">Price & COGS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>Price: {formatCurrency(product.price)}</div>
                    <div>COGS: {formatCurrency(product.cogs)}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground/80">Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div>Tariff Impact: {formatPercentage(product.tariffImpact)}</div>
                    <div>Shrink Rate: {formatPercentage(product.shrinkRate)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-4">{summary}</p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Root Causes:</h4>
                  {rootCauses.length > 0 ? rootCauses.map((cause, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{cause.factor}</div>
                        <div className="text-sm text-foreground/80">{cause.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-foreground">{formatPercentage(cause.impact)}</div>
                        <div className="text-sm text-foreground/60 capitalize">{cause.trend}</div>
                      </div>
                    </div>
                  )) : <div className="text-sm text-foreground/60">No significant root causes detected.</div>}
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  AI Suggestions
                </CardTitle>
                <CardDescription>Recommended actions to improve margin</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                  {aiSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Close
            </Button>
            <Button onClick={handleApplyChanges} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Apply Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 