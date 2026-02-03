/* ============================================
   NEXTGEN 2.0 - SHARED JAVASCRIPT
   ============================================ */

/**
 * Initialize video seamless looping
 * Restarts video 0.3 seconds before end to avoid black frame
 */
function initVideoLoop(selector = 'video') {
  document.querySelectorAll(selector).forEach(video => {
    video.addEventListener('timeupdate', function() {
      if (this.currentTime > this.duration - 0.3) {
        this.currentTime = 0;
      }
    });
  });
}

/**
 * Initialize horizontal scroll with mouse wheel
 */
function initHorizontalScroll(selector) {
  document.querySelectorAll(selector).forEach(container => {
    container.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  });
}

/**
 * Initialize modal functionality
 * @param {string} modalId - The modal overlay element ID
 * @param {string} openBtnId - The button ID that opens the modal
 * @param {string} closeBtnId - The button ID that closes the modal (optional)
 */
function initModal(modalId, openBtnId, closeBtnId = null) {
  const modal = document.getElementById(modalId);
  const openBtn = document.getElementById(openBtnId);
  const closeBtn = closeBtnId ? document.getElementById(closeBtnId) : null;

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Close a modal by ID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Initialize button hover effects
 */
function initButtonHoverEffects(selector) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.2s ease';
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

/**
 * Initialize mood selection (single select)
 */
function initMoodSelection() {
  const moodMap = {
    'Happy': 'mood-happy',
    'Neutral': 'mood-neutral',
    'Sad': 'mood-sad'
  };

  document.querySelectorAll('.mood-option').forEach(option => {
    option.addEventListener('click', function() {
      // Highlight selected mood
      document.querySelectorAll('.mood-option').forEach(o => {
        o.style.background = '#F4F5F6';
      });
      this.style.background = '#14E25A';

      // Determine which mood was selected from the img alt text
      const img = this.querySelector('img');
      const moodKey = img ? moodMap[img.alt] : null;

      if (moodKey && aiChatResponses[moodKey]) {
        // Open AI modal and go straight to chat view
        const aiModal = document.getElementById('aiModal');
        const menuView = document.getElementById('aiMenuView');
        const chatView = document.getElementById('aiChatView');
        const chatMessages = document.getElementById('chatMessages');
        const modalBottom = document.getElementById('aiModalBottom');
        const textInput = document.getElementById('aiTextInput');

        if (aiModal && menuView && chatView && chatMessages && modalBottom) {
          // Open the modal
          aiModal.classList.add('active');
          document.body.style.overflow = 'hidden';

          // Switch to chat view
          chatMessages.innerHTML = '';
          menuView.classList.add('hidden');
          chatView.classList.add('active');
          modalBottom.classList.add('chat-mode');

          const response = aiChatResponses[moodKey];

          // Add user message
          const userMsg = document.createElement('div');
          userMsg.className = 'chat-message user';
          userMsg.textContent = response.userMessage;
          chatMessages.appendChild(userMsg);

          // Add AI response with typing animation
          setTimeout(function() {
            const typingEl = document.createElement('div');
            typingEl.className = 'chat-message ai';
            typingEl.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            chatMessages.appendChild(typingEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(function() {
              typingEl.remove();
              const aiMsg = document.createElement('div');
              aiMsg.className = 'chat-message ai';
              aiMsg.textContent = response.aiResponse;
              chatMessages.appendChild(aiMsg);
              chatMessages.scrollTop = chatMessages.scrollHeight;
              if (textInput) textInput.focus();
            }, 1200);
          }, 600);
        }
      }
    });
  });
}

/**
 * Initialize category tab switching
 */
function initCategoryTabs() {
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.category-tab').forEach(t => {
        t.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
}

/**
 * Initialize heart/favorite button toggle
 */
function initHeartButtons(selector = '.brand-card-action:last-child') {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', function() {
      const svg = this.querySelector('svg');
      if (svg.getAttribute('fill') === 'none') {
        svg.setAttribute('fill', '#FF3B30');
        svg.setAttribute('stroke', '#FF3B30');
      } else {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
      }
    });
  });
}

/**
 * Create confetti particles for celebration
 */
function createConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  const colors = ['#14E25A', '#FFD60A', '#FF9500', '#FF3B30', '#FFFFFF', '#00C7BE'];
  const shapes = ['square', 'circle'];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

    if (shapes[Math.floor(Math.random() * shapes.length)] === 'circle') {
      confetti.style.borderRadius = '50%';
    }

    container.appendChild(confetti);

    // Trigger animation
    setTimeout(() => confetti.classList.add('active'), 10);

    // Remove after animation
    setTimeout(() => confetti.remove(), 4000);
  }
}

/**
 * Animate progress bar and percentage update after workout completion
 */
function animateProgressUpdate(card, progressBars, percentDisplay, timeDisplay, workoutType) {
  // Define progress updates for each workout type
  const progressUpdates = {
    flexibility: { barIndex: 2, newPercent: '34%', newTime: '13m left' },
    strength: { barIndex: 5, newPercent: '87%', newTime: '5m left' },
    breathing: { barIndex: 1, newPercent: '20%', newTime: '32m left' }
  };

  const update = progressUpdates[workoutType] || progressUpdates.flexibility;

  // Add celebration class to card
  card.classList.add('celebrating');
  setTimeout(() => card.classList.remove('celebrating'), 600);

  // Find the correct progress bar and animate it filling
  const barToFill = progressBars[update.barIndex];
  if (barToFill && !barToFill.classList.contains('filled')) {
    barToFill.classList.add('animating');
    setTimeout(() => {
      barToFill.classList.remove('animating');
      barToFill.classList.add('filled');
    }, 500);
  }

  // Update percentage with animation
  setTimeout(() => {
    percentDisplay.classList.add('updating');
    setTimeout(() => {
      percentDisplay.textContent = update.newPercent;
      percentDisplay.classList.remove('updating');
    }, 250);
  }, 300);

  // Update time remaining
  setTimeout(() => {
    timeDisplay.textContent = update.newTime;
  }, 500);
}

/**
 * Check for workout completion and trigger celebration
 * Call this on the home/index page
 */
function checkWorkoutCompletion() {
  const completionData = localStorage.getItem('workoutCompleted');
  if (!completionData) return;

  const data = JSON.parse(completionData);
  // Only celebrate if completed within last 10 seconds
  if (Date.now() - data.timestamp > 10000) {
    localStorage.removeItem('workoutCompleted');
    return;
  }

  // Clear the completion data
  localStorage.removeItem('workoutCompleted');

  // Find the correct workout card based on type
  const workoutType = data.workout || 'flexibility';
  const workoutCard = document.querySelector(`.workout-card[data-workout="${workoutType}"]`);
  if (!workoutCard) return;

  const progressBars = workoutCard.querySelectorAll('.progress-bar');
  const percentDisplay = workoutCard.querySelector('.workout-card-percent');
  const timeDisplay = workoutCard.querySelector('.workout-card-time');

  // Update celebration subtitle based on workout type
  const celebrationSubtitle = document.querySelector('.celebration-subtitle');
  const workoutNames = {
    flexibility: 'Flexibility - Core Power',
    strength: 'Strength - Kettlebell Basics',
    breathing: 'Breathing - Deep Focus'
  };
  if (celebrationSubtitle) {
    celebrationSubtitle.textContent = workoutNames[workoutType] || 'Workout Complete';
  }

  // Start celebration sequence
  setTimeout(() => {
    // Show celebration overlay
    const celebrationOverlay = document.getElementById('celebrationOverlay');
    if (celebrationOverlay) {
      celebrationOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Create confetti
    createConfetti();

    // Auto-dismiss celebration after 2.5 seconds
    setTimeout(() => {
      if (celebrationOverlay) {
        celebrationOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Animate progress bar update
      setTimeout(() => {
        animateProgressUpdate(workoutCard, progressBars, percentDisplay, timeDisplay, workoutType);
      }, 300);
    }, 2500);
  }, 500);
}

/**
 * Store workout completion data
 * Call this when workout is completed (on player page)
 */
function storeWorkoutCompletion(workoutType, points = 125, feedback = null) {
  const completionData = {
    workout: workoutType,
    timestamp: Date.now(),
    points: points
  };

  if (feedback) {
    completionData.feedback = feedback;
  }

  localStorage.setItem('workoutCompleted', JSON.stringify(completionData));
}

/**
 * Get workout type from URL parameter
 */
function getWorkoutTypeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('workout') || 'flexibility';
}

/**
 * Initialize player page controls
 */
function initPlayerControls() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playerContainer = document.querySelector('.player-container');
  const video = document.getElementById('workoutVideo');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');

  if (!playPauseBtn || !video) return;

  let isPlaying = true;
  let hideTimeout;

  // Show play/pause button on tap
  playerContainer.addEventListener('click', function() {
    playPauseBtn.classList.add('visible');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (isPlaying) {
        playPauseBtn.classList.remove('visible');
      }
    }, 2000);
  });

  // Toggle play/pause
  playPauseBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    isPlaying = !isPlaying;

    if (isPlaying) {
      video.play();
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      hideTimeout = setTimeout(() => {
        playPauseBtn.classList.remove('visible');
      }, 2000);
    } else {
      video.pause();
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
    }
  });

  return { isPlaying: () => isPlaying, setPlaying: (val) => { isPlaying = val; } };
}

/**
 * Initialize summary modal controls
 */
function initSummaryModal() {
  const summaryModal = document.getElementById('summaryModal');
  const summaryClose = document.getElementById('summaryClose');

  if (!summaryModal) return;

  if (summaryClose) {
    summaryClose.addEventListener('click', function() {
      summaryModal.classList.remove('active');
    });
  }

  // Close on overlay click
  summaryModal.addEventListener('click', function(e) {
    if (e.target === summaryModal) {
      summaryModal.classList.remove('active');
    }
  });

  return {
    show: () => summaryModal.classList.add('active'),
    hide: () => summaryModal.classList.remove('active')
  };
}

/**
 * Format time as MM:SS
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Initialize workout timer
 * @param {number} startSeconds - Starting seconds
 * @param {function} onTick - Callback on each tick
 * @param {function} onComplete - Callback when timer reaches 0
 */
function initWorkoutTimer(startSeconds, onTick, onComplete) {
  let seconds = startSeconds;
  let isRunning = true;

  const interval = setInterval(() => {
    if (isRunning && seconds > 0) {
      seconds--;
      if (onTick) onTick(seconds, formatTime(seconds));

      if (seconds === 0) {
        if (onComplete) onComplete();
      }
    }
  }, 1000);

  return {
    pause: () => { isRunning = false; },
    resume: () => { isRunning = true; },
    stop: () => { clearInterval(interval); },
    getSeconds: () => seconds,
    isRunning: () => isRunning
  };
}

/**
 * AI Chat Interface
 * Handles the chat view transitions and dummy AI responses
 */
const aiChatResponses = {
  'mood-happy': {
    userMessage: "I'm feeling great today!",
    aiResponse: "That's awesome to hear! When you're feeling this good, it's the perfect time to push a little harder. How about trying a high-intensity workout today? Your positive energy can fuel some serious gains. Want me to suggest something challenging?"
  },
  'mood-neutral': {
    userMessage: "I'm feeling okay today.",
    aiResponse: "Thanks for checking in! A steady day is a great foundation. A moderate workout could help lift your energy even more. How about a balanced session — some strength work mixed with stretching? I'll find something that matches your vibe."
  },
  'mood-sad': {
    userMessage: "I'm not feeling great today.",
    aiResponse: "I appreciate you sharing that. On days like this, gentle movement can really help. How about a light breathing session or a calming stretch routine? No pressure — even a short walk counts. What sounds manageable right now?"
  },
  about: {
    userMessage: "Tell me about you",
    aiResponse: "I'd love to learn more about you, Mark! What are your main fitness goals right now? Understanding your interests helps me personalize your experience and recommend the right workouts for you."
  },
  feeling: {
    userMessage: "How are you feeling today?",
    aiResponse: "Thanks for checking in! How would you describe your energy level today? Based on how you're feeling, I can adjust today's workout intensity to match your needs."
  },
  food: {
    userMessage: "Food scan",
    aiResponse: "Great! Let's log your nutrition. What did you have for your last meal? I can help you track macros, calories, and identify patterns in your eating habits."
  },
  mobility: {
    userMessage: "Mobility scan",
    aiResponse: "Let's assess your mobility! I'll guide you through a quick series of movements to check your hip flexibility, shoulder mobility, and spine rotation. Ready to start?"
  },
  body: {
    userMessage: "Body comp scan",
    aiResponse: "Time to check your progress! Body composition tracking helps us see changes beyond the scale. Would you like to input your measurements manually, or connect to a smart scale?"
  }
};

function initAIChat() {
  const menuView = document.getElementById('aiMenuView');
  const chatView = document.getElementById('aiChatView');
  const chatMessages = document.getElementById('chatMessages');
  const chatBackBtn = document.getElementById('chatBackBtn');
  const modalBottom = document.getElementById('aiModalBottom');
  const textInput = document.getElementById('aiTextInput');
  const sendBtn = document.getElementById('aiSendBtn');
  const actionsContainer = document.getElementById('aiActions');
  const aiModal = document.getElementById('aiModal');

  if (!menuView || !chatView || !chatMessages || !modalBottom) {
    return;
  }

  // Direct click handlers on each card
  const actionCards = document.querySelectorAll('.ai-action-card[data-action]');

  actionCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      if (action && aiChatResponses[action]) {
        openChatView(action);
      }
    });
  });

  // Handle back button
  if (chatBackBtn) {
    chatBackBtn.addEventListener('click', closeChatView);
  }

  // Handle send button
  if (sendBtn) {
    sendBtn.addEventListener('click', sendUserMessage);
  }

  // Handle enter key in input
  if (textInput) {
    textInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendUserMessage();
      }
    });
  }

  // Reset to menu view when modal is closed
  if (aiModal) {
    aiModal.addEventListener('click', function(e) {
      if (e.target === aiModal) {
        closeChatView();
      }
    });
  }

  function openChatView(action) {
    const response = aiChatResponses[action];

    // Clear previous messages
    chatMessages.innerHTML = '';

    // Switch views
    menuView.classList.add('hidden');
    chatView.classList.add('active');
    modalBottom.classList.add('chat-mode');

    // Add user message (what they selected)
    addMessage(response.userMessage, 'user');

    // Add single AI response with typing animation
    setTimeout(function() {
      const typingId = showTypingIndicator();
      setTimeout(function() {
        removeTypingIndicator(typingId);
        addMessage(response.aiResponse, 'ai');
        // Focus input after AI responds
        if (textInput) textInput.focus();
      }, 1200);
    }, 600);
  }

  function closeChatView() {
    chatView.classList.remove('active');
    menuView.classList.remove('hidden');
    modalBottom.classList.remove('chat-mode');
    chatMessages.innerHTML = '';
  }

  function addMessage(text, type) {
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message ' + type;
    messageEl.textContent = text;
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message ai';
    typingEl.id = 'typing-' + Date.now();
    typingEl.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingEl.id;
  }

  function removeTypingIndicator(id) {
    const typingEl = document.getElementById(id);
    if (typingEl) {
      typingEl.remove();
    }
  }

  function sendUserMessage() {
    if (!textInput) return;
    const text = textInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    textInput.value = '';

    // Simulate AI response
    setTimeout(function() {
      const typingId = showTypingIndicator();
      setTimeout(function() {
        removeTypingIndicator(typingId);
        addMessage("Thanks for sharing! I'm here to help you on your wellness journey. What else would you like to know?", 'ai');
      }, 1200);
    }, 400);
  }
}

// ===========================================
// FOOD CAMERA & LOGGING
// ===========================================

let cameraStream = null;
let capturedImageData = null;

/**
 * Initialize food camera functionality
 */
function initFoodCamera() {
  const cameraModal = document.getElementById('cameraModal');
  const cameraBtn = document.getElementById('foodCameraBtn');
  const foodLogCard = document.getElementById('foodLogCard');

  if (!cameraModal || !cameraBtn) return;

  // Camera button opens camera modal
  cameraBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openCameraModal();
  });

  // Food log card navigates to food log page
  if (foodLogCard) {
    foodLogCard.addEventListener('click', (e) => {
      if (e.target.closest('.food-log-camera-btn')) return;
      window.location.href = 'food-log.html';
    });
  }

  // Cancel buttons
  const cameraCancelTop = document.getElementById('cameraCancelTop');
  const ratingCancelTop = document.getElementById('ratingCancelTop');
  const ratingCancelBottom = document.getElementById('ratingCancelBottom');

  if (cameraCancelTop) {
    cameraCancelTop.addEventListener('click', closeCameraModal);
  }
  if (ratingCancelTop) {
    ratingCancelTop.addEventListener('click', closeCameraModal);
  }
  if (ratingCancelBottom) {
    ratingCancelBottom.addEventListener('click', closeCameraModal);
  }

  // Capture button
  const captureBtn = document.getElementById('captureBtn');
  if (captureBtn) {
    captureBtn.addEventListener('click', capturePhoto);
  }

  // Rating buttons
  const ratingGood = document.getElementById('ratingGood');
  const ratingBad = document.getElementById('ratingBad');

  if (ratingGood) {
    ratingGood.addEventListener('click', () => logFood('good'));
  }
  if (ratingBad) {
    ratingBad.addEventListener('click', () => logFood('bad'));
  }
}

/**
 * Open camera modal and start camera stream
 */
async function openCameraModal() {
  const cameraModal = document.getElementById('cameraModal');
  const cameraView = document.getElementById('cameraView');
  const ratingView = document.getElementById('ratingView');
  const video = document.getElementById('cameraVideo');

  if (!cameraModal) return;

  // Reset views
  cameraView.classList.add('active');
  ratingView.classList.remove('active');

  // Show modal
  cameraModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Start camera
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    video.srcObject = cameraStream;
  } catch (err) {
    console.error('Camera access denied:', err);
    alert('Camera access is required to log food. Please allow camera access and try again.');
    closeCameraModal();
  }
}

/**
 * Close camera modal and stop camera stream
 */
function closeCameraModal() {
  const cameraModal = document.getElementById('cameraModal');
  const video = document.getElementById('cameraVideo');

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  if (video) {
    video.srcObject = null;
  }

  if (cameraModal) {
    cameraModal.classList.remove('active');
  }

  document.body.style.overflow = '';
  capturedImageData = null;
}

/**
 * Capture photo from video stream
 */
function capturePhoto() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  const capturedPhoto = document.getElementById('capturedPhoto');
  const cameraView = document.getElementById('cameraView');
  const ratingView = document.getElementById('ratingView');

  if (!video || !canvas) return;

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame to canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  // Get image data
  capturedImageData = canvas.toDataURL('image/jpeg', 0.8);

  // Show captured image in rating view
  if (capturedPhoto) {
    capturedPhoto.src = capturedImageData;
  }

  // Stop camera stream
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  video.srcObject = null;

  // Switch to rating view
  cameraView.classList.remove('active');
  ratingView.classList.add('active');
}

/**
 * Log food item with rating
 */
function logFood(rating) {
  if (!capturedImageData) return;

  const foodLog = getFoodLog();

  const newEntry = {
    id: generateId(),
    image: capturedImageData,
    rating: rating,
    timestamp: Date.now()
  };

  foodLog.unshift(newEntry);
  saveFoodLog(foodLog);

  // Close modal
  closeCameraModal();

  // Update food list on home page if present
  updateFoodListDisplay();
}

/**
 * Get food log from localStorage
 */
function getFoodLog() {
  try {
    const log = localStorage.getItem('foodLog');
    return log ? JSON.parse(log) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Save food log to localStorage
 */
function saveFoodLog(log) {
  try {
    localStorage.setItem('foodLog', JSON.stringify(log));
  } catch (e) {
    console.error('Failed to save food log:', e);
  }
}

/**
 * Generate unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format timestamp for display
 */
function formatFoodTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format date for display
 */
function formatFoodDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}

/**
 * Update food list display on home page
 */
function updateFoodListDisplay() {
  const foodList = document.querySelector('.food-list');
  if (!foodList) return;

  const foodLog = getFoodLog();
  const todayEntries = foodLog.filter(entry => {
    const entryDate = new Date(entry.timestamp).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  }).slice(0, 3);

  if (todayEntries.length === 0) return;

  // Clear existing items and add logged items
  foodList.innerHTML = '';

  todayEntries.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'food-list-item';
    item.innerHTML = `
      <div class="food-list-image" style="background-image: url('${entry.image}')"></div>
      <div class="food-list-info">
        <div class="food-list-name">Logged meal</div>
        <div class="food-list-detail">${entry.rating === 'good' ? 'Healthy choice' : 'Could be better'}</div>
      </div>
      <div class="food-list-time">${formatFoodTime(entry.timestamp)}</div>
    `;
    foodList.appendChild(item);
  });
}

/**
 * Render food log page
 */
function renderFoodLogPage() {
  const entriesContainer = document.getElementById('foodLogEntries');
  const emptyState = document.getElementById('foodLogEmpty');

  if (!entriesContainer) return;

  const foodLog = getFoodLog();

  if (foodLog.length === 0) {
    entriesContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  entriesContainer.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';

  // Group by date
  const grouped = {};
  foodLog.forEach(entry => {
    const dateKey = formatFoodDate(entry.timestamp);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(entry);
  });

  entriesContainer.innerHTML = '';

  Object.entries(grouped).forEach(([date, entries]) => {
    // Date header
    const dateHeader = document.createElement('div');
    dateHeader.className = 'food-log-date';
    dateHeader.textContent = date;
    entriesContainer.appendChild(dateHeader);

    // Entries
    entries.forEach(entry => {
      const entryEl = document.createElement('div');
      entryEl.className = 'food-log-entry';
      entryEl.innerHTML = `
        <div class="food-log-entry-image" style="background-image: url('${entry.image}')"></div>
        <div class="food-log-entry-info">
          <div class="food-log-entry-time">${formatFoodTime(entry.timestamp)}</div>
          <div class="food-log-entry-date">${entry.rating === 'good' ? 'Healthy choice' : 'Could improve'}</div>
        </div>
        <div class="food-log-entry-rating ${entry.rating}">
          ${entry.rating === 'good'
            ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>'
          }
        </div>
      `;
      entriesContainer.appendChild(entryEl);
    });
  });
}

// Export for module usage (if needed in future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initVideoLoop,
    initHorizontalScroll,
    initModal,
    closeModal,
    initButtonHoverEffects,
    initMoodSelection,
    initCategoryTabs,
    initHeartButtons,
    createConfetti,
    animateProgressUpdate,
    checkWorkoutCompletion,
    storeWorkoutCompletion,
    getWorkoutTypeFromURL,
    initPlayerControls,
    initSummaryModal,
    formatTime,
    initWorkoutTimer,
    initAIChat,
    initFoodCamera,
    getFoodLog,
    renderFoodLogPage
  };
}
