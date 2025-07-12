import { useState } from 'react'
import { CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Suggestion } from '@/types'
import { formatCurrency } from '@/lib/utils'

// Mock suggestions data
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'price_adjustment',
    title: 'Raise price from $3.98 → $4.28',
    description: 'Increase price by 7.5% to maintain target margin for Great Value Olive Oil',
    impact: 0.30,
    confidence: 0.85,
    action: 'price_adjustment',
    status: 'pending'
  },
  {
    id: '2',
    type: 'supplier_change',
    title: 'Use domestic supplier (save $0.40/unit)',
    description: 'Switch to US-based supplier to avoid tariff impact for olive oil',
    impact: 0.40,
    confidence: 0.92,
    action: 'supplier_change',
    status: 'pending'
  },
  {
    id: '3',
    type: 'promotion_adjustment',
    title: 'Remove current promotion',
    description: 'Current promotion is hurting margin by 2.1% for dairy products',
    impact: 0.08,
    confidence: 0.78,
    action: 'promotion_removal',
    status: 'pending'
  },
  {
    id: '4',
    type: 'price_adjustment',
    title: 'Increase price by $0.50',
    description: 'Adjust price for organic milk to cover increased COGS',
    impact: 0.50,
    confidence: 0.88,
    action: 'price_adjustment',
    status: 'approved'
  },
  {
    id: '5',
    type: 'bundle_suggestion',
    title: 'Bundle with complementary product',
    description: 'Bundle coffee beans with filters to increase overall margin',
    impact: 0.25,
    confidence: 0.75,
    action: 'bundle_creation',
    status: 'rejected'
  }
]

export default function ActionCenter() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const handleSuggestionAction = (suggestionId: string, action: 'approve' | 'reject') => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId 
        ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' }
        : s
    ))
  }

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'all') return true
    return suggestion.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price_adjustment':
        return <TrendingUp className="h-4 w-4" />
      case 'supplier_change':
        return <AlertTriangle className="h-4 w-4" />
      case 'promotion_adjustment':
        return <TrendingUp className="h-4 w-4" />
      case 'bundle_suggestion':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const totalImpact = suggestions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + s.impact, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Action Center</h1>
        <p className="text-muted-foreground">Review and approve AI suggestions to improve margins</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {suggestions.filter(s => s.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {suggestions.filter(s => s.status === 'approved').length}
            </div>
            <p className="text-sm text-gray-500">Actions taken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalImpact)}
            </div>
            <p className="text-sm text-gray-500">Per unit saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length * 100)}%
            </div>
            <p className="text-sm text-gray-500">Average AI confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({suggestions.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({suggestions.filter(s => s.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('approved')}
        >
          Approved ({suggestions.filter(s => s.status === 'approved').length})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('rejected')}
        >
          Rejected ({suggestions.filter(s => s.status === 'rejected').length})
        </Button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="bg-muted">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeIcon(suggestion.type)}
                    <h3 className="font-medium text-foreground">{suggestion.title}</h3>
                    {getStatusIcon(suggestion.status)}
                  </div>
                  <p className="text-sm text-foreground/80 mb-3">{suggestion.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-foreground/60">
                    <span>Impact: {formatCurrency(suggestion.impact)}/unit</span>
                    <span>Confidence: {Math.round(suggestion.confidence * 100)}%</span>
                    <span className="capitalize">{suggestion.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {suggestion.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSuggestionAction(suggestion.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuggestionAction(suggestion.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {suggestion.status === 'approved' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approved
                    </span>
                  )}
                  {suggestion.status === 'rejected' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuggestions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No suggestions found for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 