# Deployment

Deployment is automated via GitHub Actions to WP Engine, using `wpengine/github-action-wpe-site-deploy`.

| Branch | Workflow | WP Engine environment |
|---|---|---|
| `dev` | `.github/workflows/dev.yml` | `falconhuntdev` |
| `master` | `.github/workflows/master.yml` | `falconhunter` |

Both workflows deploy to `wp-content/plugins/gutenberg-starter/` on the target environment and require the `WPE_SSHG_KEY_PRIVATE` secret to be configured in the repo settings.

Pushing to `dev` or `master` triggers an automatic deploy — there is no manual approval step in either workflow. Treat both branches as production-adjacent when merging.
