# 🕒 Late-Meet: AI Meeting Copilot

Late-Meet is a high-performance, AI-driven assistant designed to provide real-time meeting intelligence. Say goodbye to the anxiety of joining a meeting late or losing track of the discussion—Late-Meet acts as your silent, personal meeting assistant.

> **Note**: Currently, Late-Meet is exclusively designed as a Chrome Extension for **Google Meet**.

## The Problem Statement ⚠️
Joining a meeting late often leaves participants disconnected and scrambling for context. Forcing the meeting to pause while others catch you up disrupts the flow of the entire team. Existing AI note-takers often act as intrusive bots in the call and might produce massive transcripts that take too much time to read. There is a lack of instant and concise briefings for users who simply want to know: *"What did I miss?"*

## Our Solution 💡
Late-Meet solves this by living natively within your browser. Without adding an obnoxious bot to the call, it captures audio locally, translates it to text, and uses AI to generate instant contextual briefings and summaries. The application will post a public message in the chatbox that everyone can see, but it is specifically tailored to brief the late joiner so they can catch up seamlessly.

**Important Architecture Requirement:** 
Late-Meet operates on a peer-to-peer relay architecture. This means the extension **must be installed on both the host's device and the late joiner's device** to function correctly. 

---

### Phase 1: The Core Foundation (Current Phase) 🚀
The initial release focuses on establishing robust and high-performance audio capture and AI insights specifically for Google Meet.

- **Background Audio Capture (Offscreen API)**: Modern architectures utilizing Chrome's Offscreen Documents and `chrome.tabCapture` to reliably intercept meeting audio without disrupting tab activity.
- **BYOK (Bring Your Own Key) Engine**: The extension relies on a user-provided API key (e.g., OpenAI or any compatible chatbot API) to listen to audio, transcribe it, and power the AI engine to summarize topics, decisions, and actions, giving full context to the late joiner.
- **Premium Glassmorphism Interface**: A stunning, modern dark theme side-panel dashboard. Built with sleek CSS aesthetics—no clunky popups.
- **Chatbox Integration**: Automatically sends a public message in the meeting chatbox containing the briefing aimed at the late joiner.

### Phase 2: Platform Expansion & Terminal CLI (Coming Soon) 🔄
- **NPM Package & Desktop Support**: Transitioning beyond a Chrome Extension into an NPM package runnable directly in your terminal. This will unlock support for offline, native meeting platforms like **Zoom**.
- **Supabase Realtime Backend**: Transition from local-only storage to live syncing across authorized team members, ensuring late joiners can easily request transcripts.
- **AI Topic Tracking & Action Items**: Instantly detect and categorize action items (e.g., "Add Jira ticket for..."), tracking the active conversation topic.
- **Live Translation**: On-the-fly translation bridging language gaps for international teams.

### Phase 3: Enterprise & Scale (Coming Soon) 📈
- **Speaker Diarization (Who Spoke)**: Advanced voice fingerprinting to accurately partition transcripts by speaker.
- **Seamless Export Integrations**: Auto-push notes and action items to Slack, Notion, Jira, or Google Docs once the meeting ends.
- **Analytics Dashboard**: Post-meeting insights—visualize total talk-time per speaker, meeting efficiency rating, and focus areas.

---

## 🛠 Project Structure & Technology Stack
- **Extension Architecture**: Manifest V3 compliant, Offscreen Documents, Service Workers.
- **Styling**: Vanilla CSS designed with a custom *Dark Glassmorphism* aesthetic.
- **AI Pipeline**: Relies on user-provided API keys (OpenAI Whisper/GPT or equivalent) to listen, transcribe, and summarize content.
- **Relay System**: Supabase Realtime (handing host-to-client relay).

## 📦 Installation & Setup (Developer)
1. Clone this repository: `git clone https://github.com/shouri123/Late-Meet.git`
2. Open Google Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the root directory of this extension.
5. Setup your API keys (OpenAI or another capable chatbot API) in the extension's options page. The AI is responsible for transcribing, summarizing topics, extracting decisions, and tracking actions.
6. **Ensure the host of the meeting also has the extension installed.**
7. Join a Google Meet and open the side-panel!
