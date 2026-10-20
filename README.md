# Urdu Seekho — Learn Urdu with Hindi and English

**Free text-only Urdu reading practice for Hindi-speaking beginners.** Learn the Urdu alphabet, understand missing short vowels, read useful Urdu words using Hindi script, and test yourself on 1,000 entries across 50 short quizzes.

A simple educational website that works on **GitHub Pages**, built with static HTML, CSS and vanilla JavaScript. No audio, trackers, user accounts, databases, or paid services.

## Pages

- **`index.html`** — Start here: Urdu alphabet with Hindi sounds, step-by-step reading instructions, examples, short spoken-Urdu phrases and beginner questions.
- **`practice.html`** — The original "03. Test yourself" experience: 1,000 Urdu words, 50 sets of 20, Hindi-reading / English-meaning multiple-choice questions, instant feedback, missed-word revision and local scores.
- **`word-list.html`** — All 1,000 Urdu–Hindi–English entries in simple HTML study tables. This allows reading without JavaScript and helps search engines discover the actual educational content.

## Launch locally

Open `index.html` in your browser and use the navigation links. The quiz will also work without a web server because the data is stored in `words.js`.

## Publish on GitHub Pages

1. Create a **public GitHub repository**, for example `urdu-seekho`.
2. Upload all files from this folder to the repository root (do not upload the outer ZIP as the site).
3. In the repository go to **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/(root)`, then Save.
4. Your site should appear at `https://YOUR-USERNAME.github.io/urdu-seekho/` if using that repository name.
5. **Important SEO step:** once the public URL is known, run from this folder:

   ```bash
   python prepare_seo.py https://YOUR-USERNAME.github.io/urdu-seekho/
   ```

   Commit the updated `index.html`, `practice.html`, `word-list.html`, and new `sitemap.xml`. This adds the correct **absolute canonical URLs**, sharing URLs and an XML sitemap. Do not publish example `YOUR-USERNAME` URLs as real canonical addresses.
6. Verify the site in [Google Search Console](https://search.google.com/search-console/about), submit `/sitemap.xml` and check URL indexing. Crawling, ranking and AI citations are **not guaranteed**.

> `robots.txt` at a subdirectory such as `/urdu-seekho/robots.txt` cannot control an entire `github.io` domain; the site does not need a custom robots file. The sitemap can be submitted directly to Search Console.

## Replace the project introduction later

Edit `index.html`, find `PROJECT_INTRO_START` and `PROJECT_INTRO_END`, and replace the paragraph between them with your personal message. Keep the opening and closing paragraph tags, and escape `<` and `&` if needed. No other file needs to change.

## Help people (and search engines) find it

- Suggested **GitHub repository description:** `Learn to read Urdu using Hindi and English — alphabet guide, unmarked Urdu spelling tips and 1,000-word practice quizzes.`
- Suggested **GitHub topics:** `urdu`, `learn-urdu`, `urdu-alphabet`, `hindi-to-urdu`, `urdu-vocabulary`, `language-learning`, `github-pages`.
- In GitHub's **About** sidebar, add your published Pages link under **Website**.
- Link to the live site from the repository README and share it where Urdu learners look for help. Keep the guide useful and accurate, not keyword-stuffed.
- The site uses descriptive titles, descriptions, crawlable links, meaningful HTML sections and modest schema.org `LearningResource` metadata. These are discoverability aids, **not guaranteed rich results**.
- Google's guidance says there is **no separate technical requirement** for its AI search features beyond ordinary eligibility and good SEO. No `llms.txt` or AI-specific file is needed for Google AI Overviews/AI Mode.

## Editorial and vocabulary notes

- The word data comes from the user-provided beginner workbook. The ordering is a teaching sequence and is **not** a scientifically verified list of the most frequent Urdu words.
- Urdu letters are presented with approximate learner-friendly Hindi sound equivalents. They are not always one-to-one phonetic transcriptions.
- Ordinary Urdu text is deliberately **not** furnished with added short-vowel marks. Context often resolves ambiguous spellings.
- The `words.js` database has 1,000 entries; the practice page creates choices with JavaScript, but the full word list is also available as static HTML.
- Quiz best scores are stored in the browser using `localStorage`. Nothing is sent to a server.
- A proficient Urdu reader should proofread the vocabulary and guide before broad publication.
- You are responsible for ensuring you have the rights to redistribute the supplied workbook material. No license is assumed here.

## Files

- `index.html`: Main beginner guide
- `practice.html`: Quiz user interface
- `word-list.html`: Indexable reference vocabulary
- `words.js`: Vocabulary data (1,000 records)
- `app.js`: Quiz logic (50 sets of 20)
- `styles.css`: Simple shared presentation
- `prepare_seo.py`: Optional publishing utility for canonical URLs and sitemap
- `.nojekyll`: Explicitly serve static files on GitHub Pages
