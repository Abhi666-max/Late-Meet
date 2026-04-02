// Dashboard Script — AI Meeting Copilot Side Panel

document.addEventListener('DOMContentLoaded', async () => {

  // ——— Tab Switching ———
  const tabs = document.querySelectorAll('.dash-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // ——— Initial State ———
  try {
    const state = await chrome.runtime.sendMessage({ type: 'GET_STATE' });
    if (state) updateDashboard(state);
  } catch { /* no meeting data yet */ }

  // ——— Listen for State Updates ———
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'STATE_UPDATE') {
      updateDashboard(message.state);
    }
  });

  // ——— Duration Timer ———
  let timerInterval = null;

  function startTimer(startTime) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      document.getElementById('dash-timer').textContent = formatDuration(elapsed);
    }, 1000);
  }

  // ——— Update Dashboard ———
  function updateDashboard(state) {
    // Status
    const statusDot = document.querySelector('.dash-status-dot');
    const statusText = document.getElementById('dash-status-text');
    if (state.isActive) {
      statusDot.classList.add('active');
      statusText.textContent = `Meeting active — ${state.meetingId || 'unknown'}`;
      if (state.startTime) startTimer(state.startTime);
    } else {
      statusDot.classList.remove('active');
      statusText.textContent = 'No active meeting';
    }

    // Summary
    document.getElementById('dash-summary').textContent = state.summary || 'Waiting for conversation to begin...';

    // Current Topic
    document.getElementById('dash-current-topic').textContent = state.currentTopic || 'Detecting...';

    // Stats
    document.getElementById('dash-topic-count').textContent = state.topics?.length || 0;
    document.getElementById('dash-decision-count').textContent = state.decisions?.length || 0;
    document.getElementById('dash-action-count').textContent = state.actionItems?.length || 0;
    document.getElementById('dash-people-count').textContent = state.participants?.length || 0;

    // Sentiment
    updateSentiment(state.sentiment);

    // Key Insights
    updateInsights(state.keyInsights);

    // Topics Tab
    updateTopics(state.topics);

    // Decisions Tab
    updateDecisions(state.decisions);

    // Actions Tab
    updateActions(state.actionItems);

    // People Tab
    updatePeople(state.participants, state.lateJoiners);

    // Timeline Tab
    updateTimeline(state.timeline);
  }

  // ——— Sentiment ———
  function updateSentiment(sentiment) {
    const fill = document.getElementById('dash-sentiment-fill');
    const label = document.getElementById('dash-sentiment-label');
    const map = {
      positive: { width: '85%', text: 'Positive 😊', color: '#34D399' },
      negative: { width: '20%', text: 'Negative 😟', color: '#F87171' },
      neutral: { width: '50%', text: 'Neutral 😐', color: '#94A3B8' },
      mixed: { width: '55%', text: 'Mixed 🤔', color: '#FBBF24' }
    };
    const s = map[sentiment] || map.neutral;
    fill.style.width = s.width;
    label.textContent = s.text;
    label.style.color = s.color;
  }

  // ——— Key Insights ———
  function updateInsights(insights) {
    const list = document.getElementById('dash-insights-list');
    if (!insights || insights.length === 0) {
      list.innerHTML = '<li class="empty-msg">Insights will appear as the conversation progresses</li>';
      return;
    }
    list.innerHTML = insights.map(i => `<li>${i}</li>`).join('');
  }

  // ——— Topics ———
  function updateTopics(topics) {
    const container = document.getElementById('dash-topics-full');
    if (!topics || topics.length === 0) {
      container.innerHTML = '<div class="empty-msg">No topics detected yet</div>';
      return;
    }
    container.innerHTML = topics.map(t => `
      <div class="topic-full-item">
        <div class="topic-full-dot ${t.status || 'active'}"></div>
        <div class="topic-full-info">
          <div class="topic-full-name">${t.name}</div>
          <div class="topic-full-meta">${t.duration || ''} ${t.startTime ? `• Started ${t.startTime}` : ''}</div>
        </div>
        <span class="topic-full-badge ${t.status || 'active'}">${t.status || 'active'}</span>
      </div>
    `).join('');
  }

  // ——— Decisions ———
  function updateDecisions(decisions) {
    const container = document.getElementById('dash-decisions-list');
    if (!decisions || decisions.length === 0) {
      container.innerHTML = '<div class="empty-msg">No decisions detected yet</div>';
      return;
    }
    container.innerHTML = decisions.map(d => `
      <div class="decision-item">
        <div class="decision-text">${d.text}</div>
        <div class="decision-meta">${d.by ? `By ${d.by}` : ''} ${d.timestamp ? `• ${d.timestamp}` : ''}</div>
      </div>
    `).join('');
  }

  // ——— Action Items ———
  function updateActions(actions) {
    const container = document.getElementById('dash-actions-list');
    if (!actions || actions.length === 0) {
      container.innerHTML = '<div class="empty-msg">No action items detected yet</div>';
      return;
    }
    container.innerHTML = actions.map(a => `
      <div class="action-item">
        <div class="action-check"></div>
        <div class="action-info">
          <div class="action-task">${a.task}</div>
          ${a.owner ? `<span class="action-owner">👤 ${a.owner}</span>` : ''}
          ${a.deadline ? `<div class="action-deadline">📅 ${a.deadline}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  // ——— People ———
  function updatePeople(participants, lateJoiners) {
    const container = document.getElementById('dash-participants-list');
    if (!participants || participants.length === 0) {
      container.innerHTML = '<div class="empty-msg">No participants detected</div>';
      return;
    }

    container.innerHTML = participants.map(name => {
      const isLate = lateJoiners?.includes(name);
      const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      return `
        <div class="participant-item">
          <div class="participant-avatar">${initials}</div>
          <span class="participant-name">${name}</span>
          <span class="participant-tag ${isLate ? 'late' : 'original'}">${isLate ? '🚪 Late' : 'Original'}</span>
        </div>
      `;
    }).join('');

    // Late joiner section
    const lateCard = document.getElementById('late-joiners-card');
    const lateList = document.getElementById('dash-late-joiners');
    if (lateJoiners && lateJoiners.length > 0) {
      lateCard.style.display = 'block';
      lateList.innerHTML = lateJoiners.map(name => `
        <div class="late-joiner-card-item">
          <span>🚪</span>
          <span style="font-weight: 600; color: #FCD34D;">${name}</span>
          <span style="margin-left: auto; color: #475569; font-size: 11px;">Brief sent ✓</span>
        </div>
      `).join('');
    } else {
      lateCard.style.display = 'none';
    }
  }

  // ——— Timeline ———
  function updateTimeline(timeline) {
    const container = document.getElementById('dash-timeline');
    if (!timeline || timeline.length === 0) {
      container.innerHTML = '<div class="empty-msg">Timeline will build as the meeting progresses</div>';
      return;
    }

    container.innerHTML = timeline.map(entry => {
      const icon = getTimelineIcon(entry.event);
      return `
        <div class="timeline-item">
          <div class="timeline-marker">${icon}</div>
          <div class="timeline-info">
            <div class="timeline-event">${entry.event}</div>
            <div class="timeline-time">${formatDuration(entry.elapsed || 0)} elapsed</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getTimelineIcon(event) {
    if (event.includes('started')) return '🟢';
    if (event.includes('ended')) return '🔴';
    if (event.includes('joined')) return '🚪';
    if (event.includes('Topic')) return '💬';
    if (event.includes('Decision')) return '✅';
    return '📌';
  }

  // ——— Export ———
  document.getElementById('export-btn').addEventListener('click', async () => {
    try {
      const state = await chrome.runtime.sendMessage({ type: 'GET_STATE' });
      if (!state) return;

      let markdown = `# Meeting Summary\n\n`;
      markdown += `**Date:** ${new Date().toLocaleDateString()}\n`;
      markdown += `**Duration:** ${formatDuration(state.duration || 0)}\n`;
      markdown += `**Participants:** ${state.participants?.join(', ') || 'N/A'}\n\n`;
      markdown += `## Summary\n${state.summary || 'N/A'}\n\n`;

      if (state.topics?.length) {
        markdown += `## Topics\n`;
        state.topics.forEach(t => markdown += `- ${t.name} (${t.status})\n`);
        markdown += '\n';
      }

      if (state.decisions?.length) {
        markdown += `## Decisions\n`;
        state.decisions.forEach(d => markdown += `- ${d.text}${d.by ? ` — ${d.by}` : ''}\n`);
        markdown += '\n';
      }

      if (state.actionItems?.length) {
        markdown += `## Action Items\n`;
        state.actionItems.forEach(a => {
          markdown += `- [ ] ${a.task}`;
          if (a.owner) markdown += ` → ${a.owner}`;
          if (a.deadline) markdown += ` (due: ${a.deadline})`;
          markdown += '\n';
        });
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(markdown);

      const btn = document.getElementById('export-btn');
      btn.innerHTML = '<span>✅</span> Copied to clipboard!';
      setTimeout(() => {
        btn.innerHTML = '<span>📥</span> Export Summary';
      }, 2000);
    } catch (err) {
      console.error('Export failed:', err);
    }
  });

  // ——— Helpers ———
  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
});
