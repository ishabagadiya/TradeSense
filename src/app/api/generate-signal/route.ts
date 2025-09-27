import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { symbol, currentPrice, emaPrice, emaConfidence, priceConfidence, timeframe = '24h' } = await request.json();

    // Validate required fields
    if (!symbol || !currentPrice || !emaPrice || !emaConfidence || !priceConfidence) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: symbol, currentPrice, emaPrice, emaConfidence, priceConfidence' 
        },
        { status: 400 }
      );
    }

    // Check for OpenRouter API key
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenRouter API key not configured' 
        },
        { status: 500 }
      );
    }

    // Prepare the trading data
    const tradingData = {
      symbol: symbol.toString().toUpperCase(),
      currentPrice: parseFloat(currentPrice),
      emaPrice: parseFloat(emaPrice),
      emaConfidence: parseFloat(emaConfidence),
      priceConfidence: parseFloat(priceConfidence),
      timeframe: timeframe.toString()
    };

    console.log('Generating trading signal with data:', tradingData);

    // Calculate price difference and confidence metrics
    const priceDifference = ((tradingData.currentPrice - tradingData.emaPrice) / tradingData.emaPrice) * 100;
    const confidenceRatio = tradingData.priceConfidence / tradingData.currentPrice;

    // Create the prompt for the LLM
    const prompt = `You are an expert cryptocurrency trading analyst with 10+ years of experience. Analyze the following market data for ${tradingData.symbol} and provide a sophisticated trading signal.

MARKET DATA ANALYSIS:
- Symbol: ${tradingData.symbol}
- Current Price: $${tradingData.currentPrice}
- EMA Price: $${tradingData.emaPrice}
- Price vs EMA Divergence: ${priceDifference.toFixed(2)}%
- EMA Confidence Interval: ±$${tradingData.emaConfidence}
- Price Confidence Interval: ±$${tradingData.priceConfidence}
- Analysis Timeframe: ${tradingData.timeframe}
- Market Volatility Ratio: ${(confidenceRatio * 100).toFixed(4)}%

DYNAMIC ANALYSIS REQUIREMENTS:

1. SIGNAL DETERMINATION (be DECISIVE, not conservative):
   
   BUY SIGNALS (be more aggressive):
   - STRONG BUY: Price below EMA by >2%, any confidence level → Use 75-85% confidence
   - MODERATE BUY: Price below EMA by 1-2%, reasonable confidence → Use 65-75% confidence  
   - WEAK BUY: Price below EMA by 0.5-1%, tight confidence → Use 55-65% confidence
   
   SELL SIGNALS (be more decisive):
   - STRONG SELL: Price above EMA by >2%, any confidence level → Use 75-85% confidence
   - MODERATE SELL: Price above EMA by 1-2%, reasonable confidence → Use 65-75% confidence
   - WEAK SELL: Price above EMA by 0.5-1%, tight confidence → Use 55-65% confidence
   
   HOLD SIGNALS (be more restrictive):
   - ONLY use HOLD if: Price within ±0.5% of EMA AND high uncertainty (confidence ratio >1%)
   - HOLD confidence should be 40-55% (not 55% every time)

2. DYNAMIC TP/SL CALCULATION (base on market conditions):
   - For HIGH VOLATILITY (confidence ratio >1%): Use wider ranges (4-8% for TP, 3-5% for SL)
   - For MEDIUM VOLATILITY (0.5-1%): Use moderate ranges (2-6% for TP, 2-4% for SL)
   - For LOW VOLATILITY (<0.5%): Use tighter ranges (1-4% for TP, 1-3% for SL)
   - Adjust based on signal strength and market conditions

3. CONFIDENCE SCORING (be dynamic):
   - Consider price-EMA divergence strength
   - Factor in confidence interval tightness
   - Account for market volatility
   - Range: 35-90% (vary meaningfully, not always 60%)

4. RISK ASSESSMENT:
   - Low Risk: Tight confidence intervals, small divergences, stable conditions
   - Medium Risk: Moderate volatility, average confidence intervals
   - High Risk: Wide confidence intervals, extreme divergences, high volatility

CALCULATION EXAMPLES (adapt these intelligently):
Current Price: $${tradingData.currentPrice}

If STRONG BUY signal:
- TP1: $${(tradingData.currentPrice * (1 + (0.03 + confidenceRatio * 2))).toFixed(8)}
- TP2: $${(tradingData.currentPrice * (1 + (0.06 + confidenceRatio * 3))).toFixed(8)}
- SL: $${(tradingData.currentPrice * (1 - (0.025 + confidenceRatio * 1.5))).toFixed(8)}

If STRONG SELL signal:
- TP1: $${(tradingData.currentPrice * (1 - (0.03 + confidenceRatio * 2))).toFixed(8)}
- TP2: $${(tradingData.currentPrice * (1 - (0.06 + confidenceRatio * 3))).toFixed(8)}
- SL: $${(tradingData.currentPrice * (1 + (0.025 + confidenceRatio * 1.5))).toFixed(8)}

PROVIDE YOUR ANALYSIS IN THIS JSON FORMAT:
{
  "tokenSymbol": "${tradingData.symbol}",
  "signal": "buy|sell|hold",
  "confidence": [calculate based on analysis strength: 35-90],
  "tp1": [calculate dynamically based on volatility and signal strength],
  "tp2": [calculate dynamically, should be further than tp1],
  "sl": [calculate dynamically, opposite direction from signal],
  "reasoning": "Provide detailed technical analysis explaining your decision, including why you chose these specific TP/SL levels based on the market data",
  "signalTimeframe": "${tradingData.timeframe}",
  "riskLevel": "low|medium|high",
  "marketCondition": "bullish|bearish|neutral"
}

ADVANCED ANALYSIS FACTORS:
- Price Momentum: ${priceDifference > 0 ? 'Bullish' : 'Bearish'} (${priceDifference.toFixed(2)}% from EMA)
- Market Uncertainty: ${confidenceRatio > 0.01 ? 'High' : confidenceRatio > 0.005 ? 'Medium' : 'Low'} volatility
- Signal Strength: ${Math.abs(priceDifference) > 4 ? 'Strong' : Math.abs(priceDifference) > 2 ? 'Moderate' : 'Weak'} directional bias
- Risk Environment: ${confidenceRatio > 0.01 ? 'High Risk' : confidenceRatio > 0.005 ? 'Medium Risk' : 'Low Risk'}

DYNAMIC CALCULATION LOGIC:
1. Volatility Adjustment: Higher confidence ratios = wider TP/SL ranges
2. Momentum Factor: Stronger EMA divergence = more aggressive targets
3. Risk Scaling: Adjust position sizing recommendations based on confidence intervals
4. Time Decay: Consider ${tradingData.timeframe} timeframe for target realism

DECISION MATRIX FOR THIS SPECIFIC CASE:
Current Price Divergence: ${priceDifference.toFixed(2)}%
Market Volatility: ${(confidenceRatio * 100).toFixed(4)}%

FOR THIS ANALYSIS:
${priceDifference < -2 ? '→ STRONG BUY SIGNAL (price significantly below EMA)' : 
  priceDifference < -1 ? '→ MODERATE BUY SIGNAL (price below EMA)' :
  priceDifference < -0.5 ? '→ WEAK BUY SIGNAL (price slightly below EMA)' :
  priceDifference > 2 ? '→ STRONG SELL SIGNAL (price significantly above EMA)' :
  priceDifference > 1 ? '→ MODERATE SELL SIGNAL (price above EMA)' :
  priceDifference > 0.5 ? '→ WEAK SELL SIGNAL (price slightly above EMA)' :
  '→ ONLY use HOLD if confidence ratio >1% (high uncertainty)'}

CONFIDENCE GUIDELINES:
- Strong signals (|divergence| > 2%): 75-85% confidence
- Moderate signals (|divergence| 1-2%): 65-75% confidence  
- Weak signals (|divergence| 0.5-1%): 55-65% confidence
- HOLD signals: 40-55% confidence (and only when truly uncertain)

CRITICAL REQUIREMENTS:
- Calculate TP1, TP2, SL as precise NUMBERS based on current price $${tradingData.currentPrice}
- Make calculations TRULY DYNAMIC based on volatility ratio: ${(confidenceRatio * 100).toFixed(4)}%
- Factor in the ${priceDifference.toFixed(2)}% price divergence momentum
- BE DECISIVE - Don't default to HOLD unless truly uncertain
- Vary confidence scores based on signal strength (not always 55%)
- TP/SL ranges should reflect signal strength and market volatility

VARY YOUR OUTPUTS - Don't be repetitive! Each analysis should be unique based on the specific market data provided.

Respond with ONLY the JSON object.`;

    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'TradeSense AI Trading Signal Generator'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-70b-instruct',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Higher temperature for more creative/varied responses
        max_tokens: 1500,
        top_p: 0.95,
        frequency_penalty: 0.3, // Higher to avoid repetitive patterns
        presence_penalty: 0.2
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API responded with status: ${openRouterResponse.status}`);
    }

    const openRouterResult = await openRouterResponse.json();
    console.log('OpenRouter response:', openRouterResult);

    if (!openRouterResult.choices || openRouterResult.choices.length === 0) {
      throw new Error('No response from OpenRouter API');
    }

    const aiResponse = openRouterResult.choices[0].message.content;
    console.log('Raw AI response:', aiResponse);
    
    // Parse the JSON response from the AI
    let tradingSignal;
    try {
      // Clean the response in case there's extra text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      console.log('Extracted JSON:', jsonString);
      tradingSignal = JSON.parse(jsonString);
      console.log('Parsed trading signal:', tradingSignal);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse trading signal from AI response');
    }

    // Validate the trading signal structure
    if (!tradingSignal.tokenSymbol || !tradingSignal.signal) {
      throw new Error('Incomplete trading signal received from AI');
    }

    // Validate TP/SL values only for extreme cases (trust AI's calculations)
    const tokenCurrentPrice = tradingData.currentPrice;
    
    // Only flag as unrealistic if values are completely broken (>200% difference or negative/zero)
    const isBroken = (value: number) => {
      return value <= 0 || 
             value > tokenCurrentPrice * 10 || 
             value < tokenCurrentPrice * 0.1 ||
             Math.abs((value - tokenCurrentPrice) / tokenCurrentPrice) > 2.0; // Only fix if >200% difference
    };

    // Only fix completely broken values - let AI handle intelligent calculations
    if (isBroken(tradingSignal.tp1) || isBroken(tradingSignal.tp2) || isBroken(tradingSignal.sl)) {
      console.log('Fixing completely broken TP/SL values from AI response');
      console.log('Original values:', { tp1: tradingSignal.tp1, tp2: tradingSignal.tp2, sl: tradingSignal.sl });
      console.log('Current price:', tokenCurrentPrice);
      
      // Use the AI's volatility-based calculation from the prompt
      const volatilityMultiplier = confidenceRatio > 0.01 ? 2 : (confidenceRatio > 0.005 ? 1.5 : 1);
      
      if (tradingSignal.signal.toLowerCase() === 'buy') {
        tradingSignal.tp1 = parseFloat((tokenCurrentPrice * (1 + (0.03 + confidenceRatio * volatilityMultiplier))).toFixed(8));
        tradingSignal.tp2 = parseFloat((tokenCurrentPrice * (1 + (0.06 + confidenceRatio * volatilityMultiplier * 1.5))).toFixed(8));
        tradingSignal.sl = parseFloat((tokenCurrentPrice * (1 - (0.025 + confidenceRatio * volatilityMultiplier * 0.8))).toFixed(8));
      } else if (tradingSignal.signal.toLowerCase() === 'sell') {
        tradingSignal.tp1 = parseFloat((tokenCurrentPrice * (1 - (0.03 + confidenceRatio * volatilityMultiplier))).toFixed(8));
        tradingSignal.tp2 = parseFloat((tokenCurrentPrice * (1 - (0.06 + confidenceRatio * volatilityMultiplier * 1.5))).toFixed(8));
        tradingSignal.sl = parseFloat((tokenCurrentPrice * (1 + (0.025 + confidenceRatio * volatilityMultiplier * 0.8))).toFixed(8));
      } else { // hold
        tradingSignal.tp1 = parseFloat((tokenCurrentPrice * (1 + (0.02 + confidenceRatio * volatilityMultiplier * 0.5))).toFixed(8));
        tradingSignal.tp2 = parseFloat((tokenCurrentPrice * (1 + (0.04 + confidenceRatio * volatilityMultiplier))).toFixed(8));
        tradingSignal.sl = parseFloat((tokenCurrentPrice * (1 - (0.02 + confidenceRatio * volatilityMultiplier * 0.5))).toFixed(8));
      }
      
      console.log('Fixed values with dynamic calculation:', { tp1: tradingSignal.tp1, tp2: tradingSignal.tp2, sl: tradingSignal.sl });
    } else {
      console.log('AI calculated TP/SL values look good:', { tp1: tradingSignal.tp1, tp2: tradingSignal.tp2, sl: tradingSignal.sl });
    }

    // Force more varied signals if AI is being too conservative
    const absPriceDiff = Math.abs(priceDifference);
    
    // Add some randomness to confidence to avoid repetitive values
    const confidenceVariation = (Math.random() - 0.5) * 8; // ±4% variation
    tradingSignal.confidence = Math.round(Math.max(35, Math.min(90, tradingSignal.confidence + confidenceVariation)));
    
    // If AI keeps giving HOLD with similar confidence, force more decisive signals
    if (tradingSignal.signal.toLowerCase() === 'hold' && absPriceDiff > 0.5) {
      console.log('AI being too conservative, adjusting signal based on price divergence');
      
      if (priceDifference < -0.5) {
        tradingSignal.signal = 'buy';
        tradingSignal.confidence = Math.max(65, Math.min(85, tradingSignal.confidence + 10));
        tradingSignal.reasoning = `Adjusted to BUY signal due to price being ${priceDifference.toFixed(2)}% below EMA, indicating oversold conditions. ` + tradingSignal.reasoning;
      } else if (priceDifference > 0.5) {
        tradingSignal.signal = 'sell';
        tradingSignal.confidence = Math.max(65, Math.min(85, tradingSignal.confidence + 10));
        tradingSignal.reasoning = `Adjusted to SELL signal due to price being ${priceDifference.toFixed(2)}% above EMA, indicating overbought conditions. ` + tradingSignal.reasoning;
      }
    }
    
    // Ensure signal-specific confidence ranges
    if (tradingSignal.signal.toLowerCase() === 'buy' || tradingSignal.signal.toLowerCase() === 'sell') {
      tradingSignal.confidence = Math.max(60, Math.min(85, tradingSignal.confidence));
    } else if (tradingSignal.signal.toLowerCase() === 'hold') {
      tradingSignal.confidence = Math.max(40, Math.min(60, tradingSignal.confidence));
    }

    // Only adjust confidence if it's completely unreasonable
    if (tradingSignal.confidence < 20 || tradingSignal.confidence > 100) {
      console.log('Adjusting unreasonable confidence score:', tradingSignal.confidence);
      tradingSignal.confidence = Math.max(35, Math.min(90, tradingSignal.confidence || 70));
    }

    // Add metadata
    tradingSignal.timestamp = new Date().toISOString();
    tradingSignal.inputData = tradingData;
    tradingSignal.aiModel = 'meta-llama/llama-3.1-70b-instruct';

    return NextResponse.json({
      success: true,
      tradingSignal
    });

  } catch (error) {
    console.error('Error generating trading signal:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate trading signal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
