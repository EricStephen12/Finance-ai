import { generateFinancialInsights } from './insights'

if (!process.env.NEXT_PUBLIC_AI_ML_KEY) {
  throw new Error('Missing AI/ML API key. Please set NEXT_PUBLIC_AI_ML_KEY in your environment variables.')
}

interface AssistantResponse {
  text: string
  sentiment: 'positive' | 'neutral' | 'negative'
  suggestedActions?: string[]
  detailedExplanation?: string
  nextSteps?: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

async function callAIModel(prompt: string, options = {}) {
  // First, try NLP Cloud's GPT-NeoX model
  try {
    const response = await fetch('https://api.nlpcloud.io/v1/gpu/finetuned-gpt-neox-20b/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_AI_ML_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: prompt,
        max_length: 1000,
        ...options
      })
    })

    if (!response.ok) {
      throw new Error('NLP Cloud model failed')
    }

    const data = await response.json()
    return data.generated_text || ''
  } catch (error) {
    // Fallback to Cohere's model
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_ML_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 500,
          temperature: 0.7,
          ...options
        })
      })

      if (!response.ok) {
        throw new Error('Cohere model failed')
      }

      const data = await response.json()
      return data.generations?.[0]?.text || ''
    } catch (cohereError) {
      // Final fallback to Anthropic's Claude model
      const response = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_AI_ML_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          max_tokens_to_sample: 500,
          temperature: 0.7,
          ...options
        })
      })

      if (!response.ok) {
        throw new Error('All AI models failed')
      }

      const data = await response.json()
      return data.completion || ''
    }
  }
}

export async function getAssistantResponse(
  userId: string,
  userMessage: string,
  messageHistory: Array<{ role: 'user' | 'assistant', content: string }> = []
): Promise<AssistantResponse> {
  try {
    if (!userMessage.trim()) {
      throw new Error('Empty message')
    }

    // Get latest financial insights for context
    const insights = await generateFinancialInsights(userId)
    
    // Format insights into a digestible context
    const context = `
Current Financial Status:
- Monthly Income: $${(insights.totalIncome / 12).toFixed(2)}
- Monthly Expenses: $${(insights.totalExpenses / 12).toFixed(2)}
- Savings Rate: ${((insights.currentSavings / insights.totalIncome) * 100).toFixed(1)}%
- Financial Health Score: ${insights.financialHealth.score}/100 (${insights.financialHealth.explanation})

Key Trends:
${insights.financialHealth.trends.map(t => `- ${t.metric}: ${t.trend} ${t.percentage}%
  • ${t.explanation}
  • Impact: ${t.impact}
  • Actions: ${t.actionableSteps.join(', ')}`).join('\n')}

Top Spending Categories:
${insights.spendingPatterns.map(p => `- ${p.category}: $${p.amount} (${p.percentage}% of expenses)
  • Status: ${p.comparison} average
  • ${p.explanation}
  • Optimization: ${p.optimizationSteps.join(', ')}`).join('\n')}

Priority Recommendations:
${insights.recommendations.map(r => `- ${r.title} (${r.priority} priority)
  • Impact: $${r.impact.monthly}/month ($${r.impact.yearly}/year)
  • Timeframe: ${r.timeframe}
  • Expected Outcome: ${r.expectedOutcome}`).join('\n')}

Monthly Analysis:
${insights.monthlyAnalysis.summary}
Key Findings: ${insights.monthlyAnalysis.keyFindings.join(', ')}
`

    // Format conversation history
    const conversationHistory = messageHistory
      .slice(-5)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    // Prepare the main prompt
    const mainPrompt = `
Context: You are an expert financial advisor with a friendly, empathetic personality. You have access to the user's detailed financial data and insights shown below. Provide clear, actionable advice while maintaining a conversational tone. Always be specific with numbers and recommendations, and explain the reasoning behind each suggestion.

${context}

Previous conversation:
${conversationHistory}

User: ${userMessage}

Provide a response that includes:
1. A clear, direct answer to the user's question
2. Specific numbers and percentages where relevant
3. Clear explanation of the reasoning behind your advice
4. Immediate, short-term, and long-term action steps
5. Connection to their current financial trends and patterns
`

    console.log('Sending request to AI model...')
    
    // Get response from AI model
    const completion = await callAIModel(mainPrompt)

    // Analyze sentiment
    const sentimentCompletion = await callAIModel(`Analyze the sentiment of this financial advice response. Respond with only one word: 'positive', 'neutral', or 'negative'.\n\nResponse to analyze: "${completion}"`)

    const sentiment = (sentimentCompletion.toLowerCase() || 'neutral') as 'positive' | 'neutral' | 'negative'

    // Get detailed explanation
    const explanationPrompt = `Based on the financial advice response, provide a clear, concise explanation of the reasoning behind the recommendations. Focus on the specific financial impact and benefits.\n\nResponse to analyze: "${completion}"`
    const detailedExplanation = await callAIModel(explanationPrompt)

    // Get action steps
    const actionPrompt = `Based on this financial advice response, provide three categories of action steps:
1. Immediate (next 24-48 hours)
2. Short-term (next 30 days)
3. Long-term (next 3-6 months)

Format each action on a new line starting with '-'. Be very specific with numbers and actions.

Response to analyze: "${completion}"`
    
    const actionCompletion = await callAIModel(actionPrompt)
    
    // Parse action steps
    const actionLines = actionCompletion.split('\n')
    const nextSteps = {
      immediate: actionLines
        .filter(line => line.toLowerCase().includes('immediate') || line.toLowerCase().includes('24-48'))
        .map(line => line.replace(/^[^-]*-\s*/, '').trim()),
      shortTerm: actionLines
        .filter(line => line.toLowerCase().includes('short-term') || line.toLowerCase().includes('30 days'))
        .map(line => line.replace(/^[^-]*-\s*/, '').trim()),
      longTerm: actionLines
        .filter(line => line.toLowerCase().includes('long-term') || line.toLowerCase().includes('3-6 months'))
        .map(line => line.replace(/^[^-]*-\s*/, '').trim())
    }

    // Get suggested actions (more concise, immediate steps)
    const suggestedActionsPrompt = `Based on this financial advice response, list 2-3 most important, immediate actions the user should take. Format each action on a new line starting with '-'. Be very specific with numbers and actions.\n\nResponse to analyze: "${completion}"`
    const suggestedActionsCompletion = await callAIModel(suggestedActionsPrompt)
    const suggestedActions = suggestedActionsCompletion.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2)) || []

    return {
      text: completion,
      sentiment,
      suggestedActions,
      detailedExplanation,
      nextSteps
    }
  } catch (error: any) {
    console.error('Error getting assistant response:', error)
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to get response from AI'
    console.error('Detailed error:', errorMessage)
    throw new Error(errorMessage)
  }
}

export async function generateFinancialPlan(
  userId: string,
  goalType: 'savings' | 'investment' | 'debt' | 'budget',
  timeframe: number // in months
): Promise<string> {
  try {
    const insights = await generateFinancialInsights(userId)
    
    const messages = [
      {
        role: 'user',
        content: `As a financial advisor, create a detailed ${timeframe}-month plan to help the user reach their ${goalType} goals. Use these insights:

Financial Context:
- Monthly Income: $${(insights.totalIncome / 12).toFixed(2)}
- Monthly Expenses: $${(insights.totalExpenses / 12).toFixed(2)}
- Current Savings: $${insights.currentSavings.toFixed(2)}
- Financial Health Score: ${insights.financialHealth.score}
- Spending Patterns: ${JSON.stringify(insights.spendingPatterns)}
- Recent Recommendations: ${JSON.stringify(insights.recommendations)}

Create a structured plan with:
1. Specific monthly targets
2. Action items with dollar amounts
3. Progress milestones
4. Potential challenges and solutions
5. Expected outcomes with numerical projections

Format the response in a clear, easy-to-read structure with bullet points and sections.`
      }
    ]

    const completion = await callAIModel(messages.join('\n'))

    return completion || 'Unable to generate plan at this time.'
  } catch (error: any) {
    console.error('Error generating financial plan:', error)
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to generate financial plan')
  }
}

export async function analyzeFinancialScenario(
  userId: string,
  scenario: string,
  timeframe: number // in months
): Promise<string> {
  try {
    const insights = await generateFinancialInsights(userId)
    
    const messages = [
      {
        role: 'user',
        content: `As a financial advisor, analyze this scenario: "${scenario}"

Use these current financial insights:
- Monthly Income: $${(insights.totalIncome / 12).toFixed(2)}
- Monthly Expenses: $${(insights.totalExpenses / 12).toFixed(2)}
- Savings Rate: ${((insights.currentSavings / insights.totalIncome) * 100).toFixed(1)}%
- Financial Health Score: ${insights.financialHealth.score}
- Current Trends: ${JSON.stringify(insights.financialHealth.trends)}

Provide a detailed analysis including:
1. Potential impact on monthly cash flow
2. Effect on savings and long-term goals
3. Risks and opportunities
4. Specific recommendations with numbers
5. Alternative scenarios to consider

Project the outcomes over ${timeframe} months and provide specific numerical predictions.`
      }
    ]

    const completion = await callAIModel(messages.join('\n'))

    return completion || 'Unable to analyze scenario at this time.'
  } catch (error: any) {
    console.error('Error analyzing financial scenario:', error)
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to analyze scenario')
  }
} 