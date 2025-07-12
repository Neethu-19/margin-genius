import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Bell, Database, Shield, User, Globe, BarChart3, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Settings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Original settings state
  const [notifications, setNotifications] = useState({
    marginAlerts: true,
    tariffUpdates: true,
    supplierChanges: false,
    weeklyReports: true,
  })

  const [dataSources, setDataSources] = useState({
    erp: true,
    pricing: true,
    tariffs: true,
    inventory: false,
  })

  const [preferences, setPreferences] = useState({
    autoRefresh: true,
    darkMode: false,
    compactView: false,
  })

  // Advanced Settings state
  const [advancedSettings, setAdvancedSettings] = useState({
    marginAlertThreshold: '10% (Standard)',
    dataRefreshInterval: '5 minutes',
    defaultRegion: 'Northeast',
    exportFormat: 'Excel (.xlsx)',
  })

  // System status state
  const [systemStatus, setSystemStatus] = useState({
    version: '1.0.0',
    lastUpdated: '2024-01-15',
    dataSourcesConnected: 3,
    totalDataSources: 4,
    aiModel: 'GPT-4 (Latest)',
    isCheckingUpdates: false,
  })

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [notifications, dataSources, preferences, advancedSettings])

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handleDataSourceChange = (key: string, value: boolean) => {
    setDataSources(prev => ({ ...prev, [key]: value }))
    // Update connected count
    const newCount = Object.values({ ...dataSources, [key]: value }).filter(Boolean).length
    setSystemStatus(prev => ({ ...prev, dataSourcesConnected: newCount }))
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    
    // Apply dark mode immediately
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const handleAdvancedSettingChange = (key: string, value: string) => {
    setAdvancedSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage for persistence
      localStorage.setItem('marginIQ-settings', JSON.stringify({
        notifications,
        dataSources,
        preferences,
        advancedSettings,
      }))
      
      setHasUnsavedChanges(false)
      toast({
        title: "Settings saved successfully!",
        description: "Your preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetToDefaults = () => {
    setNotifications({
      marginAlerts: true,
      tariffUpdates: true,
      supplierChanges: false,
      weeklyReports: true,
    })
    setDataSources({
      erp: true,
      pricing: true,
      tariffs: true,
      inventory: false,
    })
    setPreferences({
      autoRefresh: true,
      darkMode: false,
      compactView: false,
    })
    setAdvancedSettings({
      marginAlertThreshold: '10% (Standard)',
      dataRefreshInterval: '5 minutes',
      defaultRegion: 'Northeast',
      exportFormat: 'Excel (.xlsx)',
    })
    setHasUnsavedChanges(false)
    
    // Remove dark mode
    document.documentElement.classList.remove('dark')
    
    toast({
      title: "Settings reset to defaults",
      description: "All settings have been restored to their default values.",
    })
  }

  const handleCheckForUpdates = async () => {
    setSystemStatus(prev => ({ ...prev, isCheckingUpdates: true }))
    try {
      // Simulate update check
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "System is up to date!",
        description: "You're running the latest version of MarginIQ.",
      })
    } catch (error) {
      toast({
        title: "Update check failed",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      })
    } finally {
      setSystemStatus(prev => ({ ...prev, isCheckingUpdates: false }))
    }
  }

  const getDataSourceStatus = (isConnected: boolean) => {
    return isConnected ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    )
  }

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('marginIQ-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setNotifications(parsed.notifications || notifications)
        setDataSources(parsed.dataSources || dataSources)
        setPreferences(parsed.preferences || preferences)
        setAdvancedSettings(parsed.advancedSettings || advancedSettings)
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Error loading saved settings:', error)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your MarginIQ preferences and data sources</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose which alerts and updates you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Margin Alerts</div>
                <div className="text-sm text-muted-foreground">Get notified when products fall below margin thresholds</div>
              </div>
              <Switch
                checked={notifications.marginAlerts}
                onCheckedChange={(checked) => handleNotificationChange('marginAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Tariff Updates</div>
                <div className="text-sm text-muted-foreground">Receive updates on tariff changes and their impact</div>
              </div>
              <Switch
                checked={notifications.tariffUpdates}
                onCheckedChange={(checked) => handleNotificationChange('tariffUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Supplier Changes</div>
                <div className="text-sm text-muted-foreground">Notifications about supplier cost changes</div>
              </div>
              <Switch
                checked={notifications.supplierChanges}
                onCheckedChange={(checked) => handleNotificationChange('supplierChanges', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Weekly Reports</div>
                <div className="text-sm text-muted-foreground">Receive weekly margin performance summaries</div>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Data Sources
            </CardTitle>
            <CardDescription>
              Configure which data sources to include in analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div>
                  <div className="font-medium">ERP System</div>
                  <div className="text-sm text-muted-foreground">Product costs and inventory data</div>
                </div>
                {getDataSourceStatus(dataSources.erp)}
              </div>
              <Switch
                checked={dataSources.erp}
                onCheckedChange={(checked) => handleDataSourceChange('erp', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div>
                  <div className="font-medium">Pricing Database</div>
                  <div className="text-sm text-muted-foreground">Current and historical pricing data</div>
                </div>
                {getDataSourceStatus(dataSources.pricing)}
              </div>
              <Switch
                checked={dataSources.pricing}
                onCheckedChange={(checked) => handleDataSourceChange('pricing', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div>
                  <div className="font-medium">Tariff API</div>
                  <div className="text-sm text-muted-foreground">Real-time tariff and duty information</div>
                </div>
                {getDataSourceStatus(dataSources.tariffs)}
              </div>
              <Switch
                checked={dataSources.tariffs}
                onCheckedChange={(checked) => handleDataSourceChange('tariffs', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div>
                  <div className="font-medium">Inventory System</div>
                  <div className="text-sm text-muted-foreground">Shrink and inventory loss data</div>
                </div>
                {getDataSourceStatus(dataSources.inventory)}
              </div>
              <Switch
                checked={dataSources.inventory}
                onCheckedChange={(checked) => handleDataSourceChange('inventory', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              User Preferences
            </CardTitle>
            <CardDescription>
              Customize your dashboard experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto Refresh</div>
                <div className="text-sm text-muted-foreground">Automatically refresh data every 5 minutes</div>
              </div>
              <Switch
                checked={preferences.autoRefresh}
                onCheckedChange={(checked) => handlePreferenceChange('autoRefresh', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">Use dark theme for the interface</div>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Compact View</div>
                <div className="text-sm text-muted-foreground">Show more data in less space</div>
              </div>
              <Switch
                checked={preferences.compactView}
                onCheckedChange={(checked) => handlePreferenceChange('compactView', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              Current system status and version information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">{systemStatus.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm font-medium">{systemStatus.lastUpdated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data Sources</span>
              <span className="text-sm font-medium">{systemStatus.dataSourcesConnected}/{systemStatus.totalDataSources} Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">AI Model</span>
              <span className="text-sm font-medium">{systemStatus.aiModel}</span>
            </div>
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleCheckForUpdates}
                disabled={systemStatus.isCheckingUpdates}
              >
                {systemStatus.isCheckingUpdates ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Checking...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Check for Updates
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>
            Advanced configuration options for power users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Margin Alert Threshold
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-background"
                value={advancedSettings.marginAlertThreshold}
                onChange={(e) => handleAdvancedSettingChange('marginAlertThreshold', e.target.value)}
              >
                <option>5% (Conservative)</option>
                <option>10% (Standard)</option>
                <option>15% (Aggressive)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data Refresh Interval
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-background"
                value={advancedSettings.dataRefreshInterval}
                onChange={(e) => handleAdvancedSettingChange('dataRefreshInterval', e.target.value)}
              >
                <option>1 minute</option>
                <option>5 minutes</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Default Region
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-background"
                value={advancedSettings.defaultRegion}
                onChange={(e) => handleAdvancedSettingChange('defaultRegion', e.target.value)}
              >
                <option>All Regions</option>
                <option>Northeast</option>
                <option>Southeast</option>
                <option>West</option>
                <option>Southwest</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Export Format
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-background"
                value={advancedSettings.exportFormat}
                onChange={(e) => handleAdvancedSettingChange('exportFormat', e.target.value)}
              >
                <option>Excel (.xlsx)</option>
                <option>CSV</option>
                <option>PDF</option>
                <option>JSON</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleResetToDefaults}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveChanges} disabled={isLoading || !hasUnsavedChanges}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
} 