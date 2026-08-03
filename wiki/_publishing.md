# Publishing these pages to the GitHub Wiki

These files are drafts for the repo's **Wiki** tab, kept in-tree so they get reviewed/updated alongside code changes. They are not meant to be served from the plugin itself.

The GitHub wiki for this repo (`anamwp/newsly.wiki.git`) hasn't been initialized yet — `git clone` of it currently fails with "Repository not found". To publish:

1. In the GitHub repo, go to **Settings → Features** and make sure **Wikis** is checked on.
2. Open the **Wiki** tab and create the first page (title it `Home`) — this initializes the underlying `newsly.wiki.git` repo. Paste in `Home.md`'s content, or leave a placeholder.
3. Clone the now-existing wiki repo locally: `git clone git@github.com-personal:anamwp/newsly.wiki.git`
4. Copy each file from this folder into the cloned wiki repo, using the filename (minus `.md`) as the page title — GitHub wiki pages resolve `[[Page Name]]`/`[Page Name](Page-Name)` links by filename, so keep names matching what these pages link to (`Home.md`, `Blocks-Overview.md`, `Development-Workflow.md`, `Testing-Guide.md`, `Known-Issues-And-Fixes.md`, `Deployment.md`).
5. Commit and push the wiki repo.

Once published, this `wiki/` folder in the plugin repo can either be deleted or kept as the editable source of truth (re-sync manually after edits) — your call.
