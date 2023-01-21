import type { Handle } from '@sveltejs/kit';
import { NHOST_JWT_SECRET, NHOST_WEBHOOK_SECRET } from '$env/static/private';
import { PublicKey } from '@solana/web3.js';

import { createJwt, createJwtClaims } from '$lib/modules/auth/jwt-utils';
import { HASURA_ROLE } from '$lib/shared/shared.type';
import { nhost } from '$lib/core/nhost/nhost';
import { hasuraGraphqlRequest } from '$lib/shared/shared-utils';
import { userProfileQuery } from '$lib/shared/shared.graphql';

export const handle: Handle = async ({ event, resolve }) => {
  /**
   * CORS
   */
  const requestMethod = event.request?.method?.toUpperCase?.() || '';

  if (requestMethod === 'OPTIONS') {
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
    return new Response('{}', {
      status: 204,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
      }
    });
  }

  const isHealthCheck = event.url.pathname.startsWith('/health-check');
  const isApiRequest = event.url.pathname.startsWith('/api');
  const isHasuraWebhookRequest = event.url.pathname.startsWith('/webhooks/hasura');

  /**
   * Health check
   */
  if (isHealthCheck) {
    return new Response('{}', { status: 200 });
  }

  /**
   * Webhook authentication (hasura-only webhooks)
   */
  if (isHasuraWebhookRequest) {
    const hasuraAuthorization =
      event.request?.headers?.get?.('hasura-authorization') || '';

    if (hasuraAuthorization === NHOST_WEBHOOK_SECRET) {
      const hasuraJwt = createJwt(
        createJwtClaims('hasura-cron-trigger', HASURA_ROLE.HASURA),
        NHOST_JWT_SECRET
      );

      event.locals.hasuraJwt = hasuraJwt;
    }
  }

  /**
   * Api authentication
   */
  if (isApiRequest) {
    // Verify
    const walletAddress = event.request?.headers?.get?.('wallet-address') || '';

    if (!walletAddress) {
      throw new Error('Invalid api request');
    }

    const publicKey = new PublicKey(walletAddress);
    const isValidPublicKey = PublicKey.isOnCurve(publicKey);

    if (!isValidPublicKey) {
      throw new Error('Invalid api request');
    }

    // For user-based actions
    const userJwt = createJwt(
      createJwtClaims(walletAddress, HASURA_ROLE.USER),
      NHOST_JWT_SECRET
    );
    // For pseudo-admin actions
    const hasuraJwt = createJwt(
      createJwtClaims(walletAddress, HASURA_ROLE.HASURA),
      NHOST_JWT_SECRET
    );

    /**
     * Fetch/create user
     */
    const graphqlEndpoint = nhost.graphql.getUrl();

    /**
     * Fetch/check existing user
     */
    let existingWalletAddress = await hasuraGraphqlRequest(
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
      .catch((_) => {
        throw new Error('Error fetching existing user');
      });

    /**
     * Create new user
     */
    if (!existingWalletAddress) {
      existingWalletAddress = await hasuraGraphqlRequest(
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
        .catch((_) => {
          throw new Error('Error creating new user');
        });
    }

    // event.locals persists to API endpoints like +server.ts and server page loaders while loaders do not
    event.locals = await hasuraGraphqlRequest(
      userProfileQuery,
      { walletAddress: existingWalletAddress },
      graphqlEndpoint,
      hasuraJwt
    ).then((response: any) => {
      return {
        userProfile: response.data.userProfileByPk,
        userJwt,
        hasuraJwt
      };
    });
  }

  const response = await resolve(event);

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Allow-Methods', '*');

  return response;
};
