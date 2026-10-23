# CI and pull request previews

## CI

`.github/workflows/ci.yml` runs on PRs targeting `main`, pushes to `main`, and manual dispatch. It uses Node.js 24.19.0 and runs `npm ci`, `npm run lint`, `npm test -- --run`, and `npm run build`. The npm download cache is keyed by `package-lock.json`; `node_modules` is freshly installed. Superseded runs are cancelled. Actions are pinned to verified upstream commit SHAs.

Open a PR's **Checks** tab and select **CI / Lint, test and build** to inspect step logs. A green check means all four commands passed. In repository **Settings → Rules → Rulesets**, optionally require this check for `main` after its first run. This requires repository administrator access and is not configured by these files.

CI has only `contents: read`, does not retain checkout credentials, and requires no repository secrets. It uses `pull_request`, never `pull_request_target` or a privileged `workflow_run` deployment. GitHub may require maintainer approval before running a first-time fork contributor's workflow.

## Preview choice

Use a **dedicated Cloudflare Pages Free project** connected to this repository through Cloudflare's GitHub App. Its native integration publishes public HTTPS preview links on same-repository PRs and updates them on branch pushes. No deployment token or privileged deployment job is needed in GitHub Actions. Production hosting remains a separate decision and project.

Compared with a token-based Actions deployment, this removes credential management and custom PR-comment automation. Netlify and Vercel also offer native previews, but have their own plan/usage restrictions; they are not configured here. Cloudflare's documented Free limits are 500 builds per month, one concurrent build per account, and unlimited active preview deployments. Branch pushes also consume builds even without an open PR. Static-only hosting needs no paid Functions, storage, custom domain, or other add-ons. Expected recurring cost is $0 within the Free plan; do not enable paid upgrades or add-ons. GitHub standard hosted Actions runners are free for public repositories; private repository allowances and paid runner types differ. Check provider limits before changing plans.

## One-time account setup (maintainer)

No Cloudflare credentials or account binding are available in this environment. The repository-side build script is ready; hosting and a real preview URL remain unverified until these steps are completed:

1. Sign in to a Cloudflare Free account. In **Workers & Pages → Create application → Pages → Connect to Git**, authorize the **Cloudflare Workers & Pages** GitHub App for **only `nievesth/applergo`**. Create a new project used exclusively for previews, not an existing production project. Let Cloudflare allocate its actual `pages.dev` hostname; no custom domain is needed.
2. Select the repository, production branch `main`, and no framework preset. Keep the repository root as the build root, set build command **`bash scripts/build-preview.sh`**, and build output directory **`dist`**. Use build system v3. Set the non-secret build variables **`NODE_VERSION=24.19.0`** and **`SKIP_DEPENDENCY_INSTALL=1`** in both build environments so the script owns the frozen-lockfile installation. Add **no secrets, bindings, deploy hooks, production variables, or Functions** to this project.
3. The initial `main` build is deliberately blocked by the script (or fails because the script has not yet reached `main`). Do not change the command to make that production build pass. In the project **Settings → Builds & deployments → Configure Production deployments**, disable **Enable automatic production branch deployments** and save. Keep `main` as the production branch. Set **Preview branch control → All non-Production branches**. Leave preview Access protection disabled so reviewers can open links in ordinary desktop/mobile browsers without a Cloudflare login. Do not attach production custom domains.
4. Open a same-repository PR targeting `main`, with this configuration present on its branch, and push a commit if needed to trigger a new build after connecting the app. Open Cloudflare's check on the PR for the real preview URL; the Pages project's **Deployments** list also provides it. Confirm that the deployed commit matches the PR head and that CI is green. Native previews and CI are independent; the preview build script also runs lint, tests and build before publishing.

Never add production credentials to this project: PR-controlled build scripts and dependencies execute during preview builds. The build guard prevents accidental main builds, but repository code is not a security boundary against a malicious contributor; the separate, secret-free project and provider branch controls provide the isolation. Fork PRs run CI under GitHub's restrictions but **do not receive native Cloudflare previews**. If a fork contribution needs a preview, a maintainer must first review it and deliberately bring it onto a repository branch. Do not introduce a privileged fork-deployment workflow.

## Viewing and checking a preview

Copy the actual preview HTTPS link from the PR's Cloudflare check or Pages deployment details. Open it in any normal browser, including a mobile browser. It is hosted by Cloudflare; it does not depend on a running development machine. A branch alias follows the newest deployment, while a deployment's hash URL identifies that particular build. Check the commit shown in deployment details before reviewing.

For the first deployment, load `/`, `/splash`, and `/product-lookup` directly and refresh each route; also check the product form at mobile and desktop widths. Pages serves `index.html` for client routes by default when there is no top-level `404.html`, so React Router needs no custom redirect configuration here. Product lookups call Open Food Facts from the browser; they still depend on that external API's availability. No application credentials are required.

## Closing a PR and removing previews

Closing or merging a PR **does not automatically delete Cloudflare Pages deployments**, and deleting its Git branch does not revoke existing deployment URLs. Historical hash URLs remain public. Never put private data in previews.

After closing a PR, delete its source branch to prevent new pushes. For cleanup, a maintainer can authenticate locally with Wrangler (outside CI; do not store credentials in this repository):

```bash
npx --yes wrangler@4 login
npx --yes wrangler@4 pages deployment list --project-name YOUR_ACTUAL_PREVIEW_PROJECT
npx --yes wrangler@4 pages deployment delete DEPLOYMENT_ID --project-name YOUR_ACTUAL_PREVIEW_PROJECT --force
```

Replace the placeholders with the real preview project name and IDs listed by Cloudflare. Match the closed PR's branch and commit; remove its historical preview deployments only. `--force` permits deletion of aliased deployments and skips confirmation, so check each ID first. Do not run this against a production project.

Cloudflare documents a restriction on deleting the latest deployment of a branch. If the API refuses that deletion, do not claim the URL is gone. For complete revocation, delete the **dedicated preview project** from its dashboard settings; this removes previews for every PR in that project, so coordinate with other reviewers and repeat the setup above for future previews. This native-integration option intentionally has **no automatic per-PR deletion**. Automatic guaranteed revocation would require a different provider/lifecycle design and external authorization; it is not implemented with hidden credentials.

## Sources and maintenance

Provider behavior and limits were checked against Cloudflare's official documentation source when preparing this configuration:

- [Preview URLs, public access, fork limitations and deletion](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [GitHub integration and check runs](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Production and preview branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Free plan limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Build image, Node version and skipping automatic dependency installation](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Single-page application routing](https://developers.cloudflare.com/pages/configuration/serving-pages/)

Keep the Node version in CI and the Pages project aligned when updating it. No live Pages project, account authorization, deployment, public URL, or automated cleanup is created merely by merging these files.
