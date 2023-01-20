import type { RequestEvent } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import bs58 from 'bs58';
import { sign } from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import { NHOST_JWT_SECRET } from '$env/static/private';

import { nhost } from '$lib/core/nhost/nhost';
import { createSigningMessage, hasuraGraphqlRequest } from '$lib/shared/shared-utils';
import { createJwt, createJwtClaims } from '$lib/modules/auth/jwt-utils';
import { HASURA_ROLE } from '$lib/shared/shared.type';

// import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';

export const POST = async (event: RequestEvent) => {
  const requestBody = await event.request.json();

  const { walletAddress } = requestBody;

  const publicKey = new PublicKey(walletAddress);
  const signature = bs58.decode(requestBody.encodedSignature);
  const message = new TextEncoder().encode(createSigningMessage());

  // @TODO - add a nonce
  const isVerified = sign.detached.verify(message, signature, publicKey.toBytes());

  if (!isVerified) {
    return error(401, 'Invalid signature');
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
        userProfile(where: {walletAddress: {_eq: $walletAddress}}) {
          userId
          walletAddress
          credits
        }
      }
    `,
    {
      walletAddress
    },
    graphqlEndpoint,
    hasuraJwt
  )
    .then((response: any) => response?.data?.userProfile?.[0]?.userId)
    .catch((error) => {
      throw error;
    });

  // return json(res);
  return new Response();
};
