# MarginIQ Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# Install all dependencies for frontend and backend
npm run install:all
```

### 2. Start Development Servers
```bash
# Start both frontend and backend simultaneously
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📋 What's Included

### Frontend Features ✅
- **Dashboard**: Real-time KPI monitoring with trend indicators
- **Product Table**: Sortable, filterable product margin data
- **Margin Analysis Modal**: Detailed AI-powered analysis for each product
- **Action Center**: Review and approve AI suggestions
- **AI Chat**: Natural language interface for margin queries
- **Settings**: User preferences and system configuration
- **Responsive Design**: Works on desktop, tablet, and mobile

### Backend Features ✅
- **RESTful API**: Complete CRUD operations for all entities
- **Mock Data**: Realistic Walmart product and margin data
- **AI Integration Ready**: OpenAI API endpoints configured
- **Security**: CORS, rate limiting, input validation
- **Error Handling**: Comprehensive error responses
- **Health Monitoring**: System status endpoints

### Data & Analytics ✅
- **4 Sample Products**: Olive oil, milk, coffee, strawberries
- **Realistic Margins**: Including negative margins and tariff impacts
- **AI Suggestions**: Price adjustments, supplier changes, promotions
- **KPI Tracking**: Average margin, at-risk SKUs, tariff impact, shrink
- **Trend Analysis**: Week-over-week margin changes

## 🎯 Key Features Demonstrated

### 1. **Real-Time Margin Monitoring**
- KPI cards showing current metrics with trend arrows
- Color-coded margin status (green=positive, red=negative, yellow=warning)
- Sortable product table with margin percentages

### 2. **AI-Powered Analysis**
- Click any product to see detailed margin analysis
- Root cause identification (tariffs, shrink, supplier costs)
- Actionable suggestions with confidence scores
- Impact calculations in dollars per unit

### 3. **Smart Suggestions Workflow**
- AI-generated recommendations in Action Center
- Approve/reject workflow with impact tracking
- Historical action tracking
- Bulk operations support

### 4. **Natural Language Interface**
- Chat with AI about margin data
- Quick question suggestions
- Contextual responses with data insights
- Conversation history

### 5. **Comprehensive Filtering**
- Filter by category, region, supplier
- Show only negative margins
- Sort by any column
- Pagination support

## 🔧 Customization Options

### Adding Real Data
1. Replace mock data in `backend/src/routes/*.js`
2. Connect to your database (PostgreSQL recommended)
3. Update API endpoints to use real data sources

### AI Integration
1. Add OpenAI API key to backend `.env`
2. Update chat and analysis routes to use real AI
3. Customize prompts for your specific use case

### Styling
1. Modify `frontend/src/index.css` for custom colors
2. Update `frontend/tailwind.config.js` for theme changes
3. Customize components in `frontend/src/components/`

## 🧪 Testing the Features

### Dashboard
1. Navigate to http://localhost:3000
2. View KPI cards and product table
3. Click on any product row to see detailed analysis

### Action Center
1. Go to http://localhost:3000/action-center
2. Review pending AI suggestions
3. Approve or reject suggestions
4. View impact statistics

### AI Chat
1. Visit http://localhost:3000/chat
2. Try asking: "Which products have negative margins?"
3. Use quick question buttons
4. View conversation history

### Settings
1. Navigate to http://localhost:3000/settings
2. Toggle notification preferences
3. Configure data sources
4. View system information

## 📊 Sample Data Included

### Products
- **Great Value Olive Oil**: 13.3% margin, tariff impact
- **Organic Milk**: 3.3% margin, high shrink rate
- **Premium Coffee Beans**: 34.6% margin, high tariff impact
- **Fresh Strawberries**: -6.5% margin, critical issue

### AI Suggestions
- Price adjustments with impact calculations
- Supplier change recommendations
- Promotion optimization suggestions
- Bundle creation ideas

### KPIs
- Average Gross Margin: 12.4%
- At-Risk SKUs: 247 items
- Tariff Impact: 2.1%
- Shrink Loss: 1.8%

## 🚀 Next Steps

### For Development
1. Add more realistic data
2. Implement real AI integration
3. Add user authentication
4. Connect to real databases

### For Production
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to cloud platforms
4. Set up monitoring and logging

### For Walmart Integration
1. Connect to Walmart's ERP systems
2. Integrate with pricing APIs
3. Add tariff data feeds
4. Implement real-time data sync

## 🆘 Troubleshooting

### Common Issues
- **Port conflicts**: Change ports in package.json scripts
- **CORS errors**: Check FRONTEND_URL in backend .env
- **Build errors**: Clear node_modules and reinstall
- **API errors**: Check backend server is running

### Getting Help
- Check the browser console for frontend errors
- Check terminal for backend error logs
- Review API responses in Network tab
- Verify all dependencies are installed

---

**MarginIQ is ready to run! 🎉**

Start with `npm run dev` and explore the features at http://localhost:3000 