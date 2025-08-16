import React, { useState } from 'react'
import { DataMigrationService } from '../services/dataMigration'
import { CheckCircle, AlertCircle, Database, Download, Upload } from 'lucide-react'

const DatabaseSetup: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed' | 'error'>('idle')
  const [dataCounts, setDataCounts] = useState<{ users: number; recipes: number; stories: number; suppliers: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkDataExists = async () => {
    try {
      setMigrationStatus('checking')
      const counts = await DataMigrationService.checkDataExists()
      setDataCounts(counts)
      setMigrationStatus('idle')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check data')
      setMigrationStatus('error')
    }
  }

  const runMigration = async () => {
    try {
      setMigrationStatus('migrating')
      setError(null)
      await DataMigrationService.runAllMigrations()
      setMigrationStatus('completed')
      
      // Refresh data counts
      const counts = await DataMigrationService.checkDataExists()
      setDataCounts(counts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed')
      setMigrationStatus('error')
    }
  }

  const getStatusIcon = () => {
    switch (migrationStatus) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-cookbook-green" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-cookbook-orange" />
      case 'checking':
      case 'migrating':
        return <Database className="w-6 h-6 text-cookbook-yellow animate-pulse" />
      default:
        return <Database className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (migrationStatus) {
      case 'completed':
        return 'Migration completed successfully!'
      case 'error':
        return 'Migration failed. Check console for details.'
      case 'checking':
        return 'Checking existing data...'
      case 'migrating':
        return 'Migrating data to Supabase...'
      default:
        return 'Ready to migrate data'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cookbook-orange to-cookbook-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-cookbook-black mb-2">Database Setup</h1>
          <p className="text-gray-600">Set up your Supabase database and migrate sample data</p>
        </div>

        {/* Setup Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-cookbook-black mb-4">Setup Steps</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cookbook-orange text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-medium text-cookbook-black">Run Database Schema</h3>
                <p className="text-gray-600 text-sm">
                  Copy the contents of <code className="bg-gray-100 px-2 py-1 rounded">database-schema.sql</code> and run it in your Supabase SQL Editor
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cookbook-orange text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-medium text-cookbook-black">Check Existing Data</h3>
                <p className="text-gray-600 text-sm">
                  Verify if data already exists in your database
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cookbook-orange text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-medium text-cookbook-black">Migrate Sample Data</h3>
                <p className="text-gray-600 text-sm">
                  Import sample users, recipes, stories, and suppliers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-cookbook-black">Database Status</h2>
            <button
              onClick={checkDataExists}
              disabled={migrationStatus === 'checking'}
              className="bg-cookbook-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cookbook-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Check Data</span>
            </button>
          </div>

          {dataCounts && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-cookbook-orange/10 border border-cookbook-orange/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cookbook-orange">{dataCounts.users}</div>
                <div className="text-sm text-cookbook-orange">Users</div>
              </div>
              <div className="bg-cookbook-yellow/10 border border-cookbook-yellow/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cookbook-yellow">{dataCounts.recipes}</div>
                <div className="text-sm text-cookbook-yellow">Recipes</div>
              </div>
              <div className="bg-cookbook-green/10 border border-cookbook-green/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cookbook-green">{dataCounts.stories}</div>
                <div className="text-sm text-cookbook-green">Stories</div>
              </div>
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{dataCounts.suppliers}</div>
                <div className="text-sm text-gray-600">Suppliers</div>
              </div>
            </div>
          )}
        </div>

        {/* Migration Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-cookbook-black">Data Migration</h2>
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <span className="text-sm text-gray-600">{getStatusText()}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={runMigration}
              disabled={migrationStatus === 'migrating'}
              className="bg-cookbook-green text-white px-6 py-3 rounded-lg font-medium hover:bg-cookbook-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Run Migration</span>
            </button>

            <button
              onClick={checkDataExists}
              disabled={migrationStatus === 'checking'}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>• Migration will import sample users, recipes, stories, and suppliers</p>
            <p>• Existing data will not be overwritten</p>
            <p>• Check the console for detailed migration logs</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-cookbook-orange/10 to-cookbook-yellow/10 border border-cookbook-orange/20 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-cookbook-black mb-3">🎉 Next Steps After Migration</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Update your components to use the <code className="bg-white px-2 py-1 rounded">useSupabaseData</code> hook</p>
            <p>• Replace mock data calls with Supabase queries</p>
            <p>• Test real-time features and data persistence</p>
            <p>• Set up authentication and user management</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseSetup
