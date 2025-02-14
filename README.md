# The Token Name Service

The easiest, most unruggable, and comprehensive token data service.

## Installation

```bash
npm install tkn
```

## Usage

```javascript
import { tkn } from 'tkn';

// Lookup token information
const data = await tkn.lookup('eth');
```

## API Reference

### lookup(prefix)
Looks up token information by prefix.
```javascript
const result = await tkn.lookup('eth');
```

### lookupBySymbol(symbol)
Looks up token information by symbol.
```javascript
const result = await tkn.lookupBySymbol('WETH');
```

### lookupByAddress(address)
Looks up token information by contract address.
```javascript
const result = await tkn.lookupByAddress('0x5979D7b546E38E414F7E9822514be443A4800529');
```

### lookupBySymbolAndChain(symbol, chainId)
Looks up token information by symbol and chain ID.
```javascript
const result = await tkn.lookupBySymbolAndChain('USDC', '1'); // For Ethereum mainnet
```

## Response Types

### Token Response
```typescript
{
  id: string;
  name: string;
  description: string;
  symbol: string;
  avatar: string;
  dweb: string;
  discord: string | null;
  decimals: string;
  addresses: Array<{
    tokenAddress: string;
    chainID: {
      id: string;
    }
  }>;
}
```

### Address Response
```typescript
{
  addressID: string | null;
  chainID: {
    id: string;
  };
  tokenAddress: string;
  nonEVMAddress: string | null;
  id: string;
  tokenID: {
    avatar: string;
    description: string;
    decimals: string;
    name: string;
    symbol: string;
    tokenSupply: string | null;
    twitter: string | null;
  };
}
```

---
**Publishing:**   
Update version in `package.json`   
`git commit -m "commit message"`   
`npm login`   
`git tag <v0.1.0 (version label)> <1f2d3a4 (commit sha)>`   
`git push origin --tags`   
`npm publish`   

