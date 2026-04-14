# ReTube – Bringing Back YouTube Video Responses

ReTube is a simple browser extension for Chrome, Firefox and Safari
bringing the video responses feature back to YouTube. **Welcome back to 2006!**

## Use cases
- Reply to somebody's video with your own and potentially start a conversation
- Reply to your own video with a correction or additional content
- Whatever else you can think of

## Instructions
1. Install the extension in your browser: [Chromium](https://#), [Firefox](https://#), [Safari](https://#)
2. Go to any video page on YouTube
3. Copy the video's ID from the URL – e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ → `dQw4w9WgXcQ`
4. Create a video response by adding `re:ORIGINAL_VIDEO_ID` to your video's title (e.g., re:dQw4w9WgXcQ)
5. Comment on the original video with `re:RESPONSE_VIDEO_ID` (e.g., I had a similar experience to you! re:3BFTio5296w)
6. Enjoy building a community on YouTube!

---

## What YouTube said about the feature in 2006:
> We recently noticed that within many of the different ecosystems on YouTube our users are doing something really cool - they're communicating with each other through their videos. Text comments and messages are great, but our users have once again created something really innovative completely on their own - video responses. It's been amazing to watch our users create an entirely new mechanism for communicating with one another. However, one of the challenges with these video dialogues has been there is no way to 'link' your response back to the original video. To encourage and simplify this type of communication we just launched a new Video Response feature that will allow you to upload your own video reply while you're watching a video. Just look for the 'post a video response' link on any video watch page. All video responses will show up directly beneath the original video (just like text comments).

Source: [YouTube Official Blog](https://blog.youtube/news-and-events/video-responses/)

## What I say about the feature in 2026:
I recently noticed that I miss what YouTube communities used to look like.
I miss the **authenticity** of barely edited videos and people sharing their views on things they truly care about.
I know it still exists, but I guess it's not as natural to the platform as it used to be. I miss people caring about sharing things **just to share them** and not
to grow an audience, build a brand or earn money. **I honestly miss it the most about me.**

I used to upload videos to YouTube all the time to share my thoughts, opinions and music
even if I didn't have a lot of followers and/or knowledge about video editing.
But now... making content on YouTube became in my eyes a thing professionals do, not average people like me.

If I want to share something, **I DON'T NEED TO** think about my brand, the audience, what would bring me views and money, etc.
I also **DON'T NEED TO** worry about the quality of my camera and my editing skills (or lack of them).

But I do it.

And I hate it.

I feel like YouTube is no longer about sharing and building communities mainly
because I'm not participating myself.

**I made friends on YouTube.**
I even made friends with people that had tens of thousands of followers.
There were no boundaries. We were average people building a cummunity.

I learned a lot from watching videos, but I also taught others myself.
Me talking about challenging experiences let people know that they weren't alone.
Me talking about how I tackled a problem inspired others to do the same and to share their knowledge.
Me sharing my process of making music allowed others to learn from it and make their own music.

I miss this more than I can say.

And so... to encourage and simplify this type of community building and communication on YouTube,
I just launched an old Video Response feature in the form of a browser extension. It's been 20 years since the feature was released.
I missed it. But it's here now.

**Let's build a community together!**

---

## Development

You can build the extensions yourself running `build.sh`. The extensions will be in `dist/`.
To lint and test them you can run `web-ext lint` and `web-ext run` inside `dist/firefox/` for Firefox development.
It's at least the way I do it.

**web-ext** needs to be installed globally: `npm install --global web-ext` to use its commands.