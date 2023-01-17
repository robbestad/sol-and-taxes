import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { HELIUS_API_KEY } from '$env/static/private';

import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';
import { MOCK_PARSED_TRANSACTION_HISTORY_RESPONSE } from './transaction-history.constant';

export const POST = async (event: RequestEvent) => {
  console.log('---helius: ', event.request.json());

  // const url = `https://api.helius.xyz/v0/addresses/CQtTxnRfFYYQm7fvVb91Y8MYHu6P8UhWvxo7KeXe2NP2/transactions?api-key=${HELIUS_API_KEY}&until=2psnMHsmaCzPv9ArG4r6NHuQZQWkVuuViDQd3wfXQgjMjZ7xXMVr8DqJD1rS4XzuWTq1KauMNKGQPbd8t8Na14cw`;
  // const address = `CQtTxnRfFYYQm7fvVb91Y8MYHu6P8UhWvxo7KeXe2NP2`;
  // const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}`;

  // const res = await fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  //   .then(throwIfHttpError)
  //   .then(readResponseStreamAsJson);
  // const res = MOCK_PARSED_TRANSACTION_HISTORY_RESPONSE

  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PARSED_TRANSACTION_HISTORY_RESPONSE);
    }, 1000);
  });

  console.log('server-res: ', res);

  return json(res);
};
