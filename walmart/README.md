# MarginIQ - AI-Powered Margin Management System

**AI-powered internal pricing tool for Walmart teams to track, forecast, and protect profit margins in real time across categories, regions, and channels — with smart pricing suggestions and root cause analysis.**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd margin-iq
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Start the development servers**
```bash
npm run dev
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL (configured but using mock data for demo)
- **AI Integration**: OpenAI API ready
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express Validator

## 📊 Features

### 🎯 Core Functionality
- **Real-Time Margin Dashboard**: Monitor margin health across all SKUs
- **AI-Powered Analysis**: Get intelligent insights and root cause analysis
- **Smart Suggestions**: AI-generated recommendations for margin improvements
- **Natural Language Queries**: Chat with AI assistant about margin data
- **Action Center**: Review and approve AI suggestions
- **Comprehensive Filtering**: Filter by category, region, supplier, margin thresholds

### 📈 Key Metrics Tracked
- Average Gross Margin %
- At-Risk SKUs count
- Tariff Impact analysis
- Shrink Loss tracking
- Margin delta (week-over-week changes)
- Supplier cost changes

### 🤖 AI Capabilities
- **Margin Analysis**: Identify why margins are changing
- **Root Cause Analysis**: Understand factors affecting margins
- **Smart Suggestions**: Price adjustments, supplier changes, promotion optimization
- **Natural Language Processing**: Ask questions in plain English
- **Predictive Analytics**: Forecast margin trends

## 🎨 UI Components

### Dashboard
- KPI cards with trend indicators
- Sortable product table with margin status
- Quick action buttons
- Recent alerts panel

### Product Analysis
- Detailed margin drilldown modal
- AI-powered analysis summary
- Actionable suggestions with confidence scores
- Root cause breakdown

### Action Center
- Pending suggestions queue
- Approval/rejection workflow
- Impact tracking
- Historical actions

### AI Chat
- Natural language interface
- Quick question suggestions
- Contextual responses
- Conversation history

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/marginiq
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### Database Setup (Optional)

For production, set up PostgreSQL:

```sql
CREATE DATABASE marginiq;
CREATE USER marginiq_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marginiq TO marginiq_user;
```

## 📁 Project Structure

```
margin-iq/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript type definitions
│   │   ├── lib/             # Utility functions
│   │   └── hooks/           # Custom React hooks
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── models/          # Database models (future)
│   │   ├── services/        # Business logic (future)
│   │   └── index.js         # Server entry point
│   └── package.json
├── package.json             # Root package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
npm start
# Deploy with environment variables
```

## 🔌 API Endpoints

### Dashboard
- `GET /api/dashboard` - Get comprehensive dashboard data
- `GET /api/dashboard/kpis` - Get KPI metrics
- `GET /api/dashboard/products` - Get filtered product data
- `GET /api/dashboard/alerts` - Get recent alerts

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `GET /api/products/stats` - Get product statistics

### Analysis
- `GET /api/analysis/:productId` - Get product analysis
- `POST /api/analysis/generate` - Generate new analysis
- `GET /api/analysis/trends` - Get margin trends

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/suggestions` - Get suggested questions

### Suggestions
- `GET /api/suggestions` - Get all suggestions
- `PUT /api/suggestions/:id/approve` - Approve suggestion
- `PUT /api/suggestions/:id/reject` - Reject suggestion
- `POST /api/suggestions/generate` - Generate new suggestions

### KPIs
- `GET /api/kpis` - Get all KPIs
- `GET /api/kpis/trends` - Get KPI trends
- `POST /api/kpis/calculate` - Calculate KPIs from data

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Business Impact

**MarginIQ** addresses Walmart's critical business challenges:

- **Shrinking Margins**: Real-time monitoring and AI-powered suggestions
- **Tariff Volatility**: Automated impact analysis and mitigation strategies
- **Supply Chain Disruption**: Intelligent supplier recommendations
- **Manual Processes**: Automated analysis and decision support

**Potential Impact**: Could protect $250M+ annually by flagging and addressing margin issues across the supply chain.

## 🆘 Support

For support, email support@marginiq.com or create an issue in this repository.

---

**Built with ❤️ for Walmart's Sparkathon 2025** 
 