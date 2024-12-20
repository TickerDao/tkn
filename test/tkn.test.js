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
  it('should fetch and verify lists data', async () => {
    const query = `{
      lists(where: {hash: "test"}) {
        id
        name
        hash
        tokenIds
      }
    }`;
    const result = await tkn.graphQuery(query);
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.lists).toBeDefined();
    expect(Array.isArray(result.data.lists)).toBe(true);
  });

  it('should fetch and verify sublists data', async () => {
    const query = `{
      sublists(where: {name: ""}) {
        owner
        name
        id
        listHash
        description
      }
    }`;
    const result = await tkn.graphQuery(query);
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.sublists).toBeDefined();
    expect(Array.isArray(result.data.sublists)).toBe(true);
  });

  it('should fetch and verify tokens data', async () => {
    const query = `{
      tokens(where: {symbol: "ETH"}) {
        id
        name
        symbol
        addresses {
          address
          chainID {
            id
          }
        }
      }
    }`;
    const result = await tkn.graphQuery(query);
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.tokens).toBeDefined();
    expect(Array.isArray(result.data.tokens)).toBe(true);

    if (result.data.tokens.length > 0) {
      const token = result.data.tokens[0];
      expect(token).toHaveProperty('id');
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('symbol');
      expect(token).toHaveProperty('addresses');
      expect(Array.isArray(token.addresses)).toBe(true);
    }
  });

  it('should fetch and verify addresses data', async () => {
    const query = `{
      addresses(where: {chainID_: {id: "1"}}) {
        address
        id
        nonEVMAddress
        tokenId {
          id
          symbol
        }
        chainID {
          id
        }
      }
    }`;
    const result = await tkn.graphQuery(query);
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.addresses).toBeDefined();
    expect(Array.isArray(result.data.addresses)).toBe(true);

    if (result.data.addresses.length > 0) {
      const address = result.data.addresses[0];
      expect(address).toHaveProperty('address');
      expect(address).toHaveProperty('id');
      expect(address).toHaveProperty('tokenId');
      expect(address).toHaveProperty('chainID');
    }
  });
});

