const briefForm = document.getElementById('brief-form');
const hookOptions = document.getElementById('hook-options');
const hookList = hookOptions.querySelector('ul');
const scriptContent = document.getElementById('script-content');
const chatForm = document.getElementById('chat-form');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const copyButton = document.getElementById('copy-script');

const pacingMoments = [
  'Pattern interrupt B-roll sequence',
  'Fast-cut retention spike with kinetic text',
  'Story beat: personal vulnerability reveal',
  'Proof montage with motion graphics overlay',
  'Silent pause to let the promise land',
  'Unexpected question to reset viewer attention',
  'Quick testimonial snapshot to anchor credibility',
];

const mentorResponses = [
  {
    trigger: /hook|intro|opening/i,
    response:
      'Lead with a curiosity gap plus a systems payoff. Example: "I took a faceless channel from 0 to $10K/mo without showing my face — here’s the 3-part automation stack you can clone."',
  },
  {
    trigger: /retention|drop off|watch time/i,
    response:
      'Stack micro-commitments every 45 seconds. Use rhythmic checkpoints: tease the next payoff, reframe the stakes, then escalate with proof or contrast footage.',
  },
  {
    trigger: /cta|call to action|sell/i,
    response:
      'Thread the CTA through the narrative as a tool, not a sales pitch. Introduce it as the next logical step after the transformation lands, then show a case study clip.',
  },
  {
    trigger: /b-roll|visuals|footage/i,
    response:
      'Alternate between screen recordings, motion graphic overlays, and stock macro shots. Pair each with on-screen text that echoes the key copy so silent viewers stay locked.',
  },
];

const defaultMentorReply =
  'Map your video like a Netflix episode: hook (0-0:30), conflict + data (0:30-4:00), transformation (4:00-8:00), monetization bridge (8:00-10:00), call-to-action crescendo (10:00-end).';

function createHookIdeas(topic, promise, persona) {
  const angles = [
    `I gave ${persona} a faceless playbook — here’s how ${topic.toLowerCase()} became their leverage.`,
    `${topic} broke the algorithm. The retention graph proves it and you can swipe the system.`,
    `From anonymous to unstoppable: The ${promise.toLowerCase()} that rewired this faceless channel.`,
    `This silent build made ${promise.toLowerCase()} happen. Watch the automation stack do the work.`,
    `They thought faceless meant low trust. ${topic} destroys that myth in 12 minutes flat.`,
  ];
  return angles;
}

function buildScript({ topic, promise, persona, length, retention }) {
  const midpoint = Math.floor((length * 60) / 5);
  const retentionMoments = pacingMoments
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((moment, index) => `${index + 1}. ${moment}`)
    .join('\n');

  return `TITLE\n${topic}: ${promise}\n\nHOOK OPTIONS\n- ${createHookIdeas(topic, promise, persona).join('\n- ')}\n\nSTRUCTURE\n1. Cold open with visceral problem: what happens if the viewer ignores this?\n2. Promise the ${promise.toLowerCase()} with a screenshot of proof.\n3. Introduce the Creator Cash automation pillars (research, scripting, monetization).\n4. Walk through the stack with voiceover while B-roll showcases the system.\n5. Roadblock montage: ${persona} struggles until the faceless workflow kicks in.\n6. Payoff reveal + watch time receipt.\n7. Monetization bridge into CTA (offer, affiliate, or lead magnet).\n\nRHYTHM PLAYBOOK\n- Video length target: ${length} minutes.\n- Retention goal: ${retention}%.\n- Every ${midpoint} seconds drop a loom overlay with the next cliffhanger.\n\nPATTERN INTERRUPTS\n${retentionMoments}\n\nSCRIPT BEATS\n[Intro]\nSet up the stakes in two sentences, flash the analytics spike, and whisper the unfair advantage.\n\n[Act 1 — Diagnose]\nShow the old workflow failing. Layer in captions that emphasize wasted time and low CPMs. Use Creator Cash voiceover: confident, rhythmic, no filler.\n\n[Act 2 — Deploy]\nReveal the three automation levers. Demonstrate screen recordings. Insert a bold on-screen stat every 40 seconds.\n\n[Act 3 — Transform]\nNarrate the before/after numbers, highlight audience response, and tease the final CTA.\n\n[Outro]\nDeliver the CTA as a continuation of the transformation. Offer the Faceless PlayBook membership or template pack as the logical next step.`;
}

function renderScript(text) {
  scriptContent.innerHTML = '';
  const sections = text.split('\n\n');
  sections.forEach((section) => {
    if (!section.trim()) return;
    if (section.includes('\n')) {
      const [title, ...rest] = section.split('\n');
      const block = document.createElement('div');
      if (title.match(/^[A-Z\[\]]/)) {
        const heading = document.createElement('h4');
        heading.textContent = title;
        block.appendChild(heading);
        const body = document.createElement('pre');
        body.textContent = rest.join('\n');
        block.appendChild(body);
      } else {
        const body = document.createElement('pre');
        body.textContent = section;
        block.appendChild(body);
      }
      scriptContent.appendChild(block);
    }
  });
}

briefForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(briefForm);
  const topic = formData.get('topic');
  const promise = formData.get('promise');
  const persona = formData.get('persona');
  const length = Number(formData.get('length'));
  const retention = Number(formData.get('retention'));

  const hooks = createHookIdeas(topic, promise, persona);
  hookList.innerHTML = '';
  hooks.forEach((hook) => {
    const li = document.createElement('li');
    li.textContent = hook;
    hookList.appendChild(li);
  });
  hookOptions.classList.add('active');

  const script = buildScript({ topic, promise, persona, length, retention });
  renderScript(script);

  addChatMessage('system', 'Blueprint created. Drop follow-up questions for deeper retention tweaks.');
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  addChatMessage('user', userMessage);
  chatInput.value = '';

  const response = getMentorResponse(userMessage);
  setTimeout(() => {
    addChatMessage('system', response);
  }, 350);
});

function addChatMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role === 'user' ? 'user' : 'system'}`;

  const heading = document.createElement('h4');
  heading.textContent = role === 'user' ? 'You' : 'Creator Cash AI';
  const body = document.createElement('p');
  body.textContent = text;

  message.appendChild(heading);
  message.appendChild(body);
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getMentorResponse(message) {
  for (const rule of mentorResponses) {
    if (rule.trigger.test(message)) {
      return rule.response;
    }
  }
  return defaultMentorReply;
}

copyButton.addEventListener('click', async () => {
  const text = scriptContent.innerText.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Copied!';
    setTimeout(() => (copyButton.textContent = 'Copy Script'), 1800);
  } catch (error) {
    copyButton.textContent = 'Copy failed';
    setTimeout(() => (copyButton.textContent = 'Copy Script'), 1800);
  }
});

// Seed conversation with persona
addChatMessage(
  'system',
  'You are tapping into Creator Cash’s 274M-view experience. Ask anything about scripting, retention curves, monetization, or automation workflows.'
);
