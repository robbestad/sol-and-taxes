import { derived, writable } from 'svelte/store';
import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';
import { DateTime } from 'luxon';

import { unixTimestampToDate } from './shared-utils';

// https://docs.helius.xyz/api-reference/enhanced-transactions-api/parsed-transaction-history
export const transactionHistory$ = writable([] as any);

/**
 * Split transactions into daily blocks based on timestamp
 */
export const transactionHistoryByDay$ = derived(
  transactionHistory$,
  (transactionHistory) => {
    const transactionHistoryByDay = transactionHistory.reduce((acc, transaction) => {
      const date = unixTimestampToDate(transaction.timestamp);
      const luxonDateTime = DateTime.fromISO(date.toISOString());
      const isoDate = luxonDateTime.toISODate();

      const dayBlock = acc.find((block) => {
        return block.isoDate === isoDate;
      });

      if (dayBlock) {
        dayBlock.transactions.push(transaction);
      } else {
        acc.push({
          isoDate,
          transactions: [transaction]
        });
      }

      return acc;
    }, []);

    return transactionHistoryByDay;
  }
);

/**
 * Auth (wallet)
 *
 * @TODO Possibly deprecated
 */
export const isWalletSelectedButNotConnected$ = derived(walletStore$, (walletStore) => {
  const { adapter, connected, connecting, name, publicKey } = walletStore;

  const isSelectedButNotConnected =
    adapter && !connected && !connecting && name && !publicKey;

  return isSelectedButNotConnected;
});

export const isWalletConnected$ = derived(walletStore$, (walletStore) => {
  const { adapter, connected, publicKey } = walletStore;

  const isConnected = adapter && connected && !!publicKey;

  return isConnected;
});

export const walletPublicKey$ = derived(
  walletStore$,
  (walletStore) => walletStore.publicKey
);

export const walletPublicKeyAddress$ = derived(walletStore$, (walletStore) => {
  return walletStore?.publicKey?.toString();
});

/**
 * Auth (user)
 *
 * @TODO Possibly deprecated
 */
export const userJwt$ = writable(null);

export const isAuthenticated$ = derived(
  [userJwt$, isWalletConnected$],
  ([userJwt, isWalletConected]) => {
    return !!userJwt && !!isWalletConected;
  }
);

// Used to auto-disconnect
export const isAuthenticatedButNotConnected$ = derived(
  [userJwt$, isWalletConnected$],
  ([userJwt, isWalletConnected$]) => {
    return !!userJwt && !isWalletConnected$;
  }
);

export const clearStores = () => {
  userJwt$.set(null);
};

/**
 * User
 *
 * @TODO Possibly deprecated
 */
// Includes userProfile
export const user$ = writable(null as any);

export const userId$ = derived(user$, (user) => user?.appUserId);

/**
 * Banners
 */
export const banners$ = writable([] as any);

export const hasBanners$ = derived(banners$, (banners) => {
  return banners.length > 0;
});
