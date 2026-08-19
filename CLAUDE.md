# COMP4020 prototype

Your starter repo for a COMP4020 prototype: a static site in HTML/CSS/TypeScript
that builds to plain HTML/CSS/JS and deploys to GitHub Pages. The deployed site
is what gets marked, not this repo.

The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec, and this repo's name tells you
which deliverable applies. Read both before you plan or build.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it. The rendered page is the truth;
  your mental model of it isn't.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## The link-preview card

`public/card.png` (1200x630) is the image a shared link shows; `index.html`'s
head points at it. Replace it and the `description` meta, and copy the head
block into any new page. The card URL resolves against the page that names it,
like any link --- `./card.png` is wrong one directory down, and nothing in CI
checks it, so look at the deployed head when you add pages.

## The checks

`pnpm check` runs them (`pnpm check:evidence` is the extra gate before you
ship); CI runs the same plus links, secrets and the deploy. Read the failure.

`spec/README.md`, `PROCESS.md` and `reflections/README.md` are in this repo and
say what they are for.

## This file is yours

A starting point, not a rulebook. As you learn what your prototype needs --- a
convention the work has to hold to, a sensor that keeps catching you out (a
linter, say), a fact about the stack that is easy to get wrong --- write it down
here and wire it into `check`. Growing this file is the work.

## Facts about this stack that kept biting

Each of these cost a red check or a wrong conclusion once. Read them before
debugging the same thing again.

- **This repo runs Astro, not the starter's Vite.** `pnpm build` still emits the
  whole site into `dist/` and the `package.json` scripts keep their names, which
  is the entire CI contract --- but Astro has no relative-base shortcut, so the
  GitHub Pages project path must be baked in explicitly:
  `base: "/comp4020-crit4-Alisonsun7/"` in `astro.config.mjs`. Get it wrong and
  the site looks perfect locally while every asset 404s on the live URL. Commit
  the updated `pnpm-lock.yaml` too --- CI installs with `--frozen-lockfile`.
- **Headless Chrome on macOS will not give you a viewport narrower than
  ~500px.** `--window-size=390,N` produces a 390px-wide *image* of a ~500px-wide
  *layout*, cropped --- which looks exactly like horizontal overflow and is not.
  To check the 390×844 marking viewport for real, load the page in an
  `<iframe width="390">` inside a harness page and screenshot that; an iframe
  gets its own CSS viewport, so media queries evaluate correctly. Verify the
  harness itself with a media-query probe page before trusting a phone
  screenshot.
- **stylelint's `no-descending-specificity` dictates rule order,** and it is not
  negotiable by adding a comment. Selectors matching the same element must
  appear in ascending specificity. For links that means the order
  `a` → `nav a` → `a:visited` → `nav a:hover`, which reads oddly and is correct.
  When it complains, reorder; don't disable it.
- **`pnpm check` is `&&`-chained,** so a stylelint error stops vitest from
  running at all. A green test count after a lint failure is not a thing you
  have seen --- re-run after fixing the lint.
- **stylelint's `media-feature-range-notation` rejects `@media (min-width:
  900px)`.** Write range-context syntax instead: `@media (width >= 900px)`.
  Same for `max-width`.
