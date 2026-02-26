/* fsc-calc.js — First Seizure Consultation logistic regression (ported from function_epilepsy.php) */

(function () {
  'use strict';

  /* EEG coefficients */
  var EEG_COEFF = {
    normal: 0.0,
    generalizedEpi: 3.80806,
    localizedEpi: 3.20263,
    hypofunctional: 1.27371
  };

  function calculate() {
    var form = document.getElementById('mainform');
    var fd = new FormData(form);

    var sexmale              = fd.get('sexmale') === 'yes' ? 1 : 0;
    var agefirstevent        = parseFloat(fd.get('agefirstevent') || 0);
    var bilateral            = fd.get('bilateral') === 'yes' ? 1 : 0;
    var cramp                = fd.get('cramp') === 'yes' ? 1 : 0;
    var lateralization       = fd.get('lateralization') === 'yes' ? 1 : 0;
    var lossTonus            = fd.get('lossTonus') === 'yes' ? 1 : 0;
    var automatism           = fd.get('automatism') === 'yes' ? 1 : 0;
    var history_neurological = fd.get('history_neurological') === 'yes' ? 1 : 0;
    var history_psychiatric  = fd.get('history_psychiatric') === 'yes' ? 1 : 0;
    var syndrome             = fd.get('syndrome') === 'yes' ? 1 : 0;
    var eeg_result           = fd.get('eeg_result') || 'normal';

    /* Clamp age */
    if (agefirstevent > 18) agefirstevent = 18;
    if (agefirstevent < 0)  agefirstevent = 0;

    var EEG = EEG_COEFF[eeg_result];
    if (EEG === undefined) { alert('Invalid EEG result.'); return; }

    /* Logistic regression */
    var logodds = -3.79076
      + sexmale              * 0.65583
      + agefirstevent        * 0.04660
      + bilateral            * 0.58519
      + cramp                * 0.65431
      + lateralization       * 0.76494
      + lossTonus            * 1.12028
      + automatism           * 1.62695
      + history_neurological * 1.33676
      + history_psychiatric  * 0.21355
      + syndrome             * 0.79069
      + EEG;

    var odds = Math.exp(logodds);
    var p = 100 * (odds / (1 + odds));

    var pRounded = Math.round(p * 10) / 10;

    var html = '<div style="text-align:center; padding: 20px 10px;">'
      + '<p style="margin-bottom:8px; font-weight:bold;">Probability of epilepsy diagnosis</p>'
      + '<p style="font-size:3em; font-weight:bold; text-shadow: #777 0 0 10px; color:#1961ab;">'
      + pRounded + '%</p>'
      + '</div>'
      + '<p class="result-note">This is based on population-level logistic regression data. Results should complement, not replace, clinical judgment.</p>';

    window.UI.showResult(html);
  }

  window.calculate = calculate;
})();
