
---

### 2. `CHANGELOG.md`
Create a new file named **`CHANGELOG.md`** in the root folder.

```markdown
# Changelog

All notable changes to the Spotibaiii project will be documented in this file.

## [1.0.0] - 2026-11-02
### Added
*   **Core Audio System:** Integrated HTML5 Audio with React Context to allow continuous playback while navigating between pages.
*   **Karaoke Lyrics:** Added an auto-scrolling lyrics page with dynamic highlighting based on song duration.
*   **Admin Dashboard:** Added secure file uploads for songs (MP3/Images), profile avatars, and ad videos.
*   **Authentication:** Integrated JWT-based login/register system with bcrypt password hashing.
*   **Search System:** Implemented case-insensitive regex search by song title or artist.
*   **Favorites:** Added functionality to heart/unheart songs and view them on a dedicated page.
*   **Mid-Roll Ads:** Added logic to trigger a video advertisement overlay when a song reaches 50% of its duration.
*   **User Profiles:** Dynamic user profiles showing uploaded songs, profile picture uploads, and user stats.

### Changed
*   Migrated local `uploads` folder to **Cloudinary** for permanent, production-ready media storage.
*   Refactored the music player into a 3-column responsive layout (desktop) and compact layout (mobile).
*   Replaced placeholder UI with dynamic data fetched from MongoDB.

### Fixed
*   Resolved CORS issues between the React frontend and Express backend.
*   Fixed capitalization bugs (e.g., `Playlist.js`) that caused crashes on Linux-based hosting (Render).
*   Fixed Express 5 wildcard routing crash (`app.get('*')` to `app.get(/(.*)/)`).
*   Resolved mobile responsiveness issues by adding a sticky Bottom Navigation bar.

## [0.1.0] - 2026-10-15
### Added
*   Initial repository setup with Vite + React and Express + MongoDB.
*   Basic routing (React Router) and sidebar navigation layout.
*   Database connection using Mongoose.
*   Initial Tailwind CSS styling and dark mode aesthetic.