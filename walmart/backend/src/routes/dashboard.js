const express = require('express');
const router = express.Router();

// Mock data - in production this would come from database
const mockKPIs = [
  {
    name: 'Average Gross Margin',
    value: 12.4,
    unit: '%',
    change: 0.8,
    trend: 'up',
    status: 'positive'
  },
  {
    name: 'At-Risk SKUs',
    value: 247,
    unit: 'items',
    change: -12,
    trend: 'down',
    status: 'positive'
  },
  {
    name: 'Tariff Impact',
    value: 2.1,
    unit: '%',
    change: 0.3,
    trend: 'up',
    status: 'warning'
  },
  {
    name: 'Shrink Loss',
    value: 1.8,
    unit: '%',
    change: -0.2,
    trend: 'down',
    status: 'positive'
  }
];

const mockProducts = [
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
    status: 'active'
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
    tariffImpact: 0.0,
    shrinkRate: 3.5,
    supplier: 'Local Dairy Co',
    lastUpdated: '2024-01-15T09:15:00Z',
    status: 'active'
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
    tariffImpact: 2.1,
    shrinkRate: 0.8,
    supplier: 'Global Coffee Inc',
    lastUpdated: '2024-01-15T11:45:00Z',
    status: 'active'
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
    tariffImpact: 0.0,
    shrinkRate: 12.5,
    supplier: 'Berry Farms LLC',
    lastUpdated: '2024-01-15T08:20:00Z',
    status: 'active'
  }
];

const mockTopIssues = mockProducts.filter(p => p.margin < 5);

const mockRecentAnalyses = [
  {
    productId: '1',
    analysis: 'Margin fell due to 12% increase in import duty from Italy',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    productId: '2',
    analysis: 'Dairy margins impacted by increased wholesale milk prices',
    timestamp: '2024-01-15T09:15:00Z'
  }
];

// GET /api/dashboard - Get comprehensive dashboard data
router.get('/', async (req, res) => {
  try {
    const dashboardData = {
      kpis: mockKPIs,
      products: mockProducts,
      topIssues: mockTopIssues,
      recentAnalyses: mockRecentAnalyses,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// GET /api/dashboard/kpis - Get KPI metrics
router.get('/kpis', async (req, res) => {
  try {
    res.json({
      success: true,
      data: mockKPIs
    });
  } catch (error) {
    console.error('KPI data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPI data'
    });
  }
});

// GET /api/dashboard/products - Get product data with filters
router.get('/products', async (req, res) => {
  try {
    const { 
      category, 
      region, 
      marginThreshold, 
      showOnlyNegative,
      limit = 50,
      offset = 0
    } = req.query;

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (region) {
      filteredProducts = filteredProducts.filter(p => 
        p.region.toLowerCase() === region.toLowerCase()
      );
    }

    if (marginThreshold) {
      const threshold = parseFloat(marginThreshold);
      filteredProducts = filteredProducts.filter(p => p.margin <= threshold);
    }

    if (showOnlyNegative === 'true') {
      filteredProducts = filteredProducts.filter(p => p.margin < 0);
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        total: filteredProducts.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Product data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product data'
    });
  }
});

// GET /api/dashboard/alerts - Get recent alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = [
      {
        id: '1',
        type: 'critical',
        message: 'Strawberries margin dropped to -6.5%',
        timestamp: '2024-01-15T08:20:00Z',
        productId: '4'
      },
      {
        id: '2',
        type: 'warning',
        message: 'Coffee beans tariff impact increased',
        timestamp: '2024-01-15T11:45:00Z',
        productId: '3'
      },
      {
        id: '3',
        type: 'info',
        message: 'Olive oil margin improved by 2.1%',
        timestamp: '2024-01-15T10:30:00Z',
        productId: '1'
      }
    ];

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts'
    });
  }
});

module.exports = router; 