import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KPIMetric } from '@/types'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface KPICardProps {
  kpi: KPIMetric
}

export default function KPICard({ kpi }: KPICardProps) {
  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case '$':
        return formatCurrency(value)
      case '%':
        return formatPercentage(value)
      default:
        return formatNumber(value)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {kpi.name}
        </CardTitle>
        {getTrendIcon(kpi.trend)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(kpi.value, kpi.unit)}
        </div>
        <p className={cn(
          "text-xs flex items-center mt-1",
          kpi.change >= 0 ? "text-green-600" : "text-red-600"
        )}>
          {kpi.change >= 0 ? '+' : ''}{formatValue(kpi.change, kpi.unit)} from last week
        </p>
      </CardContent>
    </Card>
  )
} 