import { PlayerSpotlight } from 'nhl-api-client';
import { name } from '../utils/helpers.js';

export function formatSpotlight(data: PlayerSpotlight[]): string {
  if (data.length === 0) {
    return 'No spotlight players found.';
  }

  return data.map(p => `${name(p.name)} #${p.sweaterNumber} - ${p.teamTriCode} ${p.position}`).join('\n');
}
