import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, DollarSign, Package, Users, Target, Lightbulb, Clipboard } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KPIMetric, Product, MarginAnalysis } from '@/types'
import { formatCurrency, formatPercentage, getMarginColor, getMarginBgColor } from '@/lib/utils'
import KPICard from '@/components/KPICard'
import ProductTable from '@/components/ProductTable'
import MarginAnalysisModal from '@/components/MarginAnalysisModal'
import DashboardCharts from '@/components/DashboardCharts'
import { saveAs } from 'file-saver'


// Mock data - in real app this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    sku: '44577',
    name: 'Great Value Olive Oil',
    category: 'Pantry',
    region: 'Northeast',
    price: 3.98,
    cogs: 3.45,
    margin: 13.3,
    marginDelta: -2.1,
    tariffImpact: 0.8,
    shrinkRate: 1.2,
    supplier: 'Mediterranean Imports',
    lastUpdated: '2024-01-15T10:30:00Z',
    status: 'active',
    trafficImpact: 2.5
  },
  {
    id: '2',
    sku: '89234',
    name: 'Organic Milk 1/2 Gallon',
    category: 'Dairy',
    region: 'Southeast',
    price: 4.29,
    cogs: 4.15,
    margin: 3.3,
    marginDelta: -1.8,
    tariffImpact: 0.5,
    shrinkRate: 3.5,
    supplier: 'Local Dairy Co',
    lastUpdated: '2024-01-15T09:15:00Z',
    status: 'active',
    trafficImpact: -1.2
  },
  {
    id: '3',
    sku: '15678',
    name: 'Premium Coffee Beans',
    category: 'Beverages',
    region: 'West',
    price: 12.99,
    cogs: 8.50,
    margin: 34.6,
    marginDelta: 1.2,
    tariffImpact: 1.2,
    shrinkRate: 0.8,
    supplier: 'Global Coffee Inc',
    lastUpdated: '2024-01-15T11:45:00Z',
    status: 'active',
    trafficImpact: 0.0
  },
  {
    id: '4',
    sku: '33456',
    name: 'Fresh Strawberries',
    category: 'Produce',
    region: 'Southwest',
    price: 3.99,
    cogs: 4.25,
    margin: -6.5,
    marginDelta: -8.2,
    tariffImpact: 0.3,
    shrinkRate: 12.5,
    supplier: 'Berry Farms LLC',
    lastUpdated: '2024-01-15T08:20:00Z',
    status: 'active',
    trafficImpact: -3.4
  },
  {
    id: '5',
    sku: '77890',
    name: 'Almond Butter',
    category: 'Pantry',
    region: 'West',
    price: 7.99,
    cogs: 6.50,
    margin: 18.6,
    marginDelta: 2.3,
    tariffImpact: 0.7,
    shrinkRate: 0.5,
    supplier: 'NutriGoods',
    lastUpdated: '2024-01-14T14:00:00Z',
    status: 'active',
    trafficImpact: 1.7
  },
  {
    id: '6',
    sku: '99012',
    name: 'Frozen Blueberries',
    category: 'Frozen',
    region: 'Northeast',
    price: 5.49,
    cogs: 5.10,
    margin: 7.1,
    marginDelta: -0.5,
    tariffImpact: 0.4,
    shrinkRate: 2.0,
    supplier: 'BerryBest',
    lastUpdated: '2024-01-13T16:30:00Z',
    status: 'active',
    trafficImpact: 0.9
  },
  {
    id: '7',
    sku: '22334',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    region: 'Southeast',
    price: 2.99,
    cogs: 3.10,
    margin: -3.7,
    marginDelta: -1.2,
    tariffImpact: 0.2,
    shrinkRate: 1.8,
    supplier: 'BakeHouse',
    lastUpdated: '2024-01-12T10:00:00Z',
    status: 'active',
    trafficImpact: -2.0
  },
  {
    id: '8',
    sku: '55678',
    name: 'Greek Yogurt',
    category: 'Dairy',
    region: 'West',
    price: 1.29,
    cogs: 1.10,
    margin: 14.7,
    marginDelta: 0.9,
    tariffImpact: 0.6,
    shrinkRate: 0.7,
    supplier: 'Yogurto',
    lastUpdated: '2024-01-11T09:45:00Z',
    status: 'active',
    trafficImpact: 2.2
  },
  {
    id: '9',
    sku: '66789',
    name: 'Orange Juice',
    category: 'Beverages',
    region: 'Southwest',
    price: 3.49,
    cogs: 3.20,
    margin: 8.3,
    marginDelta: -0.7,
    tariffImpact: 0.9,
    shrinkRate: 1.1,
    supplier: 'Citrus Valley',
    lastUpdated: '2024-01-10T13:20:00Z',
    status: 'active',
    trafficImpact: 0.0
  },
  {
    id: '10',
    sku: '88901',
    name: 'Chicken Breast',
    category: 'Meat',
    region: 'Northeast',
    price: 6.99,
    cogs: 7.50,
    margin: -7.3,
    marginDelta: -2.0,
    tariffImpact: 0.5,
    shrinkRate: 2.5,
    supplier: 'FarmFresh Poultry',
    lastUpdated: '2024-01-09T15:10:00Z',
    status: 'active',
    trafficImpact: -1.5
  }
];

// Calculate dynamic KPIs based on mockProducts
const avgGrossMargin = mockProducts.reduce((sum, p) => sum + p.margin, 0) / mockProducts.length;
const atRiskSKUs = mockProducts.filter(p => p.margin < 10).length;
const avgTariffImpact = mockProducts.reduce((sum, p) => sum + p.tariffImpact, 0) / mockProducts.length;
const avgShrinkLoss = mockProducts.reduce((sum, p) => sum + p.shrinkRate, 0) / mockProducts.length;

const mockKPIs: KPIMetric[] = [
  {
    name: 'Average Gross Margin',
    value: avgGrossMargin,
    unit: '%',
    change: 0.8, // You can make this dynamic if you have historical data
    trend: avgGrossMargin >= 0 ? 'up' : 'down',
    status: avgGrossMargin >= 10 ? 'positive' : avgGrossMargin >= 0 ? 'warning' : 'negative'
  },
  {
    name: 'At-Risk SKUs',
    value: atRiskSKUs,
    unit: 'items',
    change: -12, // You can make this dynamic if you have historical data
    trend: 'down',
    status: 'positive'
  },
  {
    name: 'Tariff Impact',
    value: avgTariffImpact,
    unit: '%',
    change: 0.3, // You can make this dynamic if you have historical data
    trend: avgTariffImpact >= 0 ? 'up' : 'down',
    status: avgTariffImpact > 1 ? 'warning' : 'positive'
  },
  {
    name: 'Shrink Loss',
    value: avgShrinkLoss,
    unit: '%',
    change: -0.2, // You can make this dynamic if you have historical data
    trend: avgShrinkLoss >= 0 ? 'up' : 'down',
    status: avgShrinkLoss > 2 ? 'warning' : 'positive'
  }
]

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  // New state for suggestion modal
  const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false)
  const [suggestionText, setSuggestionText] = useState('')
  const [isAISuggestionsModalOpen, setAISuggestionsModalOpen] = useState(false)
  const [isAtRiskFilter, setAtRiskFilter] = useState(false)
  const [recentAlerts, setRecentAlerts] = useState<{type: string; message: string; time: Date}[]>([])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsAnalysisModalOpen(true)
  }

  const handleCloseAnalysis = () => {
    setIsAnalysisModalOpen(false)
    setSelectedProduct(null)
  }

  // Handler for Execute Action button
  const handleExecuteAction = () => {
    const product = selectedProduct || mockProducts[0];
    setSuggestionText(
      `Subject: Collaborative Review: ${product.name} (SKU: ${product.sku})\n\nDear ${product.supplier} Team,\n\nWe are writing to you today to acknowledge and appreciate our strong, long-standing partnership. The ${product.name} (SKU ID: ${product.sku}) continues to be a key offering within our ${product.category} category, and we value the innovation and quality your brand consistently delivers to our customers.\n\nAs we continuously monitor the performance and long-term viability of our product portfolio, we've observed that the ${product.name} is currently facing margin pressure due to current market dynamics and overall landed costs. Our shared objective is to ensure this product maintains a robust position in the market and remains highly attractive to both Walmart and our customers.\n\nTo address this, we propose a collaborative review to identify opportunities for enhanced efficiencies and sustained value. We are keen to discuss areas such as exploring potential cost savings within the supply chain, optimizing packaging for reduced transit costs, and evaluating various volume-based incentives. Furthermore, we believe it's crucial to ensure that the product's costing remains market-competitive, allowing us to continue offering compelling value to our customers.\n\nWe are committed to the mutual success of this product and our partnership. We would appreciate the opportunity to schedule a meeting with your team in the coming weeks to delve deeper into these points and develop actionable strategies together. Please let us know your availability.\n\nSincerely,\n\nWalmart Strategic Sourcing Analyst`
    );
    setSuggestionModalOpen(true);
  };

  // Handler for product-specific AI Analysis
  const handleAIAnalysis = (product: Product) => {
    setSelectedProduct(product);
    let memo = '';
    if (product.margin >= 10) {
      memo = `Subject: Continued Success: ${product.name} (SKU: ${product.sku})\n\nDear ${product.supplier} Team,\n\nWe are pleased to report that the ${product.name} (SKU ID: ${product.sku}) continues to perform well within our ${product.category} category, maintaining a healthy margin of ${product.margin.toFixed(2)}%. We appreciate your ongoing partnership and the quality you bring to our assortment.\n\nTo ensure continued success, we encourage ongoing collaboration to identify further efficiencies and opportunities for growth. Please let us know if you have any new initiatives or suggestions.\n\nSincerely,\n\nWalmart Strategic Sourcing Analyst`;
    } else if (product.margin >= 0) {
      memo = `Subject: Margin Improvement Opportunity: ${product.name} (SKU: ${product.sku})\n\nDear ${product.supplier} Team,\n\nWe have observed that the ${product.name} (SKU ID: ${product.sku}) is currently maintaining a margin of ${product.margin.toFixed(2)}% within our ${product.category} category. While the product remains viable, there is an opportunity to improve its margin performance.\n\nWe propose a collaborative review to explore cost-saving measures, supply chain optimizations, or promotional strategies that could enhance profitability. Your insights and partnership are valued as we work towards mutual success.\n\nSincerely,\n\nWalmart Strategic Sourcing Analyst`;
    } else {
      memo = `Subject: Urgent Margin Review: ${product.name} (SKU: ${product.sku})\n\nDear ${product.supplier} Team,\n\nWe are concerned to report that the ${product.name} (SKU ID: ${product.sku}) is currently operating at a negative margin (${product.margin.toFixed(2)}%) in our ${product.category} category. This situation requires immediate attention to ensure the product's long-term viability.\n\nWe request a meeting to discuss urgent actions, such as cost reductions, pricing adjustments, or supply chain improvements, to restore the product to a healthy margin. Your prompt collaboration is appreciated.\n\nSincerely,\n\nWalmart Strategic Sourcing Analyst`;
    }
    setSuggestionText(memo);
    setSuggestionModalOpen(true);
  };

  // Copy to clipboard handler (use selectedProduct if available)
  const copyToClipboard = () => {
    const product = selectedProduct || mockProducts[0];
    navigator.clipboard.writeText(
      `Vendor Memo for: ${product.name} (SKU: ${product.sku})\n\n${suggestionText}`
    );
  };

  // Handler for Quick Actions
  const handleReviewAISuggestions = () => {
    setAISuggestionsModalOpen(true)
  }
  const handleViewAtRisk = () => {
    setAtRiskFilter(true)
    setFilteredProducts(mockProducts.filter(p => p.margin < 10))
  }
  const handleShowAll = () => {
    setAtRiskFilter(false)
    setFilteredProducts(mockProducts)
  }
  const handleExportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Region', 'Price', 'COGS', 'Margin', 'Margin Delta', 'Tariff Impact', 'Shrink Rate', 'Supplier', 'Traffic Impact']
    const rows = filteredProducts.map(p => [
      p.sku, p.name, p.category, p.region, p.price, p.cogs, p.margin, p.marginDelta, p.tariffImpact, p.shrinkRate, p.supplier, p.trafficImpact
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'margin_report.csv')
  }

  // Helper to get all AI suggestions for all products
  function getAllAISuggestions() {
    return mockProducts.map(product => {
      const suggestions = []
      if (product.margin < 0) suggestions.push('Review your costs and selling price. Consider negotiating with suppliers or adjusting prices to cover expenses.')
      if (product.shrinkRate > 1) suggestions.push('Check your storage and handling processes. Reducing product loss can help improve your profits.')
      if (product.tariffImpact > 0.5) suggestions.push('Look for local suppliers or alternative products to reduce import costs.')
      if (product.marginDelta < 0) suggestions.push('Compare your recent purchase costs and sales prices. If costs have gone up, talk to your supplier or adjust your pricing.')
      if (suggestions.length === 0) suggestions.push('Your product is performing well. Keep up the good work and look for new ways to grow your sales!')
      return { product, suggestions }
    })
  }

  // Generate dynamic alerts based on product data
  function generateAlerts() {
    const alerts: {type: string; message: string; time: Date}[] = []
    const now: Date = new Date()
    mockProducts.forEach((product, idx) => {
      // Margin drop alert
      if (product.margin < 0) {
        alerts.push({
          type: 'danger',
          message: `${product.name} margin dropped to ${product.margin.toFixed(1)}%`,
          time: new Date(now.getTime() - (2 + idx) * 60 * 60 * 1000), // staggered hours ago
        })
      }
      // Tariff impact increase alert
      if (product.tariffImpact > 1) {
        alerts.push({
          type: 'warning',
          message: `${product.name} tariff impact increased`,
          time: new Date(now.getTime() - (4 + idx) * 60 * 60 * 1000),
        })
      }
      // Margin improvement alert
      if (product.marginDelta > 1) {
        alerts.push({
          type: 'success',
          message: `${product.name} margin improved by ${product.marginDelta.toFixed(1)}%`,
          time: new Date(now.getTime() - (6 + idx) * 60 * 60 * 1000),
        })
      }
    })
    // Sort by most recent
    return alerts.sort((a, b) => b.time - a.time).slice(0, 5)
  }

  useEffect(() => {
    setRecentAlerts(generateAlerts())
    const interval = setInterval(() => {
      setRecentAlerts(generateAlerts())
    }, 60 * 60 * 1000) // every hour
    return () => clearInterval(interval)
  }, [])

  function timeAgo(date: Date) {
    const now: Date = new Date()
    const diffMs: number = now.getTime() - date.getTime()
    const diffHrs: number = Math.floor(diffMs / (60 * 60 * 1000))
    const diffMins: number = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000))
    if (diffHrs > 0) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    return 'just now'
  }

  return (
    <div className="space-y-6">
      {/* Opportunity Spotlight */}
      <div className="flex justify-center">
        {(() => {
          const product = selectedProduct || mockProducts[0];
          let actionTitle = 'Opportunity';
          let actionDesc = '';
          let actionButton = 'Take Action';
          // Example: customize action based on margin
          if (product.margin < 0) {
            actionTitle = 'Margin Recovery';
            actionDesc = `Urgent: ${product.name} is operating at a negative margin (${product.margin.toFixed(2)}%). Consider immediate cost or price adjustments.`;
            actionButton = 'Initiate Recovery Plan';
          } else if (product.margin < 10) {
            actionTitle = 'Margin Improvement';
            actionDesc = `Caution: ${product.name} margin is below target (${product.margin.toFixed(2)}%). Explore cost savings or promotional strategies.`;
            actionButton = 'Improve Margin';
          } else {
            actionTitle = 'Growth Opportunity';
            actionDesc = `Healthy margin for ${product.name} (${product.margin.toFixed(2)}%). Consider growth or upsell strategies.`;
            actionButton = 'Explore Growth';
          }
          return (
            <div className="bg-[#17223b] rounded-xl shadow-lg p-6 w-full max-w-md mb-2">
              <div className="flex items-center mb-2">
                <Lightbulb className="text-blue-400 mr-2" />
                <span className="text-lg font-semibold text-white">Opportunity Spotlight</span>
              </div>
              <div className="text-xs text-blue-200 mb-1 tracking-widest">{product.sku}</div>
              <div className="text-xl font-bold text-white mb-1">{product.name}</div>
              <div className="text-sm text-blue-100 mb-4">Current Margin: <span className="text-yellow-300 font-semibold">{product.margin.toFixed(2)}%</span></div>
              <div className="bg-[#1e2a47] rounded-lg p-3 mb-4">
                <div className="text-xs font-bold text-blue-300 mb-1">{actionTitle.toUpperCase()}</div>
                <div className="text-sm text-blue-100">{actionDesc}</div>
              </div>
              <button
                className="w-full bg-blue-400 hover:bg-blue-500 text-[#17223b] font-semibold py-2 rounded-lg transition"
                onClick={handleExecuteAction}
              >
                {actionButton}
              </button>
            </div>
          );
        })()}
      </div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Margin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and protect profit margins across all products</p>
      </div>

      {/* Charts */}
      <DashboardCharts />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.name} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Margins</CardTitle>
              <CardDescription>
                Real-time margin analysis across all SKUs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductTable 
                products={filteredProducts} 
                onProductClick={handleProductClick}
                onAIAnalysis={handleAIAnalysis}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={handleReviewAISuggestions}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Review AI Suggestions
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={handleViewAtRisk}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                View At-Risk Items
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={handleExportCSV}>
                <DollarSign className="mr-2 h-4 w-4" />
                Export Margin Report
              </Button>
              {isAtRiskFilter && (
                <Button className="w-full justify-start" variant="secondary" onClick={handleShowAll}>
                  Show All
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      alert.type === 'danger' ? 'bg-red-500/90' :
                      alert.type === 'warning' ? 'bg-yellow-400/90' :
                      'bg-green-400/90'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-foreground/70">{timeAgo(alert.time)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Margin Analysis Modal */}
      {selectedProduct && (
        <MarginAnalysisModal
          product={selectedProduct}
          isOpen={isAnalysisModalOpen}
          onClose={handleCloseAnalysis}
        />
      )}
      {/* Suggestion Modal */}
      {isSuggestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <div className="flex items-center mb-2">
              <Lightbulb className="text-blue-400 mr-2" />
              <h2 className="text-xl font-bold">Vendor Memo for: {selectedProduct?.name || mockProducts[0].name}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-2">AI-generated memo to initiate a discussion with your supplier.</p>
            <div className="mb-4 p-3 rounded bg-muted">
              <div className="text-xs text-muted-foreground mb-1">SKU: <span className="text-foreground font-semibold">{selectedProduct?.sku || mockProducts[0].sku}</span></div>
              <div className="text-xs text-muted-foreground mb-1">Current Margin: <span className="text-yellow-300 font-semibold">{selectedProduct?.margin.toFixed(2) || mockProducts[0].margin.toFixed(2)}%</span></div>
              <div className="text-xs text-muted-foreground mb-1">Shrink Rate: <span className="text-blue-300 font-semibold">{selectedProduct?.shrinkRate || mockProducts[0].shrinkRate}%</span></div>
              <div className="text-xs text-muted-foreground">Category: <span className="text-foreground font-semibold">{selectedProduct?.category || mockProducts[0].category}</span></div>
            </div>
            <div className="mb-6 max-h-[400px] overflow-y-auto">
              <pre className="whitespace-pre-line text-foreground bg-gray-900 rounded p-4">{suggestionText}</pre>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1 bg-blue-400 hover:bg-blue-500 text-[#17223b] font-semibold py-2 px-4 rounded-lg transition"
                onClick={copyToClipboard}
              >
                <Clipboard className="h-4 w-4" /> Copy
              </button>
              <button
                className="flex-1 bg-muted text-foreground font-semibold py-2 px-4 rounded-lg transition border border-gray-700"
                onClick={() => setSuggestionModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* AI Suggestions Modal */}
      {isAISuggestionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">All AI Suggestions</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {getAllAISuggestions().map(({ product, suggestions }) => (
                <div key={product.sku} className="border-b pb-3 mb-3">
                  <div className="font-semibold text-foreground">{product.name} <span className="text-xs text-muted-foreground">(SKU: {product.sku})</span></div>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-foreground/80">
                    {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={() => setAISuggestionsModalOpen(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
} 