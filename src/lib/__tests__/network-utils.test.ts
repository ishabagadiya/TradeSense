// Test file for network utilities (for manual testing)

import { getNetworkInfo, is1inchSupported, getNetworkStatusMessage } from '../network-utils';
import { get0GNetworkInfo, isOn0GNetwork } from '../wallet-network-utils';

// Test 0G Mainnet
console.log('Testing 0G Mainnet (1661):');
console.log('Network Info:', getNetworkInfo(1661));
console.log('1inch Supported:', is1inchSupported(1661));
console.log('Status Message:', getNetworkStatusMessage(1661));
console.log('0G Info:', get0GNetworkInfo(1661));
console.log('Is 0G Network:', isOn0GNetwork(1661));
console.log('---');

// Test 0G Testnet
console.log('Testing 0G Testnet (16602):');
console.log('Network Info:', getNetworkInfo(16602));
console.log('1inch Supported:', is1inchSupported(16602));
console.log('Status Message:', getNetworkStatusMessage(16602));
console.log('0G Info:', get0GNetworkInfo(16602));
console.log('Is 0G Network:', isOn0GNetwork(16602));
console.log('---');

// Test Ethereum
console.log('Testing Ethereum (1):');
console.log('Network Info:', getNetworkInfo(1));
console.log('1inch Supported:', is1inchSupported(1));
console.log('Status Message:', getNetworkStatusMessage(1));
console.log('0G Info:', get0GNetworkInfo(1));
console.log('Is 0G Network:', isOn0GNetwork(1));

export {};
