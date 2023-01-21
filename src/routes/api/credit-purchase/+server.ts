import { hasuraGraphqlRequest } from '$lib/shared/shared-utils';
import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';

import { nhost } from '$lib/core/nhost/nhost';
import { appWalletAddress } from '$lib/shared/shared.constant';

import { increaseUserProfileCreditsQuery } from '$lib/shared/shared.graphql';

export const POST = async (event: RequestEvent) => {
  const requestBody = await event.request.json();

  const { payeeAddress = '' } = requestBody;
  const { userProfile, hasuraJwt } = event.locals;
  const { walletAddress } = userProfile || {};

  if (!walletAddress || payeeAddress !== appWalletAddress) {
    throw error(401, 'Invalid');
  }

  const graphqlEndpoint = nhost.graphql.getUrl();

  await hasuraGraphqlRequest(
    increaseUserProfileCreditsQuery,
    {
      walletAddress,
      creditsIncrement: 1000
    },
    graphqlEndpoint,
    hasuraJwt
  );

  return json({ yes: 'ser' });
};
