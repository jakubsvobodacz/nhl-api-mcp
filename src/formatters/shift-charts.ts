import { table } from '../utils/helpers.js';

export function formatShiftCharts(shifts: any[]): string {
  if (!shifts.length) return 'No shift data found';

  const lines: string[] = ['NHL Shift Charts\n'];

  // Group by player
  const byPlayer = new Map<number, any[]>();
  for (const shift of shifts) {
    const pid = shift.playerId;
    if (!byPlayer.has(pid)) byPlayer.set(pid, []);
    byPlayer.get(pid)!.push(shift);
  }

  // Process each player
  for (const [playerId, playerShifts] of byPlayer) {
    const first = playerShifts[0];
    const playerName = `${first.firstName} ${first.lastName}`;
    const team = first.teamAbbrev || first.teamName;
    lines.push(`\n${playerName} (${team}) - ${playerShifts.length} shifts`);

    const headers = ['#', 'Period', 'Start', 'End', 'Duration', 'Event'];
    const rows = playerShifts.map(s => [
      String(s.shiftNumber || ''),
      String(s.period || ''),
      s.startTime || '',
      s.endTime || '',
      s.duration || '',
      s.eventDescription || '',
    ]);

    lines.push(table(headers, rows));

    // Calculate total TOI
    const totalSeconds = playerShifts.reduce((sum, s) => {
      if (!s.duration) return sum;
      const [min, sec] = s.duration.split(':').map(Number);
      return sum + (min * 60) + sec;
    }, 0);
    const toi = `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
    lines.push(`Total TOI: ${toi}\n`);
  }

  return lines.join('\n');
}
