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
  document.querySelectorAll('.mood-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.mood-option').forEach(o => {
        o.style.background = '#F4F5F6';
      });
      this.style.background = '#14E25A';
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
function storeWorkoutCompletion(workoutType, points = 125) {
  localStorage.setItem('workoutCompleted', JSON.stringify({
    workout: workoutType,
    timestamp: Date.now(),
    points: points
  }));
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
    initWorkoutTimer
  };
}
