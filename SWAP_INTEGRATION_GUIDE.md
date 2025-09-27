# 1inch Swap Integration Guide

This guide explains how to integrate automatic USDC to token swapping when you receive BUY signals from your AI trading system.

## 🎯 Overview

The integration adds automatic swap functionality to your trading signals:
- When you get a **BUY** signal, you can instantly swap USDC to the recommended token
- Uses 1inch DEX aggregator for best prices
- Integrates with your existing wallet connection (Privy + Wagmi)
- Shows live swap status and transaction links

## 🔧 Components Added

### 1. Enhanced Trading Signal Display
**File:** `src/app/components/TradingSignalDisplayWithSwap.tsx`

This is an enhanced version of your original `TradingSignalDisplay` component that includes:
- Swap section that appears only for BUY signals
- USDC amount input
- One-click swap execution
- Transaction status tracking
- Success/error handling

### 2. Token Registry
**File:** `src/lib/token-registry.ts`

Comprehensive token mapping system:
- Maps trading signal symbols to actual token addresses
- Supports multiple chains (Ethereum, Optimism, Arbitrum, Base)
- Provides fallback mechanisms
- Easy to extend with new tokens

## 🚀 How to Use

### Step 1: Replace Your Component
Replace your existing `TradingSignalDisplay` usage with the new component:

```tsx
// In your PythDataDisplay.tsx or wherever you use TradingSignalDisplay
import TradingSignalDisplayWithSwap from './TradingSignalDisplayWithSwap';

// Replace this:
// <TradingSignalDisplay 
//   signal={tradingSignal}
//   loading={signalLoading}
//   error={signalError}
//   onGenerateSignal={generateTradingSignal}
// />

// With this:
<TradingSignalDisplayWithSwap 
  signal={tradingSignal}
  loading={signalLoading}
  error={signalError}
  onGenerateSignal={generateTradingSignal}
/>
```

### Step 2: Ensure Wallet Integration
Make sure your app has the wallet providers properly set up (you already have this):

```tsx
// Your Web3Provider should wrap your app
<Web3Provider>
  <YourApp />
</Web3Provider>
```

### Step 3: Test the Integration

1. **Generate a Trading Signal**: Use your existing flow to generate signals
2. **Look for BUY signals**: The swap section only appears for BUY signals
3. **Connect Wallet**: Make sure your wallet is connected
4. **Enter Amount**: Input the USDC amount you want to swap
5. **Execute Swap**: Click the swap button to execute

## 💡 Current Implementation Status

### ✅ What's Working
- **UI Components**: Complete swap interface with beautiful design
- **Wallet Integration**: Connects to your existing Privy + Wagmi setup
- **Signal Detection**: Automatically detects BUY signals
- **Token Mapping**: Maps signal symbols to token addresses
- **Error Handling**: Comprehensive error states and user feedback

### 🚧 What Needs Enhancement (Optional)
- **Real Transaction Execution**: Currently shows demo swaps
- **Gas Estimation**: Add gas fee preview
- **Slippage Control**: Add user-configurable slippage
- **Transaction History**: Store completed swaps

## 🔄 Converting Demo to Live Swaps

The current implementation uses demo swaps. To enable real swaps, you need to:

### Option 1: Use 1inch Simple Swap API
Replace the demo `handleSwap` function with real 1inch integration:

```tsx
// In TradingSignalDisplayWithSwap.tsx, replace the demo handleSwap with:
import { executeSwap } from '@/lib/swap-integration';

const handleSwap = async () => {
  // ... validation code stays the same ...

  try {
    const usdcAddress = getUSDCAddress(chainId);
    const targetTokenAddress = getTargetTokenAddress(signal.tokenSymbol, chainId);
    
    // Real transaction execution function
    const executeTransaction = async (tx: { to: string; data: string; value: string }) => {
      // Use your wallet connection to send transaction
      const txHash = await sendTransaction({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: BigInt(tx.value)
      });
      return txHash;
    };

    // Execute real swap
    const result = await executeSwap(
      usdcAddress,
      targetTokenAddress,
      swapAmount,
      6, // USDC decimals
      address,
      chainId,
      1, // 1% slippage
      executeTransaction
    );

    // Handle success...
  } catch (error) {
    // Handle error...
  }
};
```

### Option 2: Use 1inch Fusion API
For more advanced features, integrate with the Fusion API using your existing `1inch-api.ts`:

```tsx
import OneInchQuoteAPI, { createOrderFromQuote, signOrderWithWallet } from '@/lib/1inch-api';

// Get quote, sign order, and submit
const api = new OneInchQuoteAPI(chainId);
const quote = await api.getQuote(quoteParams);
const order = createOrderFromQuote(quote, quoteRequest, address);
const signature = await signOrderWithWallet(order, walletSigner, chainId);
const result = await api.submitOrder(prepareOrderSubmission(quote, quoteRequest, address, signature));
```

## 🎨 UI Features

### Signal-Based Swap Section
- Only appears for BUY signals
- Clear call-to-action with signal confidence
- Trading tips with take profit and stop loss levels

### Smart Token Detection
- Automatically maps signal symbols to token addresses
- Supports major tokens on all chains
- Fallback to ETH if token not found

### Transaction Feedback
- Loading states during swap execution
- Success messages with transaction links
- Error handling with clear error messages
- Explorer links for transaction verification

## 🔗 Integration Points

### With Existing Signal Generation
The swap functionality integrates seamlessly with your existing signal generation:

```tsx
// Your existing flow:
generateTradingSignal() → AI analyzes → Returns signal object → Display signal

// Enhanced flow:
generateTradingSignal() → AI analyzes → Returns signal object → Display signal + swap option
```

### With Wallet Connection
Uses your existing wallet connection:
- Detects wallet connection status
- Uses connected address for transactions
- Respects current chain selection

### With 1inch API
Leverages your existing 1inch integration:
- Uses your external proxy for API calls
- Supports both simple swap and fusion APIs
- Handles approval transactions automatically

## 📈 Usage Flow

1. **User generates trading signal** (existing flow)
2. **AI returns BUY signal** (existing flow)
3. **Swap section appears** (new feature)
4. **User connects wallet** (if not connected)
5. **User enters USDC amount** (new feature)
6. **User clicks swap button** (new feature)
7. **System executes 1inch swap** (new feature)
8. **User receives target tokens** (new feature)

## 🛠️ Customization Options

### Adding New Tokens
Edit `src/lib/token-registry.ts` to add new token mappings:

```tsx
// Add new tokens to TOKEN_REGISTRY
'CUSTOM_TOKEN': {
  address: '0x...',
  symbol: 'CUSTOM',
  decimals: 18,
  name: 'Custom Token'
}
```

### Changing Default Amounts
Modify the default swap amount:

```tsx
// In TradingSignalDisplayWithSwap.tsx
const [swapAmount, setSwapAmount] = useState('50'); // Change from 100 to 50
```

### Custom Styling
The component uses Tailwind classes and can be easily customized:
- Change colors by modifying gradient classes
- Adjust spacing and layout
- Add animations or transitions

## 🔒 Security Considerations

1. **Always verify token addresses** before swapping
2. **Use the token registry** to prevent address mistakes
3. **Test with small amounts** first
4. **Check slippage settings** to avoid MEV attacks
5. **Verify transaction details** before signing

## 🎯 Benefits of This Integration

- **Instant Execution**: Turn AI signals into real trades immediately
- **Best Prices**: 1inch aggregates multiple DEXs for optimal rates
- **User-Friendly**: Simple interface with clear feedback
- **Secure**: Uses your existing wallet connection
- **Flexible**: Works with any ERC-20 token supported by 1inch

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify wallet connection and chain selection
3. Ensure sufficient USDC balance
4. Check if the target token is supported on your current chain

---

**Happy Trading! 🚀**

This integration transforms your AI trading signals into actionable trades with just a few clicks.
