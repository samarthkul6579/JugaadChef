/**
 * SMART FOOD DECISION ASSISTANT — script.js
 * Handles: ingredient chips, search interaction, selected tags, UI interactivity
 */

// ============================================================
// DOM References
// ============================================================
const ingredientInput  = document.getElementById('ingredientInput');
const clearInputBtn    = document.getElementById('clearInput');
const quickChips       = document.getElementById('quickChips');
const selectedArea     = document.getElementById('selectedArea');
const selectedTags     = document.getElementById('selectedTags');
const selectedLabel    = document.getElementById('selectedLabel');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const suggestBtn       = document.getElementById('suggestBtn');
const navToggle        = document.getElementById('navToggle');
const navLinks         = document.getElementById('navLinks');
const toast            = document.getElementById('toast');

// ============================================================
// State
// ============================================================
/** @type {Set<string>} — Tracks currently selected ingredient names */
const selectedIngredients = new Set();

/** Timout handle for hiding the toast */
let toastTimeout = null;

// ============================================================
// Utility: Toast Notification
// ============================================================
/**
 * Show a brief toast message at the bottom of the screen.
 * @param {string} message - Text to display
 * @param {number} [duration=2200] - ms before hiding
 */
function showToast(message, duration = 2200) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ============================================================
// Ingredient Chips — Quick-add selector
// ============================================================

/**
 * Toggle a chip's selected state and sync with the tags area.
 * @param {HTMLElement} chip  - The chip button element
 * @param {string}      name  - Ingredient name
 */
function toggleChip(chip, name) {
  const isSelected = selectedIngredients.has(name);

  if (isSelected) {
    // Deselect
    selectedIngredients.delete(name);
    chip.classList.remove('selected');
    removeTag(name);
  } else {
    // Select
    selectedIngredients.add(name);
    chip.classList.add('selected');
    addTag(name);
    showToast(`✅ Added "${name}" to your list`);
  }

  renderSelectedLabel();
}

/**
 * Render the "Selected:" label visibility based on current selection.
 */
function renderSelectedLabel() {
  if (selectedIngredients.size > 0) {
    selectedLabel.style.display = 'inline';
  } else {
    selectedLabel.style.display = 'none';
  }
}

// Attach click listeners to each pre-built quick chip
quickChips.querySelectorAll('.chip[data-ingredient]').forEach(chip => {
  chip.addEventListener('click', () => {
    const name = chip.dataset.ingredient;
    toggleChip(chip, name);
  });
});

// ============================================================
// Tags — Selected ingredient pills
// ============================================================

/**
 * Create and append a tag pill for a given ingredient name.
 * @param {string} name
 */
function addTag(name) {
  // Avoid duplicates
  if (document.querySelector(`.tag[data-tag="${CSS.escape(name)}"]`)) return;

  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.dataset.tag = name;
  tag.innerHTML = `
    ${name}
    <button class="tag__remove" aria-label="Remove ${name}" title="Remove">✕</button>
  `;

  // Remove tag on click
  tag.querySelector('.tag__remove').addEventListener('click', () => {
    removeTag(name);

    // Also deselect matching quick-chip if present
    const matchingChip = quickChips.querySelector(`.chip[data-ingredient="${CSS.escape(name)}"]`);
    if (matchingChip) {
      matchingChip.classList.remove('selected');
    }

    selectedIngredients.delete(name);
    renderSelectedLabel();
    showToast(`❌ Removed "${name}"`);
  });

  selectedTags.appendChild(tag);
}

/**
 * Remove a tag pill by ingredient name.
 * @param {string} name
 */
function removeTag(name) {
  const tag = selectedTags.querySelector(`.tag[data-tag="${CSS.escape(name)}"]`);
  if (tag) {
    tag.style.transform = 'scale(0.8)';
    tag.style.opacity   = '0';
    tag.style.transition = 'all 0.18s ease';
    setTimeout(() => tag.remove(), 180);
  }
}

// ============================================================
// Search Input
// ============================================================

/**
 * Show/hide the clear ✕ button based on input value.
 */
ingredientInput.addEventListener('input', () => {
  const hasValue = ingredientInput.value.trim().length > 0;
  clearInputBtn.classList.toggle('visible', hasValue);
});

/**
 * Clear the input field on ✕ click.
 */
clearInputBtn.addEventListener('click', () => {
  ingredientInput.value = '';
  clearInputBtn.classList.remove('visible');
  ingredientInput.focus();
});

/**
 * Allow adding an ingredient by pressing Enter in the input field.
 */
ingredientInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addCustomIngredient();
  }
});

// ============================================================
// Add Ingredient Button (custom)
// ============================================================

/**
 * Read from search input and add it as a selected ingredient tag.
 */
function addCustomIngredient() {
  const raw = ingredientInput.value.trim();
  if (!raw) {
    showToast('⚠️ Please type an ingredient first');
    ingredientInput.focus();
    return;
  }

  // Capitalise first letter
  const name = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();

  if (selectedIngredients.has(name)) {
    showToast(`"${name}" is already in your list`);
    return;
  }

  selectedIngredients.add(name);
  addTag(name);
  renderSelectedLabel();

  ingredientInput.value = '';
  clearInputBtn.classList.remove('visible');
  showToast(`✅ Added "${name}" to your list`);
}

addIngredientBtn.addEventListener('click', addCustomIngredient);

// ============================================================
// Suggest Dishes Button
// ============================================================

/**
 * Animate the recipe cards back in as if freshly suggested,
 * and scroll to the recipes section.
 */
suggestBtn.addEventListener('click', () => {
  const list = Array.from(selectedIngredients);

  if (list.length === 0) {
    showToast('🍽️ Select at least one ingredient first!', 2800);
    ingredientInput.focus();
    return;
  }

  // Brief loading state on button
  const originalHTML = suggestBtn.innerHTML;
  suggestBtn.innerHTML = '<span class="btn-suggest__icon">⏳</span> Finding dishes…';
  suggestBtn.disabled  = true;
  suggestBtn.style.opacity = '0.8';

  setTimeout(() => {
    // Reset button
    suggestBtn.innerHTML = originalHTML;
    suggestBtn.disabled  = false;
    suggestBtn.style.opacity = '1';

    // Re-animate recipe cards
    const cards = document.querySelectorAll('.recipe-card');
    cards.forEach((card, i) => {
      card.style.animation = 'none';
      card.style.opacity   = '0';
      card.style.transform = 'translateY(24px)';

      // Force reflow
      void card.offsetWidth;

      card.style.animation  = '';
      card.style.animationDelay = `${i * 0.1}s`;
      card.style.opacity    = '';
      card.style.transform  = '';
      card.classList.add('recipe-card'); // re-trigger animation
    });

    // Scroll to recipes
    document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });

    showToast(`🎉 ${list.length} ingredient(s) matched — here are your recipes!`, 3000);
  }, 900);
});

// ============================================================
// Recipe Cards — View Recipe Button
// ============================================================

/**
 * Attach click listeners to all "View Recipe" buttons.
 * Cycles through a friendly toast message per card.
 */
const recipeNames = {
  'fried-rice': 'Vegetable Fried Rice',
  'omelette':   'Masala Omelette',
  'stirfry':    'Capsicum Potato Stir Fry',
};

document.querySelectorAll('.recipe-card').forEach(card => {
  const btn = card.querySelector('.btn-view');
  btn.addEventListener('click', () => {
    const key  = card.dataset.recipe;
    const name = recipeNames[key] || 'this recipe';
    showToast(`📖 Opening full recipe for ${name}…`, 2400);

    // Pulse animation on card
    card.style.transform = 'scale(0.98)';
    setTimeout(() => { card.style.transform = ''; }, 200);
  });
});

// ============================================================
// Navbar — Mobile Toggle
// ============================================================

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);

  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close nav when a link is clicked (mobile)
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ============================================================
// Smooth scroll for internal anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// Scroll-triggered card reveal (Intersection Observer)
// ============================================================
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.recipe-card').forEach(card => {
  card.style.animationPlayState = 'paused';
  observer.observe(card);
});

// ============================================================
// Init
// ============================================================
console.log('🍳 Smart Food Decision Assistant loaded successfully!');