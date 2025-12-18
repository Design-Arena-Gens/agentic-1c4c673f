'use client'

import { useState } from 'react'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  industry: string
  score: number
  insights: string[]
  timestamp: string
}

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [targetIndustry, setTargetIndustry] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [location, setLocation] = useState('')
  const [count, setCount] = useState(5)

  const generateLeads = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: targetIndustry,
          role: targetRole,
          location: location,
          count: count,
        }),
      })

      const data = await response.json()
      if (data.leads) {
        setLeads([...data.leads, ...leads])
      }
    } catch (error) {
      console.error('Error generating leads:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportLeads = () => {
    const csv = [
      ['Name', 'Email', 'Company', 'Industry', 'Score', 'Insights', 'Timestamp'],
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.company,
        lead.industry,
        lead.score.toString(),
        lead.insights.join('; '),
        lead.timestamp
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString()}.csv`
    a.click()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI Lead Generation Agent
          </h1>
          <p className="text-xl text-gray-600">
            Intelligent lead discovery powered by advanced AI
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Generate New Leads
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Industry
              </label>
              <input
                type="text"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                placeholder="e.g., SaaS, E-commerce, Healthcare"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., CEO, CTO, Marketing Director"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, Remote, Europe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Leads
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                min="1"
                max="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={generateLeads}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Leads...
              </span>
            ) : (
              'Generate Leads'
            )}
          </button>
        </div>

        {leads.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Generated Leads ({leads.length})
              </h2>
              <button
                onClick={exportLeads}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Export to CSV
              </button>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {lead.name}
                      </h3>
                      <p className="text-gray-600">{lead.company} - {lead.industry}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                      <div className="text-sm text-gray-500">Lead Score</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {lead.email}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="font-medium text-gray-700 mb-2">AI Insights:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {lead.insights.map((insight, idx) => (
                        <li key={idx} className="text-gray-600 text-sm">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-gray-400">
                    Generated: {new Date(lead.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {leads.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No leads generated yet
            </h3>
            <p className="text-gray-500">
              Fill in the form above and click Generate Leads to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
