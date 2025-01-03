import { tkn } from '../index';  // Adjust the path as necessary

// describe('tkn.lookup', () => {
//   it('should fetch data for "frame"', async () => {
//     const result = await tkn.lookup('eth');
//     expect(result).toBeDefined();
//     console.log(result);
//     expect(result.name).toEqual('Ethereum');
//     console.log(result);
//   });
// });

describe('tkn.list', () => {
  // it('should fetch data for the handle "aerodrome"', async () => {
  //   const list = await tkn.list('aerodrome');
  //   expect(list).toBeDefined();
  //   expect(list.name).toEqual('Aerodrome');
  //   console.log(list);
  // });

  it('should fetch mockup data for the handle "aerodrome"', async () => {
    tkn.setMockupMode(true);
    const list = await tkn.list('aerodrome');
    expect(list).toBeDefined();
    expect(list.name).toEqual('Aerodrome');
    console.log(list);
  });
});

describe('tkn.graphQuery', () => {
  it('should fetch data from the GraphQL endpoint', async () => {
    const query = `
      {
        tokens(first: 5) {
          id
          name
          symbol
          decimals
        }
      }
    `;

    const result = await tkn.graphQuery(query);

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.tokens).toBeDefined();
    
    // Check if tokens is an array and has elements
    expect(Array.isArray(result.data.tokens)).toBe(true);
    expect(result.data.tokens.length).toBeGreaterThan(0);

    // Check the structure of the first token
    const firstToken = result.data.tokens[0];
    expect(firstToken).toHaveProperty('id');
    expect(firstToken).toHaveProperty('name');
    expect(firstToken).toHaveProperty('symbol');
    expect(firstToken).toHaveProperty('decimals');

    console.log(JSON.stringify(result, null, 2));
  });
});

describe('tkn.lookupBySymbol', () => {
  it('should fetch token data for WETH symbol', async () => {
    const result = await tkn.lookupBySymbol('WETH');
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.tokens).toBeDefined();
    expect(Array.isArray(result.data.tokens)).toBe(true);
    expect(result.data.tokens.length).toBeGreaterThan(0);
    
    const token = result.data.tokens[0];
    // Check exact structure and some key values
    expect(token).toEqual(expect.objectContaining({
      id: expect.any(String),
      name: 'Wrapped Ether',
      description: 'ETH in an ERC20 compatible wrapper',
      symbol: 'WETH',
      avatar: expect.stringContaining('https://gateway.tkn.xyz/ipfs/'),
      dweb: expect.stringContaining('ipfs://'),
      decimals: '18',
      addresses: expect.arrayContaining([
        expect.objectContaining({
          tokenAddress: expect.any(String),
          chainID: expect.objectContaining({
            id: expect.any(String)
          })
        })
      ])
    }));

    // Verify at least one known address exists
    const mainnetAddress = token.addresses.find(addr => addr.chainID.id === '1');
    expect(mainnetAddress).toBeDefined();
    expect(mainnetAddress.tokenAddress).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');

    console.log('WETH Token Data:', JSON.stringify(result, null, 2));
  });
});

describe('tkn.lookupByAddress', () => {
  it('should fetch token data for WSTETH address', async () => {
    const address = '0x5979D7b546E38E414F7E9822514be443A4800529';
    const result = await tkn.lookupByAddress(address);
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.addresses).toBeDefined();
    expect(Array.isArray(result.data.addresses)).toBe(true);
    expect(result.data.addresses.length).toBeGreaterThan(0);
    
    const tokenData = result.data.addresses[0];
    // Check exact structure and values
    expect(tokenData).toEqual(expect.objectContaining({
      addressID: null,
      chainID: {
        id: '42161'
      },
      tokenAddress: '0x5979D7b546E38E414F7E9822514be443A4800529',
      nonEVMAddress: null,
      id: expect.any(String),
      tokenID: {
        avatar: expect.stringContaining('https://gateway.tkn.xyz/ipfs/'),
        description: 'Wrapped stETH which rebases with Lido staking rewards',
        decimals: '18',
        name: 'Wrapped stETH',
        symbol: 'WSTETH',
        tokenSupply: null,
        twitter: 'LidoFinance'
      }
    }));

    console.log('Token Address Data:', JSON.stringify(result, null, 2));
  });
});

describe('tkn.lookupBySymbolAndChain', () => {
    it('should return token data for valid symbol and chain ID', async () => {
        const result = await tkn.lookupBySymbolAndChain('USDC', '1');
        
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('tokens');
        expect(Array.isArray(result.data.tokens)).toBe(true);
        
        if (result.data.tokens.length > 0) {
            const token = result.data.tokens[0];
            expect(token).toHaveProperty('symbol', 'USDC');
            expect(token).toHaveProperty('addresses');
            expect(Array.isArray(token.addresses)).toBe(true);
            
            const address = token.addresses[0];
            expect(address).toHaveProperty('chainID');
            expect(address.chainID).toHaveProperty('id', '1');
        }
    });

    it('should return empty tokens array for non-existent symbol', async () => {
        const result = await tkn.lookupBySymbolAndChain('NONEXISTENT123', '1');
        
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('tokens');
        expect(Array.isArray(result.data.tokens)).toBe(true);
        expect(result.data.tokens).toHaveLength(0);
    });

    it('should return empty tokens array for non-existent chain ID', async () => {
        const result = await tkn.lookupBySymbolAndChain('USDC', '999999');
        
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('tokens');
        expect(Array.isArray(result.data.tokens)).toBe(true);
        expect(result.data.tokens).toHaveLength(0);
    });

    it('should handle invalid chain ID format', async () => {
        const result = await tkn.lookupBySymbolAndChain('USDC', 'invalid-chain');
        
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('tokens');
        expect(Array.isArray(result.data.tokens)).toBe(true);
        expect(result.data.tokens).toHaveLength(0);
    });

    it('should return token data with all expected fields', async () => {
        const result = await tkn.lookupBySymbolAndChain('USDC', '1');
        
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('tokens');
        
        if (result.data.tokens.length > 0) {
            const token = result.data.tokens[0];
            const expectedKeys = [
                'id',
                'name',
                'description',
                'symbol',
                'avatar',
                'dweb',
                'discord',
                'decimals',
                'addresses'
            ];
            expectedKeys.forEach(key => {
                expect(token).toHaveProperty(key);
            });

            const address = token.addresses[0];
            expect(address).toHaveProperty('tokenAddress');
            expect(address).toHaveProperty('chainID');
        }
    });
});

