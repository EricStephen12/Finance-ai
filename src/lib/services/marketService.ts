import axios from 'axios'

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

interface StockQuote {
  symbol: string
  open: number
  high: number
  low: number
  price: number
  volume: number
  latestTradingDay: string
  previousClose: number
  change: number
  changePercent: string
}

export async function getMarketData(symbols: string[]): Promise<MarketData[]> {
  try {
    const promises = symbols.map(symbol =>
      axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`)
    )
    
    const responses = await Promise.all(promises)
    
    return responses.map(response => {
      const quote = response.data['Global Quote']
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume'])
      }
    })
  } catch (error) {
    console.error('Error fetching market data:', error)
    throw error
  }
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    )
    
    const quote = response.data['Global Quote']
    return {
      symbol: quote['01. symbol'],
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      price: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent']
    }
  } catch (error) {
    console.error('Error fetching stock quote:', error)
    throw error
  }
}

export async function getMarketSentiment(symbol: string): Promise<{sentiment: string; score: number}> {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    )
    
    const sentimentScore = response.data.feed
      .slice(0, 10)
      .reduce((acc: number, article: any) => acc + article.overall_sentiment_score, 0) / 10
    
    let sentiment = 'neutral'
    if (sentimentScore > 0.2) sentiment = 'bullish'
    if (sentimentScore < -0.2) sentiment = 'bearish'
    
    return {
      sentiment,
      score: parseFloat(sentimentScore.toFixed(2))
    }
  } catch (error) {
    console.error('Error fetching market sentiment:', error)
    throw error
  }
} 