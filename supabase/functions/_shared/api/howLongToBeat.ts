export interface HowLongToBeatResult {
  id: number | null;
  name: string | null;
  gameplayMain: number | null;
  gameplayMainExtra: number | null;
  gameplayCompletionist: number | null;
  similarity: number | null;
}

const EMPTY_HLTB: HowLongToBeatResult = {
  id: null,
  name: null,
  gameplayMain: null,
  gameplayMainExtra: null,
  gameplayCompletionist: null,
  similarity: null,
};

const EDITION_PATTERN = [
  'ultimate edition',
  'deluxe edition',
  'complete edition',
  'standard edition',
  'game of the year edition',
  'goty edition',
  "collector'?s edition",
  'collectors edition',
  'remastered',
  'remake',
].join('|');

export function normalizeHltbSearchTitle(title: string) {
  const original = title.trim();
  if (!original) return '';

  const editionSuffix = new RegExp(`\\s*[:\\-\\u2013\\u2014|/]\\s*(?:${EDITION_PATTERN})\\s*$`, 'i');
  const bracketedEdition = new RegExp(`\\s*[\\[(]\\s*(?:${EDITION_PATTERN})\\s*[\\])]`, 'gi');
  const inlineEdition = new RegExp(`\\b(?:${EDITION_PATTERN})\\b`, 'gi');

  const normalized = original
    .replace(/[\u2122\u00ae\u00a9]/g, '')
    .replace(editionSuffix, '')
    .replace(bracketedEdition, '')
    .replace(inlineEdition, '')
    .replace(/['"]/g, '')
    .replace(/[()[\]{}]/g, ' ')
    .replace(/\s*[|/]\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*[:\-\u2013\u2014]\s*$/g, '')
    .trim();

  return normalized || original;
}

function normalizeQuery(title?: string | null, igdbSlug?: string | null) {
  const fromTitle = title ? normalizeHltbSearchTitle(title) : null;
  if (fromTitle) return fromTitle;
  const fromSlug = igdbSlug?.replace(/-/g, ' ').trim();
  return fromSlug ? normalizeHltbSearchTitle(fromSlug) : null;
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function fallbackSimilarity(query: string, candidate: string) {
  const q = normalizeText(query);
  const c = normalizeText(candidate);
  if (!q || !c) return 0;
  if (q === c) return 1;
  if (c.includes(q) || q.includes(c)) return 0.85;

  const qTokens = new Set(q.split(/\s+/).filter(Boolean));
  const cTokens = new Set(c.split(/\s+/).filter(Boolean));
  if (!qTokens.size || !cTokens.size) return 0;

  let matches = 0;
  qTokens.forEach(token => {
    if (cTokens.has(token)) matches += 1;
  });

  return matches / Math.max(qTokens.size, cTokens.size);
}

function readSimilarity(result: Record<string, unknown>, query: string) {
  const explicit = toNumber(result.similarity);
  if (explicit != null) return explicit;
  const name = typeof result.name === 'string' ? result.name : '';
  return fallbackSimilarity(query, name);
}

function normalizeResult(result: Record<string, unknown>, query: string): HowLongToBeatResult {
  return {
    id: toNumber(result.id),
    name: typeof result.name === 'string' ? result.name : null,
    gameplayMain: toNumber(result.gameplayMain),
    gameplayMainExtra: toNumber(result.gameplayMainExtra),
    gameplayCompletionist: toNumber(result.gameplayCompletionist),
    similarity: readSimilarity(result, query),
  };
}

export async function getHowLongToBeatMetadata(
  title?: string | null,
  igdbSlug?: string | null,
): Promise<HowLongToBeatResult> {
  const query = normalizeQuery(title, igdbSlug);
  if (!query) return EMPTY_HLTB;

  try {
    const mod = await import('npm:howlongtobeat');
    const Service = mod.HowLongToBeatService ?? mod.default?.HowLongToBeatService;
    if (!Service) throw new Error('HowLongToBeatService export not found');

    const service = new Service();
    const results = await service.search(query);
    if (!Array.isArray(results) || results.length === 0) return EMPTY_HLTB;

    const normalized = results
      .map((result: Record<string, unknown>) => normalizeResult(result, query))
      .sort((a: HowLongToBeatResult, b: HowLongToBeatResult) => (b.similarity ?? 0) - (a.similarity ?? 0));

    return normalized[0] ?? EMPTY_HLTB;
  } catch (error) {
    console.warn('HowLongToBeat enrichment failed:', error);
    return EMPTY_HLTB;
  }
}
