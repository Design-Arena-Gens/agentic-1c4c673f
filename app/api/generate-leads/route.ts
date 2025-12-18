import { NextRequest, NextResponse } from 'next/server'

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

// Sample data generators
const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'James', 'Emily', 'Robert', 'Amanda', 'William', 'Jessica', 'Christopher', 'Ashley', 'Daniel', 'Michelle', 'Matthew', 'Stephanie', 'Andrew', 'Rachel', 'Joseph']
const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson']

const companyPrefixes = ['Tech', 'Digital', 'Cloud', 'Smart', 'Data', 'Cyber', 'Quantum', 'Vertex', 'Nexus', 'Apex', 'Prime', 'Elite', 'Global', 'Advanced', 'Innovative']
const companySuffixes = ['Solutions', 'Systems', 'Technologies', 'Dynamics', 'Innovations', 'Labs', 'Group', 'Corp', 'Inc', 'Ventures']

const roles = ['CEO', 'CTO', 'VP of Sales', 'Marketing Director', 'Head of Growth', 'Product Manager', 'Operations Manager', 'Business Development Manager']

function generateRandomLead(industry: string, role: string, location: string): Lead {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const name = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${generateCompanyName().toLowerCase().replace(/\s/g, '')}.com`
  const company = generateCompanyName()
  const score = Math.floor(Math.random() * 40) + 60 // Score between 60-100

  const insights = generateInsights(industry, role, score, company)

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    company,
    industry: industry || 'Technology',
    score,
    insights,
    timestamp: new Date().toISOString(),
  }
}

function generateCompanyName(): string {
  const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]
  const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)]
  return `${prefix} ${suffix}`
}

function generateInsights(industry: string, role: string, score: number, company: string): string[] {
  const insights: string[] = []

  if (score >= 80) {
    insights.push('High engagement potential - actively seeking new solutions')
    insights.push(`Company is expanding their ${industry.toLowerCase()} operations`)
  } else if (score >= 70) {
    insights.push('Moderate engagement potential - open to innovation')
    insights.push('Company shows signs of recent growth')
  } else {
    insights.push('Emerging opportunity - needs nurturing')
    insights.push('Company is in evaluation phase')
  }

  if (role) {
    insights.push(`${role} has decision-making authority in procurement`)
  } else {
    insights.push('Decision-maker in key technology initiatives')
  }

  const randomInsights = [
    `${company} recently raised funding for expansion`,
    'Active on professional networks and industry events',
    'Company has 50-200 employees (ideal mid-market)',
    'Budget cycle aligns with Q1-Q2 planning',
    'Previous vendor contracts expiring soon',
    'Strong online presence and brand recognition',
    'Technology stack indicates need for modernization',
    'Competitor recently approached this account'
  ]

  insights.push(randomInsights[Math.floor(Math.random() * randomInsights.length)])
  insights.push(randomInsights[Math.floor(Math.random() * randomInsights.length)])

  return Array.from(new Set(insights)).slice(0, 4)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { industry, role, location, count } = body

    // Generate leads
    const leads: Lead[] = []
    const numberOfLeads = Math.min(count || 5, 20)

    for (let i = 0; i < numberOfLeads; i++) {
      leads.push(generateRandomLead(industry, role, location))
    }

    // Sort by score
    leads.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      success: true,
      leads,
      message: `Generated ${leads.length} qualified leads`
    })
  } catch (error) {
    console.error('Error in generate-leads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate leads' },
      { status: 500 }
    )
  }
}
