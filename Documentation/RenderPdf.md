# The `ctx.renderPdf()` method
This method lets you render an [Eta](https://eta.js.org) template in HTML format as a **PDF document**
and send it as HTTP response.
Its signature and usage are basically the same as those of [the `ctx.render()` method](RenderHtml.md),
except that it returns a [Buffer](https://nodejs.org/api/buffer.html) instead of a string.

```js
import {eta} from "@cedx/koa-eta";
import Koa from "koa";
import {join} from "node:path";

const app = new Koa;
eta(app, {views: join(import.meta.dirname, "path/to/view/folder")});

app.use(async ctx => {
  const locals = {message: "Hello World!"};
  await ctx.renderPdf("view", locals);
});
```

> [!NOTE]
> The content type of the HTTP response will automatically be set to `application/pdf`.

## Setup
To render view templates as PDF documents, this library relies on the [Playwright](https://playwright.dev) project
and the [Chromium](https://www.chromium.org/Home) web browser.

You need to be aware that this rendering method is heavy in terms of memory consumption and CPU usage.
Your server must therefore be sufficiently sized to accept such a load.

> [!CAUTION]
> It's not suitable for high-traffic websites! It's preferable to consider setting up a caching system
> of some kind to avoid having to render the same PDF every time your server receives a request.

The `eta()` function accepts a `browser` option which is an object that is directly passed
to the [`BrowserType.launch()`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch) method
provided by [Playwright](https://playwright.dev).
For example, use it to customize which browser will be used to render PDF documents.

```js
// Use Microsoft Edge instead of Chromium.
eta(app, {
  browser: {channel: "msedge"},
  views: join(import.meta.dirname, "path/to/view/folder")
});
```

Please refer to the [Playwright documentation](https://playwright.dev) for details
of [all configuration settings](https://playwright.dev/docs/api/class-browsertype#browser-type-launch)
supported by the `browser` option.

## Rendering options
The `ctx.renderPdf()` method supports the same options as [the `ctx.render()` method](RenderHtml.md) (i.e. `async` and `writeResponse`).

Other options are available to specifically customize the PDF rendering.
These options are specified in the `ctx.renderPdf()` call and passed directly to the
[`Page.pdf()`](https://playwright.dev/docs/api/class-page#page-pdf) method provided by [Playwright](https://playwright.dev).

```js
app.use(async ctx => {
  const locals = {message: "Hello World!"};
  await ctx.renderPdf("view", locals, {
    format: "A4",
    outline: true
  });
});
```

Please refer to the [Playwright documentation](https://playwright.dev) for details
of [all configuration options](https://playwright.dev/docs/api/class-page#page-pdf)
supported by the PDF rendering.
