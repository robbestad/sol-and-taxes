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
export const userDataQuery = `
  query FetchUserData ($walletAddress: String!) {
    userProfileByPk(walletAddress: $walletAddress) {
      ${userProfileFields}
    }
    
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
