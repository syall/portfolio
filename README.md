# portfolio

## Overview

Portfolio providing basic information about me, connecting to the GitHub GraphQL API for pinned repositories.

## Fewer Files

Compared to the last iteration of the portfolio. I did not separate CSS and JS files by domain after realizing how much overhead in both size and [critical chain requests](https://web.dev/critical-request-chains). Even for generic CSS that is shared across `index.html` and `404.html` and should be sharing a single CSS file, I decided that copying and pasting in separate files was more performant and still manageable, especially for a site as small as this one.

## Minify Files

As mentioned before, the number of kB sent across multiple files was too high in the previous iteration, so I used the first online websites I found to minimize CSS and JS files listed here:

- [JavaScript Minifier](https://javascript-minifier.com/)
- [CSS Minifier](https://cssminifier.com/)

## Font Awesome Reverse Engineering

I essentially stole font icons for the Contact section from [FontAwesome](https://fontawesome.com/) by looking into the CSS files loaded from a CDN. After looking through `src` URLs, I realized that all it provided was font files and a `@font-face`. So, I decided to download the [`WOFF2`](https://www.w3.org/TR/WOFF2/) font file and edited it online with [Baidu Font Editor](http://fontstore.baidu.com/static/editor/index-en.html), deleting all of the icons except for the 4 icons that I wanted to use. A corresponding `@font-face` was written from the original CDN CSS except that I renamed the `font-family` to `Icons` and got rid of all the unused classes (it used `::before` to set content corresponding to the icons). For the actual icons themselves in HTML, I embedded them in `&#<NUMBER>;` HTML codes by converting the hex code in the font file to decimal numbers, which worked!

## Inkscape Tracing Bitmap

For the Hero image, I initially wanted to create [vector artwork](https://makeitcenter.adobe.com/blog/friend-vector-artwork.html), but that required Adobe Illustrator. As I did not want to finesse a copy of that program, I looked up alternative software and found [a guide for tracing bitmaps in InkScape](https://inkscape.org/doc/tutorials/tracing/tutorial-tracing.html) which produced a picture different in style, but still satisfactory.

## Image Optimization

The produced image from InkScape had a high resolution, so to optimize loading performance for the web I used [Kraken.io](https://kraken.io/web-interface) which worked extremely quickly and efficiently.

## Position Absolute

To place the text in the face of the Hero image, absolute positioning is used with percentage. The image being responsive was easy to set, but the `font-size` took some experimenting to get right, ending with `min(4vw, 2em)`. The units need to be bound for extremely large screens, and it just so happened that a `font-size: 2em` for the blurb fit perfectly with a `max-width: 40em` for the image.

## `::before`

The `::before` pseudo-element made it easy to separate styling for labels and content. This made the HTML clean, but the CSS looks awkward with semantic content for each of the labels.

## GitHub GraphQL `languages`

Originally, the `primaryLanguage` of a `Repository` object was queried. In this iteration, `languages` query with arguments to get the top 3 most used languages in a repository replaces that. Unfortunately, most of my projects are only in one language so only one language would be returned, but hopefully the query will future-proof projects as I explore more languages.

## Regretting Scrolling

I had previously championed using scrolling in containers instead of laying out HTML. However, scrolling can be out of place since scrollbars can't be styled. Also, horizontal scrolling is awkward for most users due to irregularity (even myself after testing it on other devices), so I opted to just have a simple static column.

## `meta` Redirect

HTML can be redirected to other URLs by using a specific `meta` tag in `head`:

```html
<meta http-equiv="refresh" content="time; URL=new_url" />
```

I use this in `404.html` to redirect to `index.html` after 3 seconds.

## Annoyances of `a`

`a` tags are `inline` by default, posing many problems with the CSS box model. However, changing the `display` property to not be `inline` brings up more verbose CSS, so I decided the best way to handle those tags is to always have a container tag around it for layout.
