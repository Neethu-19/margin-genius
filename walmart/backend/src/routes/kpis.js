const express = require('express');
const router = express.Router();

// Mock KPI data
const mockKPIs = [
  {
    name: 'Average Gross Margin',
    value: 12.4,
    unit: '%',
    change: 0.8,
    trend: 'up',
    status: 'positive',
    target: 15.0,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    name: 'At-Risk SKUs',
    value: 247,
    unit: 'items',
    change: -12,
    trend: 'down',
    status: 'positive',
    target: 200,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    name: 'Tariff Impact',
    value: 2.1,
    unit: '%',
    change: 0.3,
    trend: 'up',
    status: 'warning',
    target: 1.5,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    name: 'Shrink Loss',
    value: 1.8,
    unit: '%',
    change: -0.2,
    trend: 'down',
    status: 'positive',
    target: 2.0,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    name: 'Total Revenue',
    value: 1250000,
    unit: '$',
    change: 45000,
    trend: 'up',
    status: 'positive',
    target: 1200000,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    name: 'Cost of Goods Sold',
    value: 1095000,
    unit: '$',
    change: 38000,
    trend: 'up',
    status: 'warning',
    target: 1050000,
    lastUpdated: '2024-01-15T10:30:00Z'
  }
];

// GET /api/kpis - Get all KPIs
router.get('/', async (req, res) => {
  try {
    const { category, timeframe = 'current' } = req.query;

    let filteredKPIs = [...mockKPIs];

    // Apply category filter if specified
    if (category) {
      // In production, this would filter by category
      filteredKPIs = filteredKPIs.filter(kpi => 
        kpi.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredKPIs
    });
  } catch (error) {
    console.error('KPIs fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPIs'
    });
  }
});

// GET /api/kpis/:name - Get specific KPI
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const kpi = mockKPIs.find(k => 
      k.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase()
    );

    if (!kpi) {
      return res.status(404).json({
        success: false,
        error: 'KPI not found'
      });
    }

    res.json({
      success: true,
      data: kpi
    });
  } catch (error) {
    console.error('KPI fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPI'
    });
  }
});

// GET /api/kpis/trends - Get KPI trends over time
router.get('/trends', async (req, res) => {
  try {
    const { timeframe = '30d', kpi } = req.query;

    // Mock trend data
    const trends = {
      'Average Gross Margin': [
        { date: '2024-01-01', value: 12.1 },
        { date: '2024-01-05', value: 12.2 },
        { date: '2024-01-10', value: 12.3 },
        { date: '2024-01-15', value: 12.4 }
      ],
      'At-Risk SKUs': [
        { date: '2024-01-01', value: 259 },
        { date: '2024-01-05', value: 255 },
        { date: '2024-01-10', value: 251 },
        { date: '2024-01-15', value: 247 }
      ],
      'Tariff Impact': [
        { date: '2024-01-01', value: 1.8 },
        { date: '2024-01-05', value: 1.9 },
        { date: '2024-01-10', value: 2.0 },
        { date: '2024-01-15', value: 2.1 }
      ]
    };

    const data = kpi ? trends[kpi] : trends;

    res.json({
      success: true,
      data: {
        timeframe,
        trends: data
      }
    });
  } catch (error) {
    console.error('KPI trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPI trends'
    });
  }
});

// GET /api/kpis/summary - Get KPI summary
router.get('/summary', async (req, res) => {
  try {
    const summary = {
      totalKPIs: mockKPIs.length,
      positiveTrends: mockKPIs.filter(k => k.trend === 'up').length,
      negativeTrends: mockKPIs.filter(k => k.trend === 'down').length,
      onTarget: mockKPIs.filter(k => {
        if (k.trend === 'up') {
          return k.value >= k.target;
        } else {
          return k.value <= k.target;
        }
      }).length,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('KPI summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch KPI summary'
    });
  }
});

// POST /api/kpis/calculate - Calculate KPIs from raw data
router.post('/calculate', async (req, res) => {
  try {
    const { products, timeframe } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        error: 'Products array is required'
      });
    }

    // Calculate KPIs from product data
    const calculatedKPIs = {
      'Average Gross Margin': {
        value: products.reduce((sum, p) => sum + p.margin, 0) / products.length,
        unit: '%',
        change: 0.5, // Mock change
        trend: 'up',
        status: 'positive'
      },
      'At-Risk SKUs': {
        value: products.filter(p => p.margin < 5).length,
        unit: 'items',
        change: -5, // Mock change
        trend: 'down',
        status: 'positive'
      },
      'Total Products': {
        value: products.length,
        unit: 'items',
        change: 0,
        trend: 'stable',
        status: 'neutral'
      }
    };

    res.json({
      success: true,
      data: calculatedKPIs
    });
  } catch (error) {
    console.error('KPI calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate KPIs'
    });
  }
});

// PUT /api/kpis/:name - Update KPI target
router.put('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { target } = req.body;

    const kpiIndex = mockKPIs.findIndex(k => 
      k.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase()
    );

    if (kpiIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'KPI not found'
      });
    }

    if (target === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Target value is required'
      });
    }

    // Update KPI target
    mockKPIs[kpiIndex].target = target;
    mockKPIs[kpiIndex].lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      data: mockKPIs[kpiIndex]
    });
  } catch (error) {
    console.error('KPI update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update KPI'
    });
  }
});

module.exports = router; 