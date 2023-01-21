import { hasuraGraphqlRequest } from '$lib/shared/shared-utils';
import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { HELIUS_API_KEY } from '$env/static/private';

import { nhost } from '$lib/core/nhost/nhost';

import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';
import { MOCK_PARSED_TRANSACTION_HISTORY_RESPONSE } from './transaction-history.constant';
import {
  insertTransactionsQuery,
  mockTransactionsQuery
} from '$lib/shared/shared.graphql';

export const POST = async (event: RequestEvent) => {
  const requestBody = await event.request.json();

  const { address, paginationSignature = '' } = requestBody;
  const { userProfile, hasuraJwt } = event.locals;
  const { walletAddress, credits = 0 } = userProfile || {};

  if (!address || !walletAddress || credits <= 0) {
    throw error(401, 'Invalid');
  }

  /**
   * Types and source query parameter allow only 1 value each, cannot search by multple types/sources.
   */

  /**
   * Production
   */
  // const beforeQuery = paginationSignature ? `&before=${paginationSignature}` : '';
  // const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}${beforeQuery}`;

  // const res = await fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  //   .then(throwIfHttpError)
  //   .then(readResponseStreamAsJson);

  /**
   * Mock
   */
  // const res = (await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(MOCK_PARSED_TRANSACTION_HISTORY_RESPONSE);
  //   }, 1000);
  // })) as any;

  /**
   * Mock with db fetch
   */
  const res = (await hasuraGraphqlRequest(
    mockTransactionsQuery,
    {
      walletAddress
    },
    nhost.graphql.getUrl(),
    hasuraJwt
  )) as any;

  const withWalletAddress = res?.data?.transaction.map((transaction) => {
    return {
      ...transaction,
      walletAddress
    };
  });

  const graphqlEndpoint = nhost.graphql.getUrl();

  const dbResponse = await hasuraGraphqlRequest(
    insertTransactionsQuery,
    {
      walletAddress,
      transactions: withWalletAddress,
      creditsIncrement: 100,
      creditsDecrement: -100
    },
    graphqlEndpoint,
    hasuraJwt
  );

  return json(withWalletAddress);
};
