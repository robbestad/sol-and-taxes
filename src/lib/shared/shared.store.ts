import { derived, writable } from 'svelte/store';
import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';

/**
 * Auth (wallet)
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
