(() => {
  'use strict'

  const VIDEO_ID_PATTERN = /re:([a-zA-Z0-9_-]{11})/i
  const DEBOUNCE_MS = 300
  const MAX_CONCURRENT = 5

  let currentVideoId = null
  let renderedResponseIds = new Set()
  let observer = null
  let debounceTimer = null
  let activeRequests = 0
  let requestQueue = []

  // --- Utility ---

  const getCurrentVideoId = () => new URLSearchParams(window.location.search).get('v')

  const fetchVideoInfo = (videoId) => new Promise(resolve => {
    const api = typeof browser !== 'undefined' ? browser : chrome
    api.runtime.sendMessage({ action: 'fetchVideoInfo', videoId }, (response) => resolve(response))
  })

  function throttledFetch(videoId) {
    return new Promise((resolve) => {
      const execute = () => {
        activeRequests++
        fetchVideoInfo(videoId).then(result => {
          activeRequests--
          resolve(result)
          if (requestQueue.length > 0) {
            const next = requestQueue.shift()
            next()
          }
        })
      }

      if (activeRequests < MAX_CONCURRENT) execute()
      else requestQueue.push(execute)
    })
  }

  // --- Feature 1: Response Tag above title ---

  async function handleResponseTag() {
    // Remove any existing tag
    document.querySelector('.video-response-tag')?.remove()

    // Wait for title element
    const titleEl = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata') ||
                    document.querySelector('#title h1 yt-formatted-string') ||
                    document.querySelector('h1.ytd-watch-metadata')
    if (!titleEl) return

    const titleText = titleEl.textContent || ''
    const match = titleText.match(VIDEO_ID_PATTERN)
    if (!match) return

    const referencedId = match[1]
    if (referencedId === currentVideoId) return

    const result = await throttledFetch(referencedId)
    if (!result || !result.success) return

    const tag = document.createElement('a')
    document.querySelector('.video-response-tag')?.remove()
    tag.className = 'video-response-tag'
    tag.href = `https://www.youtube.com/watch?v=${referencedId}`
    const spanEl = document.createElement('span')
    spanEl.textContent = result.data.title
    tag.append('Response to ', spanEl)

    // Insert above the title container
    const titleContainer = document.querySelector('#above-the-fold') ||
                           document.querySelector('ytd-watch-metadata') ||
                           titleEl.closest('#info-contents');
    if (titleContainer) {
      titleContainer.insertBefore(tag, titleContainer.firstChild);
    }
  }

  // --- Feature 2: Response Video Cards in Comments ---

  function createSkeletonCard() {
    const card = document.createElement('div')
    card.className = 'video-response-card yt-response-skeleton'
    const thumb = document.createElement('div')
    thumb.className = 'video-response-card-thumb'
    const info = document.createElement('div')
    info.className = 'video-response-card-info'
    const titlePh = document.createElement('div')
    titlePh.className = 'video-response-card-title-placeholder'
    const channelPh = document.createElement('div')
    channelPh.className = 'video-response-card-channel-placeholder'
    info.append(titlePh, channelPh)
    card.append(thumb, info)
    return card
  }

  function createVideoCard(data, videoId) {
    const card = document.createElement('a')
    card.className = 'video-response-card'
    card.href = `https://www.youtube.com/watch?v=${videoId}`
    card.target = '_blank'
    card.rel = 'noopener'
    const img = document.createElement('img')
    img.className = 'video-response-card-thumb'
    img.src = data.thumbnail_url
    img.alt = ''
    const info = document.createElement('div')
    info.className = 'video-response-card-info'
    const titleDiv = document.createElement('div')
    titleDiv.className = 'video-response-card-title'
    titleDiv.textContent = data.title
    const channelDiv = document.createElement('div')
    channelDiv.className = 'video-response-card-channel'
    channelDiv.textContent = data.author_name
    info.append(titleDiv, channelDiv)
    card.append(img, info)
    return card
  }

  async function processComment(commentEl) {
    const contentEl = commentEl.querySelector('#content-text')
    if (!contentEl) return

    const text = contentEl.textContent || ''
    const match = text.match(VIDEO_ID_PATTERN)
    if (!match) return

    const videoId = match[1]
    if (videoId === currentVideoId) return // self-reference
    if (renderedResponseIds.has(videoId)) return // deduplicate

    renderedResponseIds.add(videoId)

    // Insert skeleton
    const skeleton = createSkeletonCard()
    contentEl.parentElement.appendChild(skeleton)

    const result = await throttledFetch(videoId)
    if (!result || !result.success) {
      skeleton.remove()
      renderedResponseIds.delete(videoId)
      return
    }

    // Validate: the response video's title must contain re:CURRENT_VIDEO_ID
    const responseTitle = result.data.title || ''
    const validationPattern = new RegExp(`re:${currentVideoId}`, 'i')
    if (!validationPattern.test(responseTitle)) {
      skeleton.remove()
      renderedResponseIds.delete(videoId)
      return
    }

    const card = createVideoCard(result.data, videoId)
    skeleton.replaceWith(card)
  }

  function scanComments() {
    const comments = document.querySelectorAll('ytd-comment-thread-renderer, ytd-comment-renderer')
    comments.forEach((comment) => {
      if (comment.dataset.ytResponseScanned) return
      comment.dataset.ytResponseScanned = 'true'
      processComment(comment)
    })
  }

  function debouncedScanComments() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(scanComments, DEBOUNCE_MS)
  }

  // --- Observer ---

  let bodyObserver = null

  function setupObserver() {
    if (observer) observer.disconnect()
    if (bodyObserver) bodyObserver.disconnect()

    // Observe #comments #contents directly if available
    const commentsContainer = document.querySelector('#comments #contents')
    if (commentsContainer) {
      observer = new MutationObserver(debouncedScanComments)
      observer.observe(commentsContainer, { childList: true, subtree: true })
    }

    // Always keep a body-level observer to catch comments container appearing/reappearing
    bodyObserver = new MutationObserver(() => {
      const container = document.querySelector('#comments #contents')
      if (container && (!observer || !container.closest('[data-yt-response-observed]'))) {
        // Mark container so we don't re-attach repeatedly
        container.setAttribute('data-yt-response-observed', 'true')
        if (observer) observer.disconnect()
        observer = new MutationObserver(debouncedScanComments)
        observer.observe(container, { childList: true, subtree: true })
        debouncedScanComments()
      }
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })
  }

  // --- Init ---

  function init() {
    const newVideoId = getCurrentVideoId()
    if (!newVideoId) return

    // Only do full reset if video actually changed
    const videoChanged = newVideoId !== currentVideoId
    currentVideoId = newVideoId

    if (videoChanged) {
      renderedResponseIds.clear()
      requestQueue = []
      activeRequests = 0

      // Clean up previous UI
      document.querySelectorAll('.video-response-tag, .video-response-card').forEach(el => el.remove())
    }

    // Always clear scanned flags so comments get re-processed
    document.querySelectorAll('[data-yt-response-scanned]')
      .forEach(el => delete el.dataset.ytResponseScanned)
    document.querySelectorAll('[data-yt-response-observed]')
      .forEach(el => el.removeAttribute('data-yt-response-observed'))

    // Delay slightly to let YouTube render the title
    setTimeout(() => {
      handleResponseTag()
      scanComments()
      setupObserver()
    }, 500)

    // Secondary scan to catch late-loading comments
    setTimeout(() => {
      handleResponseTag()
      scanComments()
    }, 2500)
  }

  // Listen for SPA navigation
  document.addEventListener('yt-navigate-finish', init)

  // Also listen for yt-page-data-updated as a fallback
  document.addEventListener('yt-page-data-updated', () => {
    setTimeout(() => {
      handleResponseTag()
      scanComments()
    }, 800)
  })

  // Initial run
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})()