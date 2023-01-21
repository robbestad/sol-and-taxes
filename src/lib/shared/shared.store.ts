import { DateTime } from 'luxon';
import { derived, writable } from 'svelte/store';

import { unixTimestampToDate } from './shared-utils';

// https://docs.helius.xyz/api-reference/enhanced-transactions-api/parsed-transaction-history
export const transactionHistory$ = writable([] as any);

export const hasTransactionHistory$ = derived(
  transactionHistory$,
  (transactionHistory) => {
    return transactionHistory.length > 0;
  }
);

/**
 * Split transactions into daily blocks based on timestamp
 */
export const transactionHistoryByDay$ = derived(
  transactionHistory$,
  (transactionHistory) => {
    const transactionHistoryByDay = transactionHistory.reduce((acc, transaction) => {
      const date = unixTimestampToDate(transaction.timestamp);
      const isoDate = DateTime.fromISO(date.toISOString()).toISODate();

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
 * Banners
 */
export const banners$ = writable([] as any);

export const hasBanners$ = derived(banners$, (banners) => {
  return banners.length > 0;
});
