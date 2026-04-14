// Background service worker (Chrome MV3) / background script (Firefox MV2)
(() => {
  'use strict';

  const CACHE_TTL = 60 * 60 * 1000; // 1 hour
  const cache = new Map();

  function cleanCache() {
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (now - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
      }
    }
  }

  async function fetchVideoInfo(videoId) {
    // Check cache
    const cached = cache.get(videoId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const url = `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${videoId}`;
      const response = await fetch(url);

      if (!response.ok) {
        const result = { success: false, error: 'not_found' };
        cache.set(videoId, { data: result, timestamp: Date.now() });
        return result;
      }

      const json = await response.json();
      const result = {
        success: true,
        data: {
          title: json.title,
          author_name: json.author_name,
          thumbnail_url: json.thumbnail_url
        }
      };
      cache.set(videoId, { data: result, timestamp: Date.now() });
      return result;
    } catch (e) {
      return { success: false, error: 'fetch_error' };
    }
  }

  const api = typeof browser !== 'undefined' ? browser : chrome;

  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchVideoInfo') {
      fetchVideoInfo(message.videoId).then(sendResponse);
      return true; // async response
    }
  });

  // Periodic cache cleanup
  setInterval(cleanCache, 10 * 60 * 1000);
})();