import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { PublicKey } from '@solana/web3.js';
import { NHOST_JWT_SECRET } from '$env/static/private';

import { nhost } from '$lib/core/nhost/nhost';
import { hasuraGraphqlRequest } from '$lib/shared/shared-utils';
import { createJwt, createJwtClaims } from '$lib/modules/auth/jwt-utils';
import { HASURA_ROLE } from '$lib/shared/shared.type';

export const POST = async (event: RequestEvent) => {
  const requestBody = await event.request.json();

  const { walletAddress } = requestBody;

  const publicKey = new PublicKey(walletAddress);
  const isVerified = PublicKey.isOnCurve(publicKey);

  if (!isVerified) {
    return error(401, 'Invalid');
  }

  const graphqlEndpoint = nhost.graphql.getUrl();
  const hasuraJwt = createJwt(
    createJwtClaims(walletAddress, HASURA_ROLE.HASURA),
    NHOST_JWT_SECRET
  );

  /**
   * Fetch/check existing user
   */
  let userId = await hasuraGraphqlRequest(
    `
      query FetchUserProfile (
        $walletAddress: String!
      ) {
        userProfileByPk(
          walletAddress: $walletAddress
        ) {
          walletAddress
        }
      }
    `,
    {
      walletAddress
    },
    graphqlEndpoint,
    hasuraJwt
  )
    .then((response: any) => response?.data?.userProfileByPk?.walletAddress)
    .catch((error) => {
      throw error;
    });

  /**
   * Create new user
   */
  if (!userId) {
    userId = await hasuraGraphqlRequest(
      `
        mutation CreateUser ($walletAddress: String!) {
          insertUserProfileOne(
            object: {
              walletAddress: $walletAddress,
              credits: 300
            }
          ) {
            walletAddress
          }
        }
      `,
      {
        walletAddress
      },
      graphqlEndpoint,
      hasuraJwt
    )
      .then((response: any) => response?.data?.insertUserProfileOne?.walletAddress)
      .catch((error) => {
        throw error;
      });
  }

  return json({ userId });
};
