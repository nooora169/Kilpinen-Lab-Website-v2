# October website feedback

Updated member-provided bios and supplied portraits, added Aleyna and the honorary Lab Entity, added the lab-bench gallery photo and Kavya's Cell Painting image. Marc's complete biography is retained below a short research summary. His CRIPSR typo is corrected to CRISPR. Emma's existing description now includes her Aalto master's programme and major.

Merged four research topics under Cellular modelling and mechanisms of NDDs. Original source records remain hidden, their detail text and relationships are retained in the source; visible topic sections show only concise descriptions and figures, and old topic paths and hash links forward to it. Homepage research cards use the same published topics as Research. Individual funded projects remain on Research and keep their own pages.

Portrait layout uses an explicit photo class and positioned images, avoiding reliance on :has() and intrinsic grid image sizing.

Validation: production build passed; desktop (1440px) and mobile (390px) checks passed in Playwright Chromium and WebKit on Home, People, Research and Lab life, including image loading, square portrait frames, overflow, script errors and legacy hash links. WebKit is not a test of every released Safari version or a physical iPhone. Firefox could not launch its profile on this machine; Firefox validation remains pending. The reported original Safari failure was not reproduced or conclusively diagnosed.

Pending content: Aleyna's role; Thara's bio and portrait; Nelli's updated bio and portrait. Existing Helena and Riina descriptions retained. Robin's new bio and photo are included. Existing Nour and alumni records retained.

GitHub repository: nooora169/Kilpinen-Lab-Website-v2. The remote main commit matched 53e349b when work started. No GitHub deployment/check records were returned for that commit; this does not establish whether Cloudflare is connected. Confirm in the Cloudflare dashboard. For a Git-connected Pages project, use npm run build and dist as output. For an existing Direct Upload project, use GitHub Actions/Wrangler or a new Git-connected Pages project. Hosted Decap login is still disabled and needs OAuth setup before browser-based forms can save to GitHub.

Follow-up review: simplified the four visible research topics to short descriptions and existing figures, removed topic people/publication/project lists and expanded explanations, placed Cell Painting as a 280px side figure, added Emma’s supplied avatar and complete-image framing for Aleyna, and added Reyhane’s WCPG poster news dated 1 October 2026.
