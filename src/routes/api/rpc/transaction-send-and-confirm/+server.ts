import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { Connection } from '@solana/web3.js';
import { HELIUS_RPC_URL } from '$env/static/private';

export const POST = async (event: RequestEvent) => {
  const requestBody = await event.request.json();

  const { signedSerialized, blockhashResponse } = requestBody;

  const connection = new Connection(HELIUS_RPC_URL);

  const signature = await connection.sendRawTransaction(signedSerialized);
  const confirmed = await connection.confirmTransaction({
    blockhash: blockhashResponse.blockhash,
    lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
    signature: signature
  });

  return json({ confirmed });
};
