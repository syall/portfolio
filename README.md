# portfolio

## Overview

[`portfolio`](https://portfolio.syall.work) is a fun simple portfolio providing basic information about me (Steven Yuan), connecting to the GitHub GraphQL API for pinned repositories.

## Features

Although it is simple, there are still interesting features I would like to note:

- [Carousel](#carousel)
- [Images](#images)
- [Layout](#layout)
  - [Grid, Flex, and the Rest](#grid-flex-and-the-rest)
  - [CSS Structure](#css-structure)
  - [Media Queries](#media-queries)
- [Copyright](#copyright)
- [Deployment](#deployment)
- [Personal Thoughts](#personal-thoughts)

## Carousel

### GitHub GraphQL API

In [`carousel.js`](js/carousel.js), the first step to create the carousel is to fetch the pinned repositories to display from the [GitHub GraphQL API](https://docs.github.com/en/graphql).

In my previous portfolio, the Angular implementation used built-in modules for both templating and GraphQL. For this new portfolio, I wasn't even sure where to start. Did I need to install an external GraphQL client library? Was fetching from the client even possible with only vanilla client-side JavaScript?

It turns out all of the magic in my previous portfolio could be boiled down to a POST request with an authorization header and query in the body. After that revelation, the time to implement with the [Browser's Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) was minimal and fortunate, as the alternative would have been to fetch from [`gh-pinned-repos.now.sh`](https://github.com/egoist/gh-pinned-repos), a hobby project I found online by [`egoist`](https://github.com/egoist). That project is essentially a single purpose web scraper for pinned repositories given a GitHub username; however, it does not fetch GitHub and hosted links, incomplete for my use case.

As a side note, GitHub pages does not allow sites with a GitHub personal access token in the source code to be published, although commonly needed for API authentication. To bypass this, I performed a simple encryption on the token and hard coded it; then, at execution, the `decrypt` function will decrypt the token so it can be used. This should only be done with tokens that have restricted permissions as encryption definitely does not guarantee security. In this case, the token is only allowed read access to public repositories.

### DOM Manipulation

In [`carousel.js`](js/carousel.js), the pinned repositories from the GitHub GraphQL API are formatted into HTML cards and appended to a scrollable container.

In [`index.html`](index.html), there is already a container in the Projects section that is empty. The left and right beauty arrows and the carousel are appended dynamically via DOM manipulation. Each card is a div with a name h2, language p, description p, and links div to GitHub and hosted sites if available. The classes are attached during creation, but all of the CSS styles are predefined in [`projects.css`](css/projects.css).

The carousel is just a container that is scrollable by `overflow-x: scroll`. I love scrollable containers as the containers can scale to contain any amount of items, are easy to implement, and are extremely well supported. Out of all the dynamic features of browsers, scrolling usually never fails and is definitely more reliable than JavaScript event listeners.

## Images

Watching [a talk about Image Compression by Jake Archibald](https://www.youtube.com/watch?v=F1kYBnY6mwg) left a deep impression on how important it is to optimize images for the web, especially since those large assets are the main reason page loads are slow. However, I did not want to invest too much time meticulously optimizing every image because I prioritized implementing the site, leading me to use [tinyjpg](https://tinyjpg.com/) as a shortcut.

## Layout

### Grid, Flex, and the Rest

The body of the HTML is a simple CSS grid; the majority of everything else was formatted with flex.

Because I used CSS grid at the body level and CSS subgrid has not been adopted by most browsers, my mindset was using flex everywhere. So, unsurprisingly, flex is everywhere.

However, there was a strange bug in Safari where images contained in a flexbox would not keep the aspect ratio. I tried so many solutions: setting max and min dimensions, all combinations of align and justify for the container and self, but nothing worked.

The solution to the problem was actually to not use flex at all! Since all I had to do was horizontally align the picture and caption in a column, using margin auto, text-align, and defining a relative width to the container worked perfectly. The solution required less CSS and worked across every browser I tested.

Tools in these newer specifications are extremely helpful, but it doesn't mean that tried and tested solutions should be neglected.

### CSS Structure

My previous portfolio was littered with margin and padding hacks, leading to atrocious spaghetti code (ironic since the site had such a basic layout). I wanted to avoid another disaster at all costs, so I created a structured format for scoping CSS.

Besides the general [`index.css`](css/index.css), I created CSS files based on content: header, hero, projects, about, contact, and footer. Each of these used their unique identifier in descendant selectors, guaranteeing that any CSS defined in the file would only affect the elements in the respective scope.

For example, in the About section, all of the CSS would be defined in [`about.css`](css/about.css) with `#about` as the first parameter of all the CSS selectors.

```html
<!-- About Section -->
<section id="about">...</section>
```

```css
/* about.css */
#about <element/class-to-query> { ... }
```

The approach worked well, though it turns out I was essentially writing compiled SCSS.

### Media Queries

Originally, the site's dimensions were only contrained to a max-width of 640px, which was alright until I viewed the site on my external monitor.

The content of the site is purposefully narrow, but it did not scale up for larger screens. To adapt, I provided a media query for min-width 992px and 1200px. All this would do is increase the max-width of the main content and add more padding to the About section's lists. The CSS added was super simple, but keeping track of and testing the media queries for the affected components was annoying.

## Copyright

The copyright small uses JavaScript to get the current year in [`footer.js`](js/footer.js) and has an href to the GitHub repository.

I had never really given any thought to the copyright before, simply putting the cool symbol with the current year. However, when searching up other solutions, one comment on a blog post stood out to me: the website should not only show the current date, but also when the page was last published for transparency.

Because of this, I wrapped the copyright with a link to the public GitHub repository so anybody could check the commits and see the latest update.

## Deployment

Deploying to GitHub Pages is extremely easy: checking a few boxes in the settings and providing a custom domain can literally be set up in less than a minute.

In my first iteration, I only had [`index.html`](index.html). However, when testing different urls, I hit a generic GitHub Pages 404 page. I didn't like the inconsistency, so I quickly wrote up [`404.html`](404.html) to replace by reusing code from the index, expecting it to work perfectly.

I was deeply mistaken. When I tested a unknown url, the page had a ton of failed fetches. The errors were caused by the `href`s and `src`s using the window url as the base url for requests instead of the urls defined in the HTML. To solve this, I adjusted all of urls to start with `./`, thinking that using a path relative to the 404 HTML location would work. However, it turns out that using `./` and not providing anything is the same thing!

The solution was to use `/`. It turns out that GitHub Pages uses `/` as the relative root for writing absolute paths to assets. I was very glad this worked as the other solution would have been to provide the entire url (e.g. `https://portfolio.syall.work/<path>/<to>/<resource>/`) which would tie down and convolute the code.

## Personal Thoughts

My previous portfolio was my longest running project, started when I had no idea what I was doing and ended when I had a glimpse of the bigger picture.

Struggling with the Angular beast with no foundations in HTML/CSS/JS provided fond memories for me in hindsight. However, using Angular just to template components with almost no dynamic content was complete overkill. Seeing all of the files generated by `ng new` that I would never touch bothered me: all I needed was a single solid page that listed all of the information I wanted to share.

I recently started experimenting with static sites and corresponding template engines such as [`EJS`](https://ejs.co/). The productivity and speed for small projects that only demo or display information (which are most of my projects) blew frameworks like React and Angular out of the water in terms of size and speed.

For the same functionality, the complexity difference is massive. The web's simple and foundational technologies are abstracted into complex frameworks that do not fit the use case of many hobby projects by developers. For people who are just joining the community, they may spend hours trying to run with professional coders when they haven't even crawled yet.

My takeaway: I wish someone taught me about static sites before. They are awesome and dare say even foundational to understanding the web.
