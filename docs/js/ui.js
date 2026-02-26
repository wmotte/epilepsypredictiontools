/* ui.js — Shared UI logic for Epilepsy Prediction Tools */

(function () {
  'use strict';

  var poppedup = false;

  /* ── Fix header padding on load & resize ── */
  function fixHeader() {
    var h = document.getElementById('header');
    var w = document.getElementById('mainwrapper');
    if (!h || !w) return;
    var ht = h.offsetHeight;
    w.style.paddingTop = (ht > 70 ? ht + 20 : 80) + 'px';
  }

  /* ── Modal helpers ── */
  function openPopup() {
    if (poppedup) return;

    var titleEl   = document.getElementById('popUpTitle');
    var contentEl = document.getElementById('popupContent');
    if (!titleEl || !contentEl) return;

    var bg = document.createElement('div');
    bg.className = 'popupBG';
    bg.addEventListener('click', closePopup);

    var box = document.createElement('div');
    box.className = 'popup shadow';

    /* Title bar */
    var titlebar = document.createElement('div');
    titlebar.className = 'titlebar';

    var titleText = document.createElement('h2');
    titleText.className = 'popuptitle';
    var h2El = titleEl.querySelector('h2');
    titleText.innerHTML = h2El ? h2El.innerHTML : titleEl.innerHTML;

    var closeBtn = document.createElement('button');
    closeBtn.className = 'xbutton noselect';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closePopup);

    titlebar.appendChild(titleText);
    titlebar.appendChild(closeBtn);

    /* Content */
    var contentClone = contentEl.cloneNode(true);

    box.appendChild(titlebar);
    box.appendChild(contentClone);

    document.body.insertBefore(bg, document.body.firstChild);
    document.body.insertBefore(box, document.body.firstChild);

    poppedup = true;
    var btn = document.getElementById('infobutton');
    if (btn) { btn.style.opacity = '0.5'; btn.style.cursor = 'default'; }
  }

  function closePopup() {
    var bg = document.querySelector('.popupBG');
    var box = document.querySelector('.popup');
    if (bg) bg.remove();
    if (box) box.remove();
    poppedup = false;
    var btn = document.getElementById('infobutton');
    if (btn) { btn.style.opacity = ''; btn.style.cursor = ''; }
  }

  /* ── Show result block with slide animation ── */
  function showResult(html) {
    var block = document.getElementById('resultBlock');
    if (!block) return;

    block.style.display = 'none';
    block.innerHTML = html;

    // Fade in
    block.style.opacity = '0';
    block.style.display = 'block';
    requestAnimationFrame(function () {
      block.style.transition = 'opacity 0.4s';
      block.style.opacity = '1';
      // Scroll to result
      setTimeout(function () {
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  /* ── Clamp number input values to min/max ── */
  function clampInputs() {
    var inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(function (inp) {
      inp.addEventListener('input', function () {
        var v = parseFloat(this.value);
        var mn = parseFloat(this.getAttribute('min'));
        var mx = parseFloat(this.getAttribute('max'));
        if (!isNaN(mn) && v < mn) this.value = mn;
        if (!isNaN(mx) && v > mx) this.value = mx;
      });
    });
  }

  /* ── Wire up info button & calculate button ── */
  function init() {
    fixHeader();
    window.addEventListener('resize', fixHeader);
    clampInputs();

    var infoBtn = document.getElementById('infobutton');
    if (infoBtn) {
      infoBtn.addEventListener('click', openPopup);
    }

    var calcBtn = document.getElementById('calcButton');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        if (typeof window.calculate === 'function') {
          window.calculate();
        }
      });
    }

    // Also calculate on Enter key
    document.addEventListener('keypress', function (e) {
      if (!poppedup && e.key === 'Enter') {
        if (typeof window.calculate === 'function') {
          window.calculate();
        }
      }
    });
  }

  /* Expose helpers globally */
  window.UI = {
    showResult: showResult,
    closePopup: closePopup,
    openPopup: openPopup
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
