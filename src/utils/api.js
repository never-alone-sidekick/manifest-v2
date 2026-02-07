const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const REST_KEY = import.meta.env.VITE_PARSE_REST_KEY;
const BASE_URL = import.meta.env.VITE_PARSE_SERVER_URL || 'https://parseapi.back4app.com';

const headers = {
  'X-Parse-Application-Id': APP_ID,
  'X-Parse-REST-API-Key': REST_KEY,
  'Content-Type': 'application/json',
};

async function parseQuery(className, { where, limit = 100, skip = 0, order, keys, include } = {}) {
  const params = new URLSearchParams();
  if (where) params.set('where', JSON.stringify(where));
  if (limit) params.set('limit', String(limit));
  if (skip) params.set('skip', String(skip));
  if (order) params.set('order', order);
  if (keys) params.set('keys', keys);
  if (include) params.set('include', include);

  const res = await fetch(`${BASE_URL}/classes/${className}?${params}`, { headers });
  if (!res.ok) throw new Error(`Parse error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results;
}

export async function fetchFeaturedUser() {
  const topPosts = await parseQuery('post', {
    limit: 20,
    order: '-commentCount',
    keys: 'creator,username,commentCount,content',
    where: { commentCount: { $gte: 10 } },
  });

  for (const post of topPosts) {
    const users = await parseQuery('_User', {
      where: { objectId: post.creator },
      keys: 'username,sobrietyDate,proPic,bio,createdAt',
      limit: 1,
    });
    if (users.length && users[0].proPic) {
      return users[0];
    }
  }

  const users = await parseQuery('_User', {
    where: { proPic: { $exists: true } },
    keys: 'username,sobrietyDate,proPic,bio,createdAt',
    limit: 1,
    order: '-updatedAt',
  });
  return users[0] || null;
}

export async function fetchUserPosts(userId, limit = 20) {
  return parseQuery('post', {
    where: { creator: userId },
    limit,
    order: '-commentCount',
    keys: 'content,commentCount,username,creator,createdAt,channelName,image',
  });
}

export function isApiConfigured() {
  return !!(APP_ID && REST_KEY);
}