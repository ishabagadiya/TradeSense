// Debug function to test the external proxy
export async function debugProxy() {
  console.log('🔍 Starting proxy debug...');
  
  const testUrls = [
    'https://1inch-proxy-alpha.vercel.app/',
    'https://1inch-proxy-alpha.vercel.app/fusion/quoter/v2.0/1/healthcheck',
    'https://1inch-proxy-alpha.vercel.app/fusion/quoter/v2.0/1/quote/receive?fromTokenAddress=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=100000&walletAddress=0x0000000000000000000000000000000000000000&enableEstimate=false&fee=100'
  ];

  for (const url of testUrls) {
    console.log(`\n🌐 Testing: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));

      let responseText;
      try {
        responseText = await response.text();
        console.log(`📄 Response:`, responseText);
        
        // Try to parse as JSON
        try {
          const jsonData = JSON.parse(responseText);
          console.log(`📊 Parsed JSON:`, jsonData);
        } catch {
          console.log(`⚠️ Response is not valid JSON`);
        }
      } catch (error) {
        console.error(`❌ Error reading response:`, error);
      }

    } catch (error) {
      console.error(`❌ Request failed:`, error);
    }
  }
  
  console.log('\n🏁 Proxy debug completed');
}

// Auto-run debug on module load (for testing)
if (typeof window !== 'undefined') {
  (window as any).debugProxy = debugProxy;
  console.log('🔧 Debug function available: window.debugProxy()');
}
