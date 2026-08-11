import { Redis } from '@upstash/redis';

const VISITS_LIST_KEY = 'visits:list';
const VISITS_COUNT_KEY = 'visits:count';
const MAX_STORED_VISITS = 1000;

type VisitRecord = {
  id: string;
  timestamp: string;
  ip: string;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  userAgent: string | null;
  path: string | null;
  referrer: string | null;
  language: string | null;
  screen: string | null;
};

type RequestHeaders = Record<string, string | string[] | undefined>;

type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: RequestHeaders;
};

type ApiResponse = {
  status: (code: number) => { json: (body: object) => void };
};

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function header(headers: RequestHeaders | undefined, name: string): string | null {
  if (!headers) return null;
  const value = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? null;
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function clientIp(headers: RequestHeaders | undefined): string {
  const forwarded = header(headers, 'x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return (
    header(headers, 'x-real-ip') ??
    header(headers, 'x-vercel-forwarded-for') ??
    'unknown'
  );
}

function parseBody(body: unknown): {
  path?: string;
  referrer?: string;
  language?: string;
  screen?: string;
} {
  if (!body || typeof body !== 'object') return {};
  const data = body as Record<string, unknown>;
  return {
    path: typeof data.path === 'string' ? data.path.slice(0, 500) : undefined,
    referrer: typeof data.referrer === 'string' ? data.referrer.slice(0, 500) : undefined,
    language: typeof data.language === 'string' ? data.language.slice(0, 100) : undefined,
    screen: typeof data.screen === 'string' ? data.screen.slice(0, 50) : undefined,
  };
}

function buildVisit(req: ApiRequest): VisitRecord {
  const body = parseBody(req.body);
  const headers = req.headers;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    ip: clientIp(headers),
    city: header(headers, 'x-vercel-ip-city'),
    region: header(headers, 'x-vercel-ip-country-region'),
    country: header(headers, 'x-vercel-ip-country'),
    latitude: header(headers, 'x-vercel-ip-latitude'),
    longitude: header(headers, 'x-vercel-ip-longitude'),
    userAgent: header(headers, 'user-agent'),
    path: body.path ?? null,
    referrer: body.referrer ?? null,
    language: body.language ?? header(headers, 'accept-language'),
    screen: body.screen ?? null,
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const redis = getRedis();
  if (!redis) {
    return res.status(503).json({
      error: 'visit tracking not configured. set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.',
    });
  }

  if (req.method === 'POST') {
    const visit = buildVisit(req);

    try {
      await redis.lpush(VISITS_LIST_KEY, visit);
      await redis.ltrim(VISITS_LIST_KEY, 0, MAX_STORED_VISITS - 1);
      const total = await redis.incr(VISITS_COUNT_KEY);
      return res.status(201).json({ success: true, id: visit.id, total });
    } catch (err) {
      console.error('Visits POST error:', err);
      return res.status(500).json({ error: 'failed to record visit' });
    }
  }

  if (req.method === 'GET') {
    try {
      const [rawVisits, total] = await Promise.all([
        redis.lrange<VisitRecord | string>(VISITS_LIST_KEY, 0, 199),
        redis.get<number>(VISITS_COUNT_KEY),
      ]);

      const visits: VisitRecord[] = rawVisits
        .map((item) => {
          if (typeof item === 'string') {
            try {
              return JSON.parse(item) as VisitRecord;
            } catch {
              return null;
            }
          }
          return item;
        })
        .filter((v): v is VisitRecord => v !== null && typeof v === 'object');

      return res.status(200).json({
        total: total ?? visits.length,
        visits,
      });
    } catch (err) {
      console.error('Visits GET error:', err);
      return res.status(500).json({ error: 'failed to load visits' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
