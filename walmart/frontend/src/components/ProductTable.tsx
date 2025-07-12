import { useState } from 'react'
import { ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { formatCurrency, formatPercentage, getMarginColor, getMarginBgColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductTableProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onAIAnalysis?: (product: Product) => void
}

type SortField = 'name' | 'margin' | 'marginDelta' | 'tariffImpact' | 'shrinkRate'
type SortDirection = 'asc' | 'desc'

export default function ProductTable({ products, onProductClick, onAIAnalysis }: ProductTableProps) {
  const [sortField, setSortField] = useState<SortField>('margin')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-gray-600" />
      : <ChevronDown className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-card">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Region
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <button
                onClick={() => handleSort('margin')}
                className="flex items-center space-x-1 hover:text-gray-700"
              >
                <span>Margin %</span>
                {getSortIcon('margin')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Margin Health
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <button
                onClick={() => handleSort('marginDelta')}
                className="flex items-center space-x-1 hover:text-gray-700"
              >
                <span>Δ Margin</span>
                {getSortIcon('marginDelta')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <button
                onClick={() => handleSort('tariffImpact')}
                className="flex items-center space-x-1 hover:text-gray-700"
              >
                <span>Tariff Impact</span>
                {getSortIcon('tariffImpact')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <button
                onClick={() => handleSort('shrinkRate')}
                className="flex items-center space-x-1 hover:text-gray-700"
              >
                <span>Shrink %</span>
                {getSortIcon('shrinkRate')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
           
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {sortedProducts.map((product) => (
            <tr 
              key={product.id}
              className={cn(
                "hover:bg-muted cursor-pointer",
                getMarginBgColor(product.margin)
              )}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {product.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {product.region}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {formatCurrency(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={cn(
                  "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                  getMarginBgColor(product.margin),
                  getMarginColor(product.margin)
                )}>
                  {formatPercentage(product.margin)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {product.margin >= 10 ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">Healthy</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs">At Risk</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={cn(
                  product.marginDelta >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {product.marginDelta >= 0 ? '+' : ''}{formatPercentage(product.marginDelta)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {product.tariffImpact > 0 ? formatPercentage(product.tariffImpact) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {formatPercentage(product.shrinkRate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onProductClick(product)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {onAIAnalysis && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAIAnalysis(product);
                    }}
                  >
                    AI Analysis
                  </Button>
                )}
                {/* Dynamic action label */}
                {product.margin < 0 ? (
                  <span className="inline-flex items-center px-3 py-1 ml-2 rounded-full bg-red-100 text-red-800 font-semibold text-xs">Initiate Recovery</span>
                ) : product.margin < 10 ? (
                  <span className="inline-flex items-center px-3 py-1 ml-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">Improve Margin</span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 ml-2 rounded-full bg-green-100 text-green-800 font-semibold text-xs">Promote Growth</span>
                )}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 