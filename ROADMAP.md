# Late Meet Roadmap - Improving Stability and Intelligence

<objective>
Migrate the Late Meet extension to TypeScript for enhanced stability. 
Implement AI transcription refinement to improve clarity.
Upgrade participant counting to a robust, event-driven algorithm.
</objective>

## Phase 1: Foundation & TypeScript Migration
<task type="auto" effort="medium">
  <name>Initialize Build System</name>
  <action>
    Initialize npm, install Vite, TypeScript, and @crxjs/vite-plugin.
    Create vite.config.ts and tsconfig.json.
  </action>
  <verify>npm run build succeeds</verify>
</task>

<task type="auto" effort="high">
  <name>Migrate Core Logic to TypeScript</name>
  <action>
    Convert background.js, content.js, and offscreen.js to .ts.
    Introduce types and interfaces for the state and message passing.
  </action>
  <verify>type-check passes</verify>
</task>

## Phase 2: Intelligence & Counting
<task type="auto" effort="medium">
  <name>AI Transcription Refinement</name>
  <action>
    Implement refineTranscription function in background.ts.
    Update the audio processing pipeline.
  </action>
  <verify>transcript entries show refined text</verify>
</task>

<task type="auto" effort="medium">
  <name>Advanced Participant Counting</name>
  <action>
    Implement event-driven counting logic (Host=1, Join=+1).
    Update state and broadcast mechanisms.
  </action>
  <verify>count increments correctly when participants join</verify>
</task>
