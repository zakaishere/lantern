# Lantern

A private, local-network video library. Your files stay in their existing folders. No cloud account, upload, Docker, or copying to your phone.

## Start on Windows

1. Install Node.js **22.13 or newer** (a current LTS release is recommended), including npm.
2. Double-click **Start Lantern.bat**. The first start downloads dependencies and builds the app. Keep the window open while watching.
3. Open http://localhost:4173 on the hosting PC. Enter the six-digit PIN printed in the Lantern window. If the browser opens before the server is ready, refresh it.
4. Open **Settings** to see copyable phone addresses, then choose **Browse…** to open the actual Windows folder picker, or type an existing full folder path and press **Add folder**. The picker appears on the hosting PC; it may appear behind other windows. Use Rescan after adding or changing files. Remove removes the folder from the library, never the videos.
5. Connect your phone to the same Wi-Fi, then open the phone address printed in the Lantern window (for example `http://192.168.1.10:4173`). Enter the same PIN. Use the hosting PC's localhost address for folder management.

Alternatively, in a terminal in this project folder: `npm install`, `npm run build`, then `npm start`.

## Windows firewall

If the phone cannot connect, confirm both devices are on the same private Wi-Fi (guest networks can isolate devices), and try the printed LAN address. If Windows asks about Node.js access, allow it on **Private networks** only. Otherwise add a Windows Defender Firewall inbound TCP rule for port **4173**, scoped to the Private profile and your local subnet. Do not forward this port on your router or expose the app to the internet. VPNs may interfere. Close the terminal to stop the server.

## Organizing files

Use a library folder containing series folders, optionally with season folders, for example `TV/Example Show/Season 01/Example.Show.S01E02.mp4`. Lantern recognizes `S01E02` and `1x02`; it also uses season folder names and simple episode numbers when possible. Files directly inside an added folder are grouped under that folder's name. Rescanning updates the index; progress is kept by file path. Renaming or moving a file creates a new identity.

MP4 with H.264 video and AAC audio is the best starting point. MKV playback depends on your browser and the codecs in the file. The earlier direct player is restored; audio-track and embedded-subtitle selection are not currently available in Lantern. For subtitles, place a `.vtt` file with the same base name next to the video. WebM, AVI and MOV playback depends on the browser. Progress, resume, next episode and search work across devices using the same local library.

## Privacy and limits

The six-digit PIN is generated on first start and stored in `data/pin.txt`; keep it private. Delete that file while the server is stopped to generate a new PIN. Existing sessions are held in server memory and expire after 24 hours or server restart. PIN guessing is rate-limited per IP. Folder management requires an authenticated browser on localhost; streaming uses indexed IDs and rejects paths outside indexed folders. Symlinks are skipped while scanning. LAN HTTP is unencrypted: use only a trusted private network. Other people on that network may be able to observe traffic; this is not an internet-facing security boundary. No remote access, HTTPS, multiple user profiles, automated artwork, or password recovery is provided. Data and the PIN live in the project's `data` folder; back it up if desired.

## Checks

Run `npm test` and `npm run build`. The server uses Node's built-in SQLite module, so older Node releases will not work. To change the listening port for a terminal session, set `PORT` before running `npm start`; use that port in the URLs and firewall rule.

If Browse does not appear, close Lantern and start it by double-clicking **Start Lantern.bat** on the PC desktop. The picker needs an interactive Windows session. Check behind other windows, or enter the folder's full path directly in Settings. Avoid starting the server as a Windows service or in a non-interactive background session.

## Browse your actual folders

Add the top-level folder that contains your shows in Settings. Open **Browse folders** to enter that folder, then open any nested folder, season, and episode. Empty folders are shown too. Only indexed video files are displayed; other files are not listed. After updating from an older version or adding files, use **Rescan** in Settings once to populate the folder view. Next episode in folder view follows the filenames within the same folder.
