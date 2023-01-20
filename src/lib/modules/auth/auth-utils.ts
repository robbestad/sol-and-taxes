import { HASURA_ROLE } from '$lib/shared/shared.type';

import { get } from 'svelte/store';

import bs58 from 'bs58';
import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';

import { nhost } from '$lib/core/nhost/nhost';
import {
  createSigningMessage,
  hasuraGraphqlRequest,
  readResponseStreamAsJson,
  throwIfHttpError
} from '$lib/shared/shared-utils';
import {
  user$,
  userJwt$,
  walletPublicKey$,
  walletPublicKeyAddress$
} from '$lib/shared/shared.store';

const authenticate = async (walletAddress: string, encodedSignature: string) => {
  const authResponse = await fetch(`/api/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      walletAddress,
      encodedSignature
    })
  })
    .then(throwIfHttpError)
    .then(readResponseStreamAsJson);

  return authResponse;
};

export const signIn = async () => {
  const message = new TextEncoder().encode(createSigningMessage());

  const publicKey = get(walletPublicKey$);
  const signature = await get(walletStore$)?.signMessage?.(message);
  const graphqlUrl = nhost.graphql.getUrl();
  const walletAddress = get(walletPublicKeyAddress$);

  if (signature && publicKey) {
    // Encoded for easy http transport
    const encodedSignature = bs58.encode(signature);

    const userJwt = await authenticate(publicKey.toString(), encodedSignature)
      .then((response) => response?.userJwt)
      .catch(throwIfHttpError);

    if (!userJwt) {
      return;
    }

    // const response = (await hasuraGraphqlRequest(
    //   userDataQuery,
    //   {
    //     walletAddress
    //   },
    //   graphqlUrl,
    //   userJwt
    // )) as any;

    const user = {
      yes: 'ser'
    };

    userJwt$.set(userJwt);
    user$.set(user);

    return userJwt;
  }
};
