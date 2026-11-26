# Contributing

Thanks for taking a look. Bug reports, ideas and pull requests are all welcome.

## Before you start

- For anything bigger than a small fix, open an issue first so we can agree on the approach.
- If you change the JSON the field saves, keep it backward compatible. Existing content in real SitecoreAI environments has to keep loading. Add optional properties instead of renaming or removing ones, and update the README and the example renderer in `examples/content-sdk/`.

## Local setup

```bash
npm install
npm run dev
```

The app needs to run inside SitecoreAI to connect. See the README for registering a custom app that points at your local dev server.

## Before opening a pull request

```bash
npm run lint
npm run typecheck
npm run build
```

CI runs the same three checks on every pull request. In the PR description, say what you changed and how you tested it in the Page builder (screenshots help a lot for UI changes).
