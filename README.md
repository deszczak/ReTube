# ReTube – Bringing Back YouTube Video Responses

ReTube is a simple browser extension bringing the Video Responses feature back to YouTube. **Welcome back to 2006!**

## Use cases
- Reply to somebody's video with your own and potentially start a conversation
- Reply to your own video with a correction or additional content
- Link to the previous or the first video in a series
- Whatever else you can think of

## Instructions
1. Install the extension in your browser: [Chromium](https://chromewebstore.google.com/detail/retube-%E2%80%93-youtube-video-re/pdbemkgdionejlkopddojpjighilhdlk), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/retube/)*, Safari **
2. Go to any video page on YouTube
3. Copy the video's ID from the URL – e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ → `dQw4w9WgXcQ`
4. Create a video response by adding `re:ORIGINAL_VIDEO_ID` to your video's title (e.g., re:dQw4w9WgXcQ)
5. Comment on the original video with `re:RESPONSE_VIDEO_ID` (e.g., I had a similar experience to you! re:3BFTio5296w)
6. Enjoy building a community on YouTube!

\* Firefox version is still **awaiting review** on April 15th.

\** Safari version will probably never be easily installable as I don't want to pay Apple the $99 for a Developer Account.
I'm _(not really)_ sorry. You can install the extension in Safari by downloading its `dist/` folder and going to Safari's `Settings` > `Developer` > `Add Temporary Extension` > Select the extension's folder.

---

## What YouTube said about the feature in 2006
> We recently noticed that within many of the different ecosystems on YouTube our users are doing something really cool – they're communicating with each other through their videos. Text comments and messages are great, but our users have once again created something really innovative completely on their own – video responses. It's been amazing to watch our users create an entirely new mechanism for communicating with one another. However, one of the challenges with these video dialogues has been there is no way to 'link' your response back to the original video. To encourage and simplify this type of communication we just launched a new Video Response feature that will allow you to upload your own video reply while you're watching a video. Just look for the 'post a video response' link on any video watch page. All video responses will show up directly beneath the original video (just like text comments).

Source: [YouTube Official Blog](https://blog.youtube/news-and-events/video-responses/)

## What I have to say about the feature 20 years later
Read about it on my blog:
[Bringing back YouTube's Video Responses to build communities](https://ato.yt/bringing-back-youtubes-video-responses/)

---

## Development

You can build the extensions yourself running `build.sh`. The extensions will be in `dist/`.
To lint and test them you can run `web-ext lint` and `web-ext run` inside `dist/firefox/` for Firefox development.
It's at least the way I do it.

**web-ext** needs to be installed globally: `npm install --global web-ext` to use its commands.

**[Note to myself]** to delete the Mac files after compression use
`zip -d filename.zip __MACOSX/\*`