import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token parameter is required' },
        { status: 400 }
      );
    }

    // Step 1: Get price feed ID by querying the token
    const priceFeedUrl = `https://hermes.pyth.network/v2/price_feeds?query=${encodeURIComponent(token)}&asset_type=crypto`;
    
    const priceFeedResponse = await fetch(priceFeedUrl);
    
    if (!priceFeedResponse.ok) {
      throw new Error(`Failed to fetch price feeds: ${priceFeedResponse.status}`);
    }

    const priceFeedData = await priceFeedResponse.json();

    if (!priceFeedData || priceFeedData.length === 0) {
      return NextResponse.json({
        success: false,
        error: `No price feed found for token: ${token}`
      }, { status: 404 });
    }

    // Get the first result's ID (as per your requirement)
    const priceId = priceFeedData[0].id;
    const tokenInfo = priceFeedData[0].attributes;

    // Step 2: Get the latest price using the ID
    const priceUpdateUrl = `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43&ids%5B%5D=${priceId}`;
    
    const priceUpdateResponse = await fetch(priceUpdateUrl);
    
    if (!priceUpdateResponse.ok) {
      throw new Error(`Failed to fetch price updates: ${priceUpdateResponse.status}`);
    }

    const priceUpdateData = await priceUpdateResponse.json();

    if (!priceUpdateData.parsed || priceUpdateData.parsed.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No price data available for this token'
      }, { status: 404 });
    }

    // Find the correct price data for our token (not always the first one)
    const priceData = priceUpdateData.parsed.find((item: any) => item.id === priceId);
    
    if (!priceData) {
      console.log('Available price IDs:', priceUpdateData.parsed.map((item: any) => item.id));
      console.log('Looking for price ID:', priceId);
      return NextResponse.json({
        success: false,
        error: `No price data found for token ID: ${priceId}`
      }, { status: 404 });
    }

    console.log(`Found price data for token ${token} with ID: ${priceId}`);
    console.log(`Raw price: ${priceData.price.price}`);
    
    // Calculate the actual price by dividing by 10^8
    const rawPrice = parseInt(priceData.price.price);
    const actualPrice = rawPrice / Math.pow(10, 8);

    // Calculate confidence interval by dividing by 10^8
    const rawConf = parseInt(priceData.price.conf);
    const actualConf = rawConf / Math.pow(10, 8);

    return NextResponse.json({
      success: true,
      token: token.toUpperCase(),
      priceId: priceId,
      tokenInfo: {
        symbol: tokenInfo.display_symbol,
        base: tokenInfo.base,
        description: tokenInfo.description,
        assetType: tokenInfo.asset_type
      },
      priceData: {
        price: actualPrice,
        confidence: actualConf,
        expo: priceData.price.expo,
        publishTime: priceData.price.publish_time,
        formattedPrice: actualPrice.toFixed(2),
        formattedConfidence: actualConf.toFixed(2)
      },
      emaPrice: {
        price: parseInt(priceData.ema_price.price) / Math.pow(10, 8),
        confidence: parseInt(priceData.ema_price.conf) / Math.pow(10, 8),
        expo: priceData.ema_price.expo,
        publishTime: priceData.ema_price.publish_time
      },
      metadata: priceData.metadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching Pyth data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Pyth Network data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Real implementation with @pythnetwork/hermes-client (uncomment when package is installed)
/*
import { HermesClient } from '@pythnetwork/hermes-client';

export async function GET() {
  try {
    const connection = new HermesClient("https://hermes.pyth.network", {});
    
    const priceIds = [
      "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD price id
      "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id
    ];

    // Get price feeds
    const priceFeeds = await connection.getPriceFeeds({
      query: "btc",
      assetType: "crypto",
    });

    // Latest price updates
    const priceUpdates = await connection.getLatestPriceUpdates(priceIds);

    return NextResponse.json({
      success: true,
      priceFeeds,
      priceUpdates,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching Pyth data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Pyth Network data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
*/
