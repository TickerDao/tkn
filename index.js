import { ethers } from 'ethers';
import { Record, Profile } from '@resolverworks/enson';
import { mock_list } from './mock_data';

const graphUrl = `https://query.graph.tkn.xyz/subgraphs/name/tkn/v3`

const rpcs = [
    // 'https://eth-mainnet.g.alchemy.com/v2/9T5n0ljpi0uGhLhyGnQNQ0ZJ8aU9awlQ'
    'https://eth-mainnet.rpc.grove.city/v1/298e23fd'
];

let isMockMode = false;

const providers = rpcs.map(url => new ethers.JsonRpcProvider(url));

const fallbackProvider = new ethers.FallbackProvider(providers);

const resolver = new ethers.Contract('0xe121A6e3a50008EFE9C617214320c2f9fF903411', [
    'function resolve(bytes name, bytes call) external view returns (bytes memory)',
], fallbackProvider);

const iface = new ethers.Interface([
    'function multicall(bytes[] memory calls) returns (bytes[] memory)'
]);

const profile = new Profile();
profile.setText([
    'name', 'avatar', 'url', 'description', 'decimals',
    'twitter', 'github', 'version', 'notice',
    'chainId', 'coinType', 'symbol', 'dweb',
]);
profile.setCoin([
    'eth', 'op', 'arb1', 'avax', 'bnb', 'cro', 'gno', 'matic',
    'near', 'sol', 'trx', 'zil', 'ftm', 'base'
]);
profile.setCoin(0x7f55c959); // sepolia
profile.setCoin(0xa7bc86aa); // degen
profile.chash = true;

function setMockupMode(enabled) {
    isMockMode = enabled;
}

// Updated lookup function to be environment-agnostic
async function lookup(prefix) {
    try {
        if (prefix && !prefix.endsWith('.')) prefix += '.';
        const name = `${prefix}tkn.eth`;
        const calls = profile.makeCallsForName(name);
        const multi = iface.encodeFunctionData('multicall', [calls]);
        const res = await resolver.resolve(ethers.dnsEncode(name, 255), multi, { enableCcipRead: true });
        const [answers] = iface.decodeFunctionResult('multicall', res);
        const record = new Record();
        record.parseCalls(calls, answers);
        return record.toJSON(true);
    } catch (err) {
        console.error(err);
        return { error: err.message };
    }
}

// Updated list function to support mock mode
function list(prefix) {
    if (isMockMode) {
        return mock_list[prefix]; // This is the original implementation
    }

    // Throw error for production list data
    throw new Error('Production list data not yet configured');
}

// Allows the user to perform raw custom graphQL queries
async function graphQuery(query) {
    const response = await fetch(graphUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data;
}

async function lookupBySymbol(symbol) {
    const query = `{
        tokens(where: { symbol: "${symbol}" }) {
            id
            name
            description
            symbol
            avatar
            dweb
            discord
            decimals
            addresses {
                tokenAddress      
                chainID {
                    id
                }
            }
        }
    }`;

    return await graphQuery(query);
}

async function lookupByAddress(address) {
    const query = `{
        addresses(where: {tokenAddress: "${address}"}) {
            addressID
            chainID {
                id
            }
            tokenAddress
            nonEVMAddress
            id
            tokenID {
                avatar
                description
                decimals
                name
                symbol
                tokenSupply
                twitter
            }
        }
    }`;

    return await graphQuery(query);
}

async function lookupBySymbolAndChain(symbol, chainId) {
    const query = `{
        tokens(where: { symbol: "${symbol}", addresses_: { chainID: "${chainId}" } }) {
            id
            name
            description
            symbol
            avatar
            dweb
            discord
            decimals
            addresses(where: { chainID: "${chainId}" }) {
                tokenAddress      
                chainID {
                    id
                }
            }
        }
    }`;

    return await graphQuery(query);
}

const tkn = {
    lookup,
    list,
    setMockupMode,
    graphQuery,
    lookupBySymbol,
    lookupByAddress,
    lookupBySymbolAndChain,
};

export { tkn };