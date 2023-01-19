import { isEmpty, isNil } from 'ramda';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const createSigningMessage = () => `Sign in with Sol and Taxes 

        No password needed.
        
        Clicking "Sign" or "Approve only means you have proved this wallet is owned by you.
        
        This request will not trigger any blockchain transaction or cost any gas fee.`;

export const throwIfHttpError = (response: any) => {
  if (!response.ok) {
    const formattedErrorString = `${response.status} - ${
      response.statusText
    }: ${JSON.stringify(response)}`;
    throw new Error(formattedErrorString);
  }

  return response;
};

export const throwIfGraphqlError = (response: any) => {
  if (response.errors && !isNil(response.errors)) {
    throw new Error(JSON.stringify(response));
  }
  return response;
};

export const readResponseStreamAsJson = (responseStream: any) => {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Body/json
   * https://stackoverflow.com/questions/52252848/how-to-get-response-body-and-response-headers-in-one-block
   *
   * Responses coming from 'fetch' return as a stream.
   * Since the app works in objects, the stream must be read
   * to completion to be converted into an object,
   * and it needs to know what type of data to read the stream as (json).
   */
  return responseStream.json();
};

export const hasuraGraphqlRequest = async <T>(
  query: string,
  variables = {},
  hasuraUrl = '',
  hasuraJwtToken: string
): Promise<T> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${hasuraJwtToken}`
  };

  const body = JSON.stringify({
    query,
    variables: isNil(variables) || isEmpty(variables) ? null : variables
  });

  return await fetch(hasuraUrl, {
    method: 'POST',
    headers,
    body
  })
    .then(throwIfHttpError)
    .then(readResponseStreamAsJson)
    .then(throwIfGraphqlError);
};

/**
 * Svelte action
 *
 * Dispatch event on click outside of node
 * */
export function onClickOutside(node: any) {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('clickoutside', node));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
}

// Svelte action
export function autofocus(el: any) {
  el.focus();
}

export const unixTimestampToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  return date;
};

export const shortenLongWord = (str: string) => {
  return str.length > 15
    ? str.substring(0, 4) + '...' + str.substring(str.length - 3)
    : str;
};

// Intended for wallet addresses
export const shortenLongWordsWithin = (str: string) => {
  const words = str.split(' ');
  const shortWords = words.map((word) =>
    word.length > 15
      ? word.substring(0, 4) + '...' + word.substring(word.length - 3)
      : word
  );
  return shortWords.join(' ');
};

export const lamportsToSol = (lamports: number) => {
  if (!lamports && typeof lamports !== 'number') return '';

  return lamports / LAMPORTS_PER_SOL;
};
