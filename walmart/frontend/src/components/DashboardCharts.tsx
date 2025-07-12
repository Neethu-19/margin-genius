import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const marginTrendData = [
  { month: 'Jan', margin: 13.2 },
  { month: 'Feb', margin: 12.8 },
  { month: 'Mar', margin: 12.5 },
  { month: 'Apr', margin: 12.1 },
  { month: 'May', margin: 11.9 },
  { month: 'Jun', margin: 12.0 },
  { month: 'Jul', margin: 12.4 },
  { month: 'Aug', margin: 12.7 },
  { month: 'Sep', margin: 12.9 },
  { month: 'Oct', margin: 13.1 },
  { month: 'Nov', margin: 13.0 },
  { month: 'Dec', margin: 12.6 },
];

const categoryMarginData = [
  { category: 'Beverages', margin: 18.2 },
  { category: 'Pantry', margin: 13.3 },
  { category: 'Dairy', margin: 9.1 },
  { category: 'Produce', margin: 6.5 },
  { category: 'Bakery', margin: 11.7 },
];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Margin % Trend (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marginTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#23304a" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#A3BFFA" tick={{ fill: '#A3BFFA', fontSize: 12 }} />
              <YAxis stroke="#A3BFFA" tick={{ fill: '#A3BFFA', fontSize: 12 }} domain={[6, 20]} />
              <Tooltip contentStyle={{ background: '#1A2236', border: 'none', color: '#fff' }} labelStyle={{ color: '#A3BFFA' }} />
              <Line type="monotone" dataKey="margin" stroke="#38BDF8" strokeWidth={3} dot={{ r: 4, fill: '#38BDF8' }} activeDot={{ r: 6, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Margin by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryMarginData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#23304a" strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke="#A3BFFA" tick={{ fill: '#A3BFFA', fontSize: 12 }} />
              <YAxis stroke="#A3BFFA" tick={{ fill: '#A3BFFA', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1A2236', border: 'none', color: '#fff' }} labelStyle={{ color: '#A3BFFA' }} />
              <Legend wrapperStyle={{ color: '#A3BFFA' }} />
              <Bar dataKey="margin" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 