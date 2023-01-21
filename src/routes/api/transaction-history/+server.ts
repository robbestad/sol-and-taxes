import { hasuraGraphqlRequest } from '$lib/shared/shared-utils';
import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
// import { HELIUS_API_KEY } from '$env/static/private';

import { nhost } from '$lib/core/nhost/nhost';

// import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';
import { MOCK_PARSED_TRANSACTION_HISTORY_RESPONSE } from './transaction-history.constant';
import { insertTransactions } from '$lib/shared/shared.graphql';

export const POST = async (event: RequestEvent) => {
  const requestBody = await event.request.json();

  const { address, paginationSignature = '' } = requestBody;
  const { userProfile, hasuraJwt } = event.locals;
  const { walletAddress, credits = 0 } = userProfile || {};

  if (!address || !walletAddress || credits < 100) {
    throw error(401, 'Invalid');
  }

  /**
   * Types and source query parameter allow only 1 value each, cannot search by multple types/sources.
   */
  const beforeQuery = paginationSignature ? `&before=${paginationSignature}` : '';
  // const url = `https://api.helius.xyz/v0/addresses/CQtTxnRfFYYQm7fvVb91Y8MYHu6P8UhWvxo7KeXe2NP2/transactions?api-key=${HELIUS_API_KEY}&until=2psnMHsmaCzPv9ArG4r6NHuQZQWkVuuViDQd3wfXQgjMjZ7xXMVr8DqJD1rS4XzuWTq1KauMNKGQPbd8t8Na14cw`;
  // const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}${beforeQuery}`;

  // console.log('url: ', url);

  // const res = await fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  //   .then(throwIfHttpError)
  //   .then(readResponseStreamAsJson);

  // console.log('res: ', res);

  const res = (await new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PARSED_TRANSACTION_HISTORY_RESPONSE);
    }, 1000);
  })) as any;

  const theRes = res.map((transaction) => {
    return {
      ...transaction,
      walletAddress
    };
  });

  const graphqlEndpoint = nhost.graphql.getUrl();

  const dbResponse = await hasuraGraphqlRequest(
    insertTransactions,
    {
      walletAddress,
      transactions: theRes,
      creditsIncrement: 100,
      creditsDecrement: -100
    },
    graphqlEndpoint,
    hasuraJwt
  );

  console.log('dbResponse: ', dbResponse);

  return json(theRes);
};
