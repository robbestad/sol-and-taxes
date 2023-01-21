export const userProfileFields = `
walletAddress
credits
creditsUsed
createdAt
updatedAt
`;

export const userSettingsFields = `
walletAddress
`;

export const transactionFields = `
walletAddress
signature
description
type
source
fee
feePayer
slot
timestamp
nativeTransfers
tokenTransfers
accountData
transactionError
instructions
events
`;

/**
 * //////////////////////////////////////////////////////////
 * QUERIES ==================================================
 * //////////////////////////////////////////////////////////
 */
export const userProfileQuery = `
  query FetchUserProfile ($walletAddress: String!) {
    userProfileByPk(walletAddress: $walletAddress) {
      ${userProfileFields}
    }
  }
`;

export const userTransactionsQuery = `
  query FetchUserTransactions ($walletAddress: String!) {
    transaction(
      where: {
        walletAddress: {
          _eq: $walletAddress
        }
      }
    ) {
      ${transactionFields}
    }
  }
`;

/**
 * //////////////////////////////////////////////////////////
 * MUTATIONS ================================================
 * //////////////////////////////////////////////////////////
 */
