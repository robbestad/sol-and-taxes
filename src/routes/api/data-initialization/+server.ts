import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';

import { nhost } from '$lib/core/nhost/nhost';
import { hasuraGraphqlRequest } from '$lib/shared/shared-utils';
import { userTransactionsQuery } from '$lib/shared/shared.graphql';

export const GET = async (event: RequestEvent) => {
  const { userProfile, userJwt } = event.locals;

  if (!userProfile?.walletAddress || !userJwt) throw error(401, 'Invalid');

  const graphqlEndpoint = nhost.graphql.getUrl();

  const transactions = await hasuraGraphqlRequest(
    userTransactionsQuery,
    {
      walletAddress: userProfile.walletAddress
    },
    graphqlEndpoint,
    userJwt
  ).then((res: any) => res?.data?.transaction);

  return json({
    userProfile,
    transactions
  });
};
