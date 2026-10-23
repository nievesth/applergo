# Pull request validation and previews

## Continuous integration

The `.github/workflows/ci.yml` workflow runs on pull requests targeting `main`, pushes to `main`, and manual dispatch. It installs locked dependencies using `npm ci` and runs lint, the Vitest suite, and a production build. Check the **Checks** tab on a pull request or the repository's **Actions** tab.

CI uses read-only repository permissions and does not expose deployment secrets to pull requests. Do not merge when required checks are failing. A repository administrator may enable branch protection and require the **Lint, test and build** check once the workflow has run.

## Browser previews: Cloudflare Pages (manual one-time connection)

No deployment secrets or privileged PR workflows are included. To enable automatic previews, the repository owner must:

1. Sign in to Cloudflare, open **Workers & Pages**, and create a **Pages** project using **Import an existing Git repository** (the wording may vary).
2. Authorize the Cloudflare GitHub app for `nievesth/applergo` only, if possible.
3. Select `nievesth/applergo`. Configure framework **Vite**, build command `npm run build`, output directory `dist`, and production branch `main`. Use a Node.js version compatible with the project (Node 24). If the Pages build environment uses a different default, set `NODE_VERSION=24` in the Pages build settings.
4. Enable preview deployments for pull request branches. Confirm the chosen Cloudflare plan and current quotas before enabling builds. Cloudflare may deploy a production site from `main` when the project is connected; verify this is acceptable before authorizing.
5. Open a new pull request from a non-production branch. Inspect the deployment status/link in the Cloudflare dashboard or PR checks, then open the assigned preview URL on desktop or mobile. Do not guess the URL before Cloudflare assigns it.
6. Close the pull request when finished. Cloudflare's preview retention and deletion behavior depends on its current platform settings: inspect the deployment list in the dashboard and remove old previews there when needed. Closing a PR does not necessarily delete its deployed preview automatically.

The application is a client-side SPA. After connecting Pages, verify that a direct navigation to `/product-lookup` works; if not, add a suitable SPA fallback following Cloudflare's current documentation. Do not add deployment secrets to PR workflows or execute privileged code from untrusted PRs.

## Cost and security

- GitHub Actions on a public repository using standard GitHub-hosted runners is generally free under GitHub's current billing rules; verify any account-specific restrictions.
- Cloudflare Pages has a free tier with build/deployment limits that may change. Check the plan and usage before enabling automatic preview builds.
- No Cloudflare API token, GitHub personal access token, or additional paid service is required in this repository's CI workflow.
- Preview URLs may be publicly reachable. Do not deploy secrets, private test data, or unpublished sensitive content.
- Only the repository owner should approve merges into `main`.
