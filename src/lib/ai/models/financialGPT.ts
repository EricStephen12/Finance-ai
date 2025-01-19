import { OpenAIApi } from 'openai'
import { AIModel } from '../orchestrator'

export class FinancialGPT implements AIModel {
  name = 'FinancialGPT'
  private openai: OpenAIApi

  constructor(openai: OpenAIApi) {
    this.openai = openai
  }

  async analyze(data: any): Promise<any> {
    try {
      const prompt = this.constructPrompt(data)
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })

      return this.parseResponse(response.data.choices[0].text)
    } catch (error) {
      console.error('Error in FinancialGPT analysis:', error)
      throw error
    }
  }

  private constructPrompt(data: any): string {
    // Construct a detailed prompt based on the data type and content
    const basePrompt = 'As a financial expert, analyze the following data and provide insights:\n\n'
    
    if (typeof data === 'string') {
      return `${basePrompt}${data}`
    }

    return `${basePrompt}${JSON.stringify(data, null, 2)}\n\nProvide detailed analysis covering:\n1. Key insights\n2. Potential risks\n3. Opportunities\n4. Recommendations`
  }

  private parseResponse(text: string | undefined): any {
    if (!text) return null

    try {
      // Attempt to parse as JSON if the response is in JSON format
      return JSON.parse(text)
    } catch {
      // If not JSON, return the text as is
      return text
    }
  }
} 