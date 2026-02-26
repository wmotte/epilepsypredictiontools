/* tts-calc.js — TTS Surgery nomogram (ported from function_surg.php) */

(function () {
  'use strict';

  /* ── Model 1 & 3: Age at withdrawal (0-26) ── */
  var AGEWITH_VALS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
  var AGEWITH_PTS1 = [0.0,1.0,1.5,2.5,3.0,4.0,4.5,5.5,6.0,7.0,7.5,8.5,9.0,10.0,
                      11.0,11.5,12.0,13.0,14.0,14.5,15.5,16.0,17.0,17.5,18.5,19.0,20.0];
  var AGEWITH_PTS3 = [0.0,0.5,1.0,2.0,2.5,3.0,3.5,4.5,5.0,5.5,6.0,7.0,7.5,
                      8.0,8.5,9.0,10.0,10.5,11.0,11.5,12.5,13.0,13.5,14.0,15.0,15.5,16.0];

  /* ── Model 1: TTR (0-85 months) ── */
  var TTR_VALS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,
    23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,
    46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,
    69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85];
  var TTR_PTS1 = [18.5,17.5,16.0,15.0,13.5,12.5,11.5,10.5,9.5,8.5,7.5,6.5,6.0,
    5.0,4.5,3.5,3.0,2.5,2.5,2.0,1.5,1.5,1.0,1.0,1.0,0.5,0.5,0.5,0.5,0.0,0.0,0.0,0.0,
    0.0,0.0,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,
    1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.5,
    2.5,2.5,2.5,2.5,2.5,2.5,2.5,2.5,3.0,3.0,3.0,3.0,3.0];

  /* ── Model 1: MRI ── */
  var MRI_MAP1 = { focal: 0.0, multifocal: 12.0, normal: 0.0 };

  /* ── Model 1, 2, 3: Completeness ── */
  var COMP_MAP1 = { complete: 0.0, incomplete: 12.5, 'not determined': 0.0 };
  var COMP_MAP2 = { complete: 0.0, incomplete: 12.5, 'not determined': 0.0 };
  var COMP_MAP3 = { complete: 0.0, incomplete: 6.5, 'not determined': 0.0 };

  /* ── Model 2: Seizure frequency (0-24 per day) ── */
  var SFREQ_VALS = [0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.2,1.4,1.6,1.8,2.0,
    2.5,3.0,3.5,4.0,5.0,6.0,7.0,8.0,9.0,10.0,11.0,12.0,13.0,14.0,15.0,16.0,17.0,18.0,19.0,20.0,21.0,22.0,23.0,24.0];
  var SFREQ_PTS2 = [19.0,18.5,18.0,17.0,16.5,16.0,15.5,15.0,14.0,13.5,
    13.0,12.0,11.0,10.0,9.0,8.0,6.0,4.0,3.0,2.0,0.5,0.0,0.0,1.0,2.0,3.0,4.0,
    5.5,6.5,8.0,9.0,10.5,11.5,12.5,14.0,15.0,16.5,17.5,19.0,20.0];

  /* ── Model 2, 3: naed (0-5) ── */
  var NAED_VALS  = [0,1,2,3,4,5];
  var NAED_PTS2  = [0.0,3.5,6.5,10.0,13.0,16.5];
  var NAED_PTS3  = [0.0,3.0,5.5,8.5,11.0,14.0];

  /* ── Model 1, 3: EEG ── */
  var EEG_VALS = ['normal','not performed','interictal epileptiform discharges'];
  var EEG_PTS1 = [0.0, 0.0, 7.5];
  var EEG_PTS3 = [0.0, 0.0, 4.5];

  /* ── Model 3: Aetiology ── */
  var AETIOL_MAP3 = {
    'tumor': 1.5,
    'malformation of cortical development': 8.0,
    'mesiotemporal sclerosis': 9.0,
    'vascular lesion': 0.0,
    'rasmussen encephalitis': 20.0,
    'other': 5.5
  };

  /* ── Risk tables for model 1 (index = total * 2, 0 to 70.5) ── */
  function buildHalfStepArray(n) {
    var a = [];
    for (var i = 0; i <= n * 2; i++) a.push(i / 2);
    return a;
  }

  /* Model 1 — 2-year risk of seizure recurrence */
  var RISK1_2Y = ['<2','<2','<2','<2','<2','<2','<2','<2',2,2,2,2,2,3,3,3,3,3,3,3,
    3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,6,6,6,6,6,7,7,7,7,8,8,
    8,8,9,9,9,10,10,10,11,11,12,12,12,13,13,14,14,15,15,16,16,17,18,
    18,19,19,20,21,21,22,23,24,24,25,26,26,27,28,29,30,31,32,33,34,35,
    36,37,38,39,40,41,43,44,45,46,48,49,50,51,53,54,54,'>54','>54','>54','>54',
    '>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54','>54',
    '>54','>54','>54','>54','>54','>54','>54','>54','>54','>54'];

  /* Model 1 — 5-year risk */
  var RISK1_5Y = ['<5','<5','<5','<5','<5','<5','<5','<5',5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,
    11,11,12,12,13,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,21,21,22,23,24,24,25,26,27,28,28,29,30,31,
    32,33,34,35,36,37,38,39,40,41,43,44,45,46,48,49,50,51,53,54,55,56,58,59,60,62,63,65,66,68,69,70,71,73,
    74,75,76,77,78,79,81,82,83,84,85,'>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85',
    '>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85','>85'];

  /* Model 2 — long-term seizure freedom (0..49, index = total*2) */
  var RISK2_LONG = ['>98','>98','>98','>98','>98','>98','>98','>98','>98','>98','>98','>98','>98','>98','>98','>98',
    '>98','>98','>98','>98','>98','>98','>98','>98','>98','>98',98,98,98,98,97,97,97,97,97,97,96,96,96,96,96,
    95,95,95,95,94,94,94,93,93,92,92,91,91,90,90,89,89,88,87,87,86,85,84,83,82,81,81,80,79,77,76,74,73,
    71,70,68,67,65,63,62,60,58,56,54,52,50,48,47,45,43,42,40,38,35,33,30,'<30','<30'];

  /* Model 3 — cure (0..68, index = total*2) */
  var RISK3_CURE = ['>70','>70','>70','>70','>70','>70',70,69,69,68,67,66,66,65,64,63,63,62,61,60,59,58,58,57,56,
    55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,36,35,34,33,33,32,31,30,29,28,27,26,25,24,23,22,
    21,20,19,18,18,17,16,15,14,14,13,12,11,11,10,9,9,8,8,7,7,6,6,5,'<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5',
    '<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5','<5',
    '<5','<5','<5','<5','<5','<5','<5','<5'];

  function indexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === val) return i;
    }
    return -1;
  }

  function findClosestSfreq(v) {
    var best = 0, bestDiff = Math.abs(SFREQ_VALS[0] - v);
    for (var i = 1; i < SFREQ_VALS.length; i++) {
      var d = Math.abs(SFREQ_VALS[i] - v);
      if (d < bestDiff) { bestDiff = d; best = i; }
    }
    return best;
  }

  function lookupRisk(total, table) {
    var idx = Math.round(total * 2);
    if (idx < 0 || idx >= table.length) return null;
    return table[idx];
  }

  function calculate() {
    var form = document.getElementById('mainform');
    var fd = new FormData(form);

    var agewith  = parseFloat(fd.get('agewith') || 0);
    var ttr      = parseFloat(fd.get('ttr') || 0);
    var mri      = fd.get('mri') || 'focal';
    var complete = fd.get('complete') || 'complete';
    var sfreq    = parseFloat(fd.get('sfreq') || 1);
    var naed     = parseInt(fd.get('naed') || 0, 10);
    var eeg      = fd.get('eeg') || 'normal';
    var aetiol   = fd.get('aetiol') || 'tumor';

    /* Clamp */
    agewith = Math.max(0, Math.min(26, Math.round(agewith)));
    ttr     = Math.max(0, Math.min(85, Math.round(ttr)));
    naed    = Math.max(0, Math.min(5, naed));

    /* Model 1 points */
    var aw_idx = indexOf(AGEWITH_VALS, agewith);
    if (aw_idx < 0) { alert('Invalid age.'); return; }

    var ttr_idx = indexOf(TTR_VALS, ttr);
    if (ttr_idx < 0) { alert('Invalid TTR.'); return; }

    var mri_pt1  = MRI_MAP1[mri];
    var comp_pt1 = COMP_MAP1[complete];
    var eeg_idx  = indexOf(EEG_VALS, eeg);
    if (eeg_idx < 0) { alert('Invalid EEG.'); return; }

    if (mri_pt1 === undefined || comp_pt1 === undefined) { alert('Invalid input.'); return; }

    var total1 = AGEWITH_PTS1[aw_idx] + TTR_PTS1[ttr_idx] + mri_pt1 + EEG_PTS1[eeg_idx] + comp_pt1;
    total1 = Math.round(total1 * 2) / 2;

    /* Model 2 points */
    var sf_idx   = findClosestSfreq(sfreq);
    var comp_pt2 = COMP_MAP2[complete];
    var naed_pt2 = NAED_PTS2[naed];

    var total2 = SFREQ_PTS2[sf_idx] + naed_pt2 + comp_pt2;
    total2 = Math.round(total2 * 2) / 2;

    /* Model 3 points */
    var ae_pt3   = AETIOL_MAP3[aetiol];
    var comp_pt3 = COMP_MAP3[complete];
    var naed_pt3 = NAED_PTS3[naed];

    if (ae_pt3 === undefined) { alert('Invalid aetiology.'); return; }

    var total3 = ae_pt3 + AGEWITH_PTS3[aw_idx] + EEG_PTS3[eeg_idx] + naed_pt3 + comp_pt3;
    total3 = Math.round(total3 * 2) / 2;

    var r2y   = lookupRisk(total1, RISK1_2Y);
    var r5y   = lookupRisk(total1, RISK1_5Y);
    var rLong = lookupRisk(total2, RISK2_LONG);
    var rCure = lookupRisk(total3, RISK3_CURE);

    var html = '<div>'
      + '<div class="result"><p>2-year seizure recurrence (Model 1)</p><p class="value">' + (r2y !== null ? r2y + '%' : 'N/A') + '</p></div>'
      + '<div class="result"><p>5-year seizure recurrence (Model 1)</p><p class="value">' + (r5y !== null ? r5y + '%' : 'N/A') + '</p></div>'
      + '<div class="result"><p>Long-term seizure freedom (Model 2)</p><p class="value">' + (rLong !== null ? rLong + '%' : 'N/A') + '</p></div>'
      + '<div class="result"><p>Cure probability (Model 3)</p><p class="value">' + (rCure !== null ? rCure + '%' : 'N/A') + '</p></div>'
      + '</div>'
      + '<p class="result-note">Model scores: M1=' + total1 + ', M2=' + total2 + ', M3=' + total3 + '</p>'
      + '<p class="result-note">Results represent population-level estimates. Always use clinical judgment.</p>';

    window.UI.showResult(html);
  }

  window.calculate = calculate;
})();
