import { NHLClient } from 'nhl-api-client';

let client: NHLClient | null = null;

export function getClient(): NHLClient {
  if (!client) {
    client = new NHLClient();
  }
  return client;
}
