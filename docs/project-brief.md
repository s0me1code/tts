# TTS Project: Full Brief (Handoff Document)

**Purpose of this document:** it holds everything decided so far in the brainstorming sessions, so a new chat can continue from the same understanding. Read it fully before answering anything about the project.

**Where we are:** feature inventory exists; tech stack is decided (section 6). First implementation slice is **setup connection smoke tests** (helper↔website, WorkOS, Postgres, R2; extension as a commented placeholder). Interface design and full feature phases after that.

**Working notes for the assistant**
- The owner dictates messages by voice, so some words may be transcription errors. Interpret by context, and confirm when something is unclear.
- Ask at most one question at a time.
- Do not add features the owner has put out of scope (section 8).

---

## 1. What the project is

A text-to-speech platform built from two parts that work together:

1. **The website.** The only interface the user sees. It is where users browse voices, manage what they have processed, and play it back. It has its own domain.
2. **The local helper.** A small app installed on the user's computer. It fetches content from websites, runs the TTS models on the user's GPU, and stores files locally. It has no interface of its own, apart from a tray icon.

The website controls the helper. Users can also keep their content in the cloud, either privately (available from any device, including a phone) or shared with other users.

**Ground rules for this cycle**
- Voices are **curated by the owner**. Users cannot add, upload, or clone voices. Voice cloning is out of scope for now and may come much later.
- Each voice is tied to one model. The user does **not** install a model up front. When they pick a voice whose model is missing, the site prompts them to install it.
- Content comes from **supported source websites**. For now the user pastes URLs. A browser extension comes in a later cycle.

---

## 2. The website

### 2.1 Sidebar

| Group | Pages |
|---|---|
| **Voices** | Browse Voices, Voice Collections, Browse Tier Lists, Create Tier List, Favorites |
| **Processed** | All, Playlists, Play, Sources |
| **Local** | Queue, Models, Storage |
| **Account** | Profile and Account, Settings |

The owner confirmed all four groups, including the separate **Local** group that holds Queue, Models, and Storage.

### 2.2 Main page

Confirmed contents: helper status (connected, not running, or not installed, with the matching prompt), the latest processed items, and a quick way to paste a URL.

### 2.3 Group: Voices

**Browse Voices**
- All voices shown as cards.
- Each card shows the voice's **name and tags**. It does **not** show processing weight or the linked model.
- Search and filter by tags (each tag group is a filter section), and by speed and performance score.
- Clicking a card opens the detail view.

**Voice detail view**
- Average speed.
- **Performance score:** the average of the voice's scores across users' tier lists.
- **Reviews:** users can review a voice, and the reviews are shown here.
- **Usage count:** how many times the voice has been used.
- **Usage by source:** a **pie chart** showing how the usage splits across sources (for example, used for "source 1" X times and for "source 2" Y times).
- **Estimated processing time on the user's own machine** (see the helper's benchmarking in section 4).
- The community data above (performance score, reviews, usage count, and usage chart) is only visible to users who have opted in to share their own data (see section 3).
- Two audio samples: the **original** sample of the voice, and a **processed sample** where the voice reads a sample text.
- Model details (size and hardware requirements). These appear in the detail view only.
- If the model is not installed, picking the voice prompts the user to install it, showing size and requirements first.

**Voice Collections**
- Curated groups of voices, for example "lightweight voices" or "best for audiobooks".

**Browse Tier Lists**
- View tier lists that other users have shared publicly.

**Create Tier List**
- Users can create **multiple** tier lists.
- Voices are ranked into tiers (S, A, B, and so on).
- Each tier list can be kept private or shared publicly.
- A voice's placement in tier lists feeds its performance score.

**Favorites**
- Voices the user has marked as favorites. (Content favorites were mentioned in passing, but the owner only confirmed favorites in the Voices group.)

### 2.4 Voice data model

- **Numeric attributes** on the voice: **speed** and **performance score**. They are numbers, so they are **not** tags.
- **Performance score** is the average of the voice's score in tier lists. It is calculated, not set by hand.
- **Reviews** and **usage** are recorded per voice. Usage is tracked per source, which feeds the pie chart on the detail view.
- **Tag groups** are categories: Gender, Tone, Accent, Language, and Granularity.
- **Tags** are the values inside a group (for example, Male and Female in Gender).
- **Granularity** has two tags: *word-by-word* and *sentence-by-sentence*.
- A voice can have any number of tags across groups. Its model is a separate field, not a tag.
- Processing weight was **removed** as a field. Only speed is used to describe how fast or heavy a voice is.

```
TagGroup:  id, name
Tag:       id, group_id, name
Voice:     id, name, speed, performance_score (calculated),
           original_sample, processed_sample, model_id
VoiceTag:  voice_id, tag_id
TierList:  id, user_id, name, visibility (private or public)
TierEntry: tier_list_id, voice_id, tier
Review:    id, voice_id, user_id, (rating and text, to be defined)
VoiceUsage: voice_id, source_id, count
```

Speed is best expressed as a real-time factor, for example "how long one hour of audio takes to generate".

### 2.5 Group: Processed

**All**
- Everything the user has processed, latest first.

**Playlists**
- Users group processed items into playlists.

**Play**
- Plays the processed audio.
- Chapter navigation, speed control, and resume where the user left off.
- Shows the text and reads it **sentence by sentence** along with the audio. This depends on timestamps being stored when the audio is generated.

**Sources**
- The list of supported websites that content can be fetched from, in the same spirit as Mihon (Tachiyomi) sources.
- The user pastes one or several chapter URLs. The site matches each URL to its source and fetches the chapter text.
- Unsupported URLs get a clear message.
- Each source shows a status (working or broken), since sites change their layout and sources will need ongoing updates.
- Each source should be a separate, updatable piece, so one can be fixed without touching the rest.
- Later, the browser extension will let users pick chapters on a novel site and send them for processing. It will use the same sources.

### 2.6 Group: Local

**Queue**
- What is running now, what is waiting, and progress.
- Pause, resume, and stop.

**Models**
- Installed models and the disk space each uses.
- Install and uninstall.
- A natural place to show helper and hardware status (GPU, VRAM, free disk space).

**Storage**
- What is stored locally and what is in the cloud, and the space used.
- Moving items between local and cloud.

### 2.7 Group: Account

- **Profile and Account:** registration, login, account details.
- **Settings:** helper connection settings, the community data-sharing choice, and general preferences.

---

## 3. Storage and sharing model

Every processed item has two independent settings.

| Setting | Options |
|---|---|
| **Where it lives** | Local only, cloud, or both |
| **Who can access it** (if in the cloud) | Private or shared |

- Private cloud items belong to the user's account, so they are reachable from any device they log into, including a phone.
- Shared items can be seen by other users.
- Items can move between states: upload to the cloud, remove the local copy, change visibility.
- Audio should be compressed before upload to control cloud storage cost.

### Community data sharing (opt-in)

- At the beginning, the user is asked whether they want to see how other people rate and use voices: the voice score, reviews, and voice usage.
- **Approved:** the user shares their own data and can see other people's data.
- **Not approved:** the user does not share their data and does **not** see other people's data.
- It is a two-way exchange. Seeing community data requires sharing your own.

---

## 4. The local helper

### What it is
A background app with no window, only a tray icon showing that it is running (and a way to quit). All real interaction happens on the website. The tray icon was chosen over a pure headless service because it is easier to install and debug, and users can see it is alive.

### Responsibilities
- **Connection and pairing** with the website (section 5).
- **Hardware detection:** GPU, VRAM, free disk space, and whether a given voice can run on this machine.
- **Benchmarking:** measures the user's machine so each voice can show an estimated processing time for that user, instead of only a generic number.
- **Model management:** download, install, and remove models, with progress.
- **Content fetching:** fetch chapter text from supported sources.
- **Processing:** run TTS on the GPU through a job queue with run, pause, stop, and progress.
- **Local storage:** save audio and text on the user's machine.
- **Auto-update.**

### Why the helper fetches content
Browsers block cross-site fetching, so the website cannot scrape pages itself. Having the helper do it also uses the user's own connection instead of the owner's server, which avoids IP blocking and keeps the server out of the scraping business.

### Technical notes
- Helper is a **Python FastAPI** service with **PyTorch** for TTS, plus a tray icon (no main window).
- The installer should stay small and download the heavy parts (runtime, CUDA libraries, models) on demand.
- First release targets **Windows, Mac, and Linux** (CUDA on Windows/Linux; Apple Silicon path on Mac).

### Typical flow
1. The user opens the website, and it connects to the helper.
2. The user picks a voice, and installs its model if needed.
3. The user pastes chapter URLs, and the helper fetches the text.
4. The helper processes the chapters, and progress shows in the Queue.
5. The result is saved locally, and the user can optionally upload it as private or shared.

---

## 5. How the website connects to the helper

This was confirmed as possible and is a well-established pattern.

1. **Detection:** the website calls a health endpoint on the local machine (for example `http://127.0.0.1:PORT/health`). If it answers, the helper is running.
2. **Not running:** the installer registers a custom link (for example `yourapp://start`). The website can open it, and the browser asks the user to allow it. The helper should also start at login, so this is rarely needed.
3. **Not installed:** the website shows a download step.
4. **Pairing and security:** the first time, the user approves the connection (one click or a short code), and the helper issues a token. The helper accepts requests only from the owner's domain. Without this, any website could control the user's helper.

**Known caveats**
- Chrome, Edge, and Firefox allow an HTTPS site to talk to localhost. Safari has historically blocked it, so it may need a fallback.
- Newer Chrome versions ask for a permission the first time a site accesses local network resources.
- A phone cannot run the helper. On mobile, the website works only with the cloud library. Controlling the helper from other devices would need the helper to connect outward to the owner's server. That is a later feature.

---

## 6. Technical decisions so far

### Product decisions

| Topic | Decision |
|---|---|
| Voices | Curated by the owner, no cloning, no user uploads |
| Models | One per voice, installed on demand |
| Speed | A number on the voice, used instead of a processing-weight field |
| Voice traits | Tag groups and tags (Granularity is a tag group) |
| Content fetching | Done by the local helper |
| Helper delivery | Background app with a tray icon, no interface |
| Interface | Entirely on the website |
| Sources | Supported websites, URL paste for now, extension later |
| Storage | Two independent settings: location and visibility |
| Performance score | Average of the voice's scores across tier lists |
| Voice reputation | Reviews, usage count, and a pie chart of usage by source |
| Time estimates | Personalized, based on a benchmark of the user's machine |
| Tier lists | Multiple per user, private or public |
| Player | Chapter navigation, speed control, and resume |
| Community data | Opt-in and two-way: users see others' scores, reviews, and usage only if they share their own |

### Tech stack

| Layer | Choice |
|---|---|
| Website | Next.js (App Router) + Tailwind + shadcn, pnpm |
| Auth | WorkOS |
| Database | Postgres |
| Cloud audio / objects | Cloudflare R2 |
| Local helper | Python FastAPI + tray + PyTorch |
| Helper platforms | Windows, Mac, and Linux from v1 |
| Helper packaging | Small installer; CUDA/runtime/models downloaded on demand |
| Testing | TDD with real data and real calls (no mocks). Phase 0: setup smokes for helper↔website (dev and prod differ), WorkOS, Postgres, R2; browser extension as a commented placeholder only |

---

## 7. Open items

- **Tier-to-score mapping.** How tiers turn into numbers for the average (for example S = 5 down to F = 1).
- **Reviews.** The format (star rating, text, or both), whether one review per user, and any moderation.
- **Usage counting.** What counts as one use (a job or a chapter), and how the helper reports it to the server, including for items kept only locally.
- **Data sharing details.** Exactly what "your data" covers (tier-list scores, reviews, usage), whether the choice can be changed later in Settings, and whether a user who has not opted in still sees their own data. Also confirm that "not approved" means they do not see other people's data. The dictated message was ambiguous on that point.
- **Speed measurement.** How a voice's average speed is measured and kept up to date.
- **Copyright and takedown.** Sharing audio of novels publicly is the biggest legal risk. Rules are needed for what can be shared and how reports are handled.
- **Model and voice licenses.** Commercial use and redistribution terms still apply even without cloning.
- **Cloud storage limits** and compression settings.
- **Starting TTS engines and voices.**
- **Which source websites** to support first.
- **Repo.** Whether an existing repository is used or a new one is scaffolded.
- **Later phases** after setup smokes (full feature delivery order).

---

## 8. Out of scope for this cycle

- Voice cloning and user-provided voices
- The browser extension
- Remote control of the helper from other devices
- Voice preview comparisons
- Text cleanup rules
- Pronunciation dictionary
- Export options (MP3 and audiobook files)
- Notifications
- Multiple voices per book
- Auto-fetching new chapters
