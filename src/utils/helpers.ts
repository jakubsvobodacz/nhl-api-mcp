// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function name(n: any): string {
  if (!n) return '';
  if (typeof n === 'string') return n;
  return n.default ?? '';
}

export function pad(s: string | number, width: number, right = false): string {
  const str = String(s);
  if (str.length >= width) return str;
  const padding = ' '.repeat(width - str.length);
  return right ? str + padding : padding + str;
}

export function table(headers: string[], rows: (string | number)[][], colWidths?: number[]): string {
  const widths = colWidths ?? headers.map((h, i) => {
    const maxRow = rows.reduce((max, row) => Math.max(max, String(row[i] ?? '').length), 0);
    return Math.max(h.length, maxRow);
  });

  const headerLine = headers.map((h, i) => pad(h, widths[i], true)).join('  ');
  const separator = widths.map(w => '-'.repeat(w)).join('  ');
  const dataLines = rows.map(row =>
    row.map((cell, i) => {
      const isNum = typeof cell === 'number' || (typeof cell === 'string' && /^-?\d+\.?\d*$/.test(cell));
      return pad(String(cell ?? ''), widths[i], !isNum);
    }).join('  ')
  );

  return [headerLine, separator, ...dataLines].join('\n');
}

export function formatDate(utcString: string): string {
  const d = new Date(utcString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(utcString: string): string {
  const d = new Date(utcString);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function pctg(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  return (value * 100).toFixed(1) + '%';
}

const TEAM_ABBREV_RE = /^[A-Z]{3}$/;

export function validateTeamAbbrev(team: string): string {
  const upper = team.toUpperCase();
  if (!TEAM_ABBREV_RE.test(upper)) {
    throw new Error(`Invalid team abbreviation: ${team}. Expected 3 uppercase letters (e.g., TOR, EDM, NYR).`);
  }
  return upper;
}

const SEASON_RE = /^\d{8}$/;

export function validateSeason(season: string): string {
  if (!SEASON_RE.test(season)) {
    throw new Error(`Invalid season format: ${season}. Expected 8 digits (e.g., 20242025).`);
  }
  return season;
}

const CAYENNE_SAFE_RE = /^[a-zA-Z0-9\s=<>!."'(),\-_+*/%]+$/;

export function validateCayenneExp(exp: string): string {
  if (!CAYENNE_SAFE_RE.test(exp)) {
    throw new Error('Invalid cayenneExp: contains disallowed characters.');
  }
  if (exp.length > 500) {
    throw new Error('cayenneExp too long (max 500 characters).');
  }
  return exp;
}
