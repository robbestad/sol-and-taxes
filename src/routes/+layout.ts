import { get } from 'svelte/store';
import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';
import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';

export const load = async () => {
  const { adapter, connected, publicKey } = get(walletStore$);

  const isConnected = adapter && connected && !!publicKey;
  // to base58 string (address)
  const walletAddress = publicKey?.toString();
  const shouldFetchData = isConnected && walletAddress;

  if (!shouldFetchData) return {};

  const data = await fetch(`/api/data-initialization`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'wallet-address': walletAddress
    }
  })
    .then(throwIfHttpError)
    .then(readResponseStreamAsJson);

  const userProfile = data?.userProfile || {};
  const transactions = data?.transactions || [];

  return {
    userProfile,
    transactionHistory: transactions
  };
};
