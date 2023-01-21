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
 * Not really a mock but serves as a mock.
 */
export const mockTransactionsQuery = `
  query FetchUserTransactions ($walletAddress: String!) {
    transaction(
      where: {
        walletAddress: {_eq: $walletAddress}
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
export const insertTransactionsQuery = `
  mutation InsertTransactions (
    $walletAddress: String!,
    $transactions: [transaction_insert_input!]!,
    $creditsIncrement: Int,
    $creditsDecrement: Int,
  ) {
    insertTransaction(
      objects: $transactions, 
      on_conflict: {
        constraint: transaction_pkey, 
        update_columns: []
      }
    ) {
      returning {
        ${transactionFields}
      }
    }
    updateUserProfileByPk(
      pk_columns: {walletAddress: $walletAddress},
      _inc: {
        credits: $creditsDecrement, 
        creditsUsed: $creditsIncrement
      }
    ) {
      ${userProfileFields}
    }
  }
`;

export const increaseUserProfileCreditsQuery = `
  mutation IncreaseUserProfileCredits (
    $walletAddress: String!,
    $creditsIncrement: Int
  ) {
    updateUserProfileByPk(
      pk_columns: {walletAddress: $walletAddress},
      _inc: {
        credits: $creditsIncrement
      }
    ) {
      ${userProfileFields}
    }
  }
`;
