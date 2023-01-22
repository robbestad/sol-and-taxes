import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { Connection } from '@solana/web3.js';
import { HELIUS_RPC_URL } from '$env/static/private';

export const GET = async (event: RequestEvent) => {
  const connection = new Connection(HELIUS_RPC_URL);

  const blockhashResponse = await connection.getLatestBlockhash('finalized');

  return json({ blockhashResponse });
};
