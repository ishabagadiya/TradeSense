// Enhanced error handling for swap operations

export interface SwapError {
  code: string;
  message: string;
  userMessage: string;
  action: 'retry' | 'switch_network' | 'demo' | 'contact_support';
  details?: any;
}

export function handleSwapError(error: any, chainId: number): SwapError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  const lowerMessage = errorMessage.toLowerCase();

  // 0G Network specific handling
  if (chainId === 1661 || chainId === 16602) {
    const networkName = chainId === 1661 ? '0G Mainnet' : '0G Newton Testnet';
    return {
      code: 'OG_NETWORK_DETECTED',
      message: errorMessage,
      userMessage: `You're on ${networkName}. 1inch swaps are not available, continuing in demo mode.`,
      action: 'demo',
      details: { chainId, networkName }
    };
  }

  // Network-specific errors
  if (lowerMessage.includes('404') || lowerMessage.includes('not found')) {
    return {
      code: 'NETWORK_NOT_SUPPORTED',
      message: errorMessage,
      userMessage: `1inch doesn't support this network (Chain ID: ${chainId}). Switching to demo mode.`,
      action: 'demo',
      details: { chainId, supportedChains: [1, 10, 42161, 8453, 137, 56] }
    };
  }

  // API errors
  if (lowerMessage.includes('allowance check failed')) {
    return {
      code: 'ALLOWANCE_CHECK_FAILED',
      message: errorMessage,
      userMessage: 'Unable to check token allowance. This network may not be supported by 1inch.',
      action: 'demo',
      details: { chainId }
    };
  }

  // Rate limiting
  if (lowerMessage.includes('rate limit') || lowerMessage.includes('429')) {
    return {
      code: 'RATE_LIMITED',
      message: errorMessage,
      userMessage: 'API rate limit exceeded. Please wait a moment and try again.',
      action: 'retry',
      details: { retryAfter: 60 }
    };
  }

  // Insufficient funds
  if (lowerMessage.includes('insufficient') || lowerMessage.includes('balance')) {
    return {
      code: 'INSUFFICIENT_FUNDS',
      message: errorMessage,
      userMessage: 'Insufficient balance to complete the swap.',
      action: 'contact_support',
      details: { chainId }
    };
  }

  // Network connectivity
  if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('timeout')) {
    return {
      code: 'NETWORK_ERROR',
      message: errorMessage,
      userMessage: 'Network connection issue. Please check your connection and try again.',
      action: 'retry',
      details: { chainId }
    };
  }

  // Token not found
  if (lowerMessage.includes('token') && (lowerMessage.includes('not found') || lowerMessage.includes('invalid'))) {
    return {
      code: 'INVALID_TOKEN',
      message: errorMessage,
      userMessage: 'Token not supported on this network. Switching to demo mode.',
      action: 'demo',
      details: { chainId }
    };
  }

  // Slippage too high
  if (lowerMessage.includes('slippage')) {
    return {
      code: 'SLIPPAGE_TOO_HIGH',
      message: errorMessage,
      userMessage: 'Price impact too high. Try a smaller amount or increase slippage tolerance.',
      action: 'retry',
      details: { chainId }
    };
  }

  // Generic fallback
  return {
    code: 'UNKNOWN_ERROR',
    message: errorMessage,
    userMessage: 'Swap failed. Switching to demo mode to continue.',
    action: 'demo',
    details: { originalError: error, chainId }
  };
}

export function getErrorActionMessage(action: SwapError['action']): string {
  switch (action) {
    case 'retry':
      return 'You can try again in a moment.';
    case 'switch_network':
      return 'Switch to a supported network for real swaps.';
    case 'demo':
      return 'Continuing in demo mode.';
    case 'contact_support':
      return 'Please contact support if this issue persists.';
    default:
      return '';
  }
}

export function shouldFallbackToDemo(error: SwapError): boolean {
  return ['NETWORK_NOT_SUPPORTED', 'ALLOWANCE_CHECK_FAILED', 'INVALID_TOKEN', 'UNKNOWN_ERROR', 'OG_NETWORK_DETECTED'].includes(error.code);
}

export function isRetryableError(error: SwapError): boolean {
  return ['RATE_LIMITED', 'NETWORK_ERROR', 'SLIPPAGE_TOO_HIGH'].includes(error.code);
}
