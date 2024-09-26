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

