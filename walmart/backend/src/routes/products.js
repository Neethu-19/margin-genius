const express = require('express');
const router = express.Router();

// Mock products data
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

// GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      region, 
      supplier,
      status,
      marginThreshold,
      showOnlyNegative,
      sortBy = 'margin',
      sortOrder = 'desc',
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

    if (supplier) {
      filteredProducts = filteredProducts.filter(p => 
        p.supplier.toLowerCase().includes(supplier.toLowerCase())
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    if (marginThreshold) {
      const threshold = parseFloat(marginThreshold);
      filteredProducts = filteredProducts.filter(p => p.margin <= threshold);
    }

    if (showOnlyNegative === 'true') {
      filteredProducts = filteredProducts.filter(p => p.margin < 0);
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

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
    console.error('Products fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// GET /api/products/:id - Get specific product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // In production, this would update the database
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    mockProducts[productIndex] = updatedProduct;

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

// GET /api/products/categories - Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(mockProducts.map(p => p.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/products/regions - Get unique regions
router.get('/regions', async (req, res) => {
  try {
    const regions = [...new Set(mockProducts.map(p => p.region))];
    
    res.json({
      success: true,
      data: regions
    });
  } catch (error) {
    console.error('Regions fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch regions'
    });
  }
});

// GET /api/products/suppliers - Get unique suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = [...new Set(mockProducts.map(p => p.supplier))];
    
    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error('Suppliers fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suppliers'
    });
  }
});

// GET /api/products/stats - Get product statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: mockProducts.length,
      active: mockProducts.filter(p => p.status === 'active').length,
      discontinued: mockProducts.filter(p => p.status === 'discontinued').length,
      negativeMargin: mockProducts.filter(p => p.margin < 0).length,
      lowMargin: mockProducts.filter(p => p.margin >= 0 && p.margin < 5).length,
      averageMargin: mockProducts.reduce((sum, p) => sum + p.margin, 0) / mockProducts.length,
      totalTariffImpact: mockProducts.reduce((sum, p) => sum + p.tariffImpact, 0),
      averageShrinkRate: mockProducts.reduce((sum, p) => sum + p.shrinkRate, 0) / mockProducts.length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Product stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product statistics'
    });
  }
});

module.exports = router; 