/* aed-calc.js — AED Withdrawal nomogram (ported from function_aed.php) */

(function () {
  'use strict';

  /* ── Nomogram point lookup tables ── */

  /* ttr (time since last seizure, 0-24 years)
     ttrs[i] is the ttr value, nomogramPoints[i] is the point for that ttr */
  var TTR_VALUES = [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  var TTR_PTS    = [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5,
                   13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 19.5, 20.0, 20.0, 20.0];
  var TTR_PTS2   = [0, 1, 1.5, 2, 3, 4, 4.5, 5, 6, 6.5, 7.5, 8, 9, 9.5, 10.5, 11, 12, 12.5,
                   13.5, 14, 15, 16, 17, 18.5, 20];

  /* duration (0-40 years) */
  var DUR_VALUES = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
                   26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
  var DUR_PTS    = [0,2,3.5,5,6,7,7.5,8,8,8.5,8.5,8.5,8.5,8.5,9,9,9,9,9,9,9,9,9.5,9.5,
                   9.5,9.5,9.5,9.5,9.5,10,10,10,10,10,10,10,10,10.5,10.5,10.5,10.5];
  var DUR_PTS2   = [0,1,2.5,3,4,4.5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
                   5,5,5,5,5,5,5,5,5,5,5,5,5,5];

  /* ageonset (0-80) — NOTE: lookup by value, NOT sorted index */
  var AGE_VALUES = [3,4,2,5,1,6,0,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
                   26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,
                   50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,
                   74,75,76,77,78,79,80];
  var AGE_PTS    = [0,0,0.5,1,1.5,2,2.5,3.5,5,5.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,
                   6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,6.5,7,7,7,7,7,7.5,7.5,
                   7.5,7.5,7.5,7.5,8,8,8,8,8,8.5,8.5,8.5,8.5,8.5,9,9,9,9,9,9,9.5,9.5,
                   9.5,9.5,9.5,10,10,10,10,10,10.5,10.5,10.5,10.5,10.5,10.5,11,11,11,11,11];

  /* histfeb */
  var HISTFEB_MAP = { negative: 0.0, positive: 3.5 };

  /* nseizures */
  var NSEIZ_MAP  = { '0-9': [0.0, 0.0], '10 or more': [3.0, 2.5] };

  /* benign (self-limiting syndrome): yes=0 points, no=5.5 */
  var BENIGN_MAP = { yes: 0.0, no: 5.5 };

  /* delay */
  var DELAY_MAP  = { no: 0.0, yes: 2.0 };

  /* EEG */
  var EEG_VALS   = ['normal', 'not performed', 'epileptiform abnormality'];
  var EEG_PTS    = [0, 0, 4];
  var EEG_PTS2   = [0, 0, 2];

  /* naed (0-9) — only for long-term model */
  var NAED_PTS2  = [0, 0, 1.5, 3, 4.5, 6, 7, 8.5, 10, 11.5];

  /* sex */
  var SEX_MAP2   = { male: 0.0, female: 1.5 };

  /* famhist */
  var FAMHIST_MAP2 = { negative: 0.0, positive: 2.0 };

  /* focal */
  var FOCAL_MAP2 = { no: 0.0, yes: 3.0 };

  /* Risk tables: TOTAL score → risk (index = total * 2) */
  var RISK2Y = ['<10','<10','<10','<10','<10','<10','<10','<10',
    '<10','<10','<10','<10','<10','<10','<10','<10','<10',
    '<10','<10','<10','<10','<10','<10','<10','<10','<10','<10',
    '<10','<10','<10','<10','<10',10,11,11,12,13,
    13,14,14,15,16,16,17,18,18,19,
    19,20,21,22,23,24,26,27,28,29,
    30,31,33,34,36,37,39,40,41,43,
    44,46,47,49,50,52,53,55,57,58,
    60,62,64,66,68,70,72,73,75,77,
    78,80,81,83,84,86,87,89,90,'>90',
    '>90','>90','>90','>90','>90','>90','>90','>90','>90','>90',
    '>90','>90','>90','>90','>90','>90','>90','>90','>90','>90',
    '>90','>90','>90'];

  var RISK5Y = ['<10','<10','<10','<10','<10','<10','<10','<10',
    '<10','<10','<10','<10','<10','<10','<10','<10','<10','<10',
    '<10','<10','<10','<10','<10','<10','<10','<10',10,11,
    11,12,13,13,14,15,15,16,17,17,
    18,19,19,20,21,22,23,24,26,27,
    28,29,30,31,33,34,35,36,38,39,
    40,42,43,45,47,48,50,52,53,55,
    57,58,60,62,64,66,68,70,72,73,
    75,77,78,80,81,83,84,86,87,89,
    90,'>90','>90','>90','>90','>90','>90','>90','>90','>90',
    '>90','>90','>90','>90','>90','>90','>90','>90','>90','>90',
    '>90','>90','>90','>90','>90','>90','>90','>90','>90','>90',
    '>90','>90'];

  /* Long-term seizure freedom (index = total * 2, range 0..47.5) */
  var RISK_LONG = ['>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99',
    '>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99','>99',
    '>99','>99',99,99,99,99,98,98,98,98,98,97,97,97,96,96,95,94,94,93,92,91,91,
    90,89,87,86,84,83,81,80,78,75,73,70,67,63,60,57,53,50,47,43,40,'<40','<40',
    '<40','<40','<40','<40','<40','<40','<40','<40','<40','<40','<40','<40','<40','<40',
    '<40','<40','<40','<40','<40','<40','<40','<40'];

  /* ── Helper: find value in array, return index or -1 ── */
  function indexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === val) return i;
    }
    return -1;
  }

  /* ── Risk lookup by total score ── */
  function lookupRisk(total, table) {
    var idx = Math.round(total * 2);
    if (idx < 0 || idx >= table.length) return null;
    return table[idx];
  }

  /* ── Main calculation ── */
  function calculate() {
    var form = document.getElementById('mainform');
    var fd = new FormData(form);

    var duration  = parseInt(fd.get('duration') || 0, 10);
    var ttr       = parseInt(fd.get('ttr') || 0, 10);
    var naed      = parseInt(fd.get('naed') || 0, 10);
    var ageonset  = parseInt(fd.get('ageonset') || 0, 10);
    var sex       = fd.get('sex') || 'male';
    var famhist   = fd.get('famhist') || 'negative';
    var histfeb   = fd.get('histfeb') || 'negative';
    var nseizures = fd.get('nseizures') || '0-9';
    var benign    = fd.get('benign') || 'no';
    var delay     = fd.get('delay') || 'no';
    var focal     = fd.get('focal') || 'no';
    var EEG       = fd.get('EEG') || 'normal';

    /* Clamp */
    if (ttr > 24) ttr = 24;
    if (duration > 40) duration = 40;
    if (ageonset > 80) ageonset = 80;
    if (naed > 9) naed = 9;
    if (naed < 0) naed = 0;

    /* TTR points */
    var ttr_idx = indexOf(TTR_VALUES, ttr);
    if (ttr_idx < 0) { alert('Invalid time since last seizure.'); return; }
    var ttr_pt  = TTR_PTS[ttr_idx];
    var ttr_pt2 = TTR_PTS2[ttr_idx];

    /* Duration points */
    var dur_idx = indexOf(DUR_VALUES, duration);
    if (dur_idx < 0) { alert('Invalid duration.'); return; }
    var dur_pt  = DUR_PTS[dur_idx];
    var dur_pt2 = DUR_PTS2[dur_idx];

    /* Age at onset */
    var age_idx = indexOf(AGE_VALUES, ageonset);
    if (age_idx < 0) { alert('Invalid age at onset.'); return; }
    var age_pt = AGE_PTS[age_idx];

    /* Histfeb */
    var hf_pt = HISTFEB_MAP[histfeb];
    if (hf_pt === undefined) { alert('Invalid febrile seizure history.'); return; }

    /* Nseizures */
    var ns = NSEIZ_MAP[nseizures];
    if (!ns) { alert('Invalid seizure count.'); return; }
    var ns_pt = ns[0], ns_pt2 = ns[1];

    /* Benign */
    var ben_pt = BENIGN_MAP[benign];
    if (ben_pt === undefined) { alert('Invalid benign syndrome value.'); return; }

    /* Delay */
    var del_pt = DELAY_MAP[delay];
    if (del_pt === undefined) { alert('Invalid delay value.'); return; }

    /* EEG */
    var eeg_idx = indexOf(EEG_VALS, EEG);
    if (eeg_idx < 0) { alert('Invalid EEG value.'); return; }
    var eeg_pt = EEG_PTS[eeg_idx];
    var eeg_pt2 = EEG_PTS2[eeg_idx];

    /* naed — long-term only */
    var naed_pt2 = NAED_PTS2[naed];

    /* Sex */
    var sex_pt2 = SEX_MAP2[sex];
    if (sex_pt2 === undefined) { alert('Invalid sex.'); return; }

    /* Famhist */
    var fh_pt2 = FAMHIST_MAP2[famhist];
    if (fh_pt2 === undefined) { alert('Invalid family history.'); return; }

    /* Focal */
    var foc_pt2 = FOCAL_MAP2[focal];
    if (foc_pt2 === undefined) { alert('Invalid focal value.'); return; }

    /* Totals */
    var totalRecur = ttr_pt + dur_pt + age_pt + hf_pt + ns_pt + ben_pt + del_pt + eeg_pt;
    var totalLong  = ttr_pt2 + dur_pt2 + naed_pt2 + sex_pt2 + fh_pt2 + ns_pt2 + foc_pt2 + eeg_pt2;

    /* Round to nearest 0.5 */
    totalRecur = Math.round(totalRecur * 2) / 2;
    totalLong  = Math.round(totalLong * 2) / 2;

    var r2y   = lookupRisk(totalRecur, RISK2Y);
    var r5y   = lookupRisk(totalRecur, RISK5Y);
    var rLong = lookupRisk(totalLong, RISK_LONG);

    if (r2y === null || r5y === null || rLong === null) {
      alert('Score out of range. Please check your inputs.');
      return;
    }

    var html = '<div>'
      + '<div class="result"><p>2-year recurrence risk</p><p class="value">' + r2y + '%</p></div>'
      + '<div class="result"><p>5-year recurrence risk</p><p class="value">' + r5y + '%</p></div>'
      + '<div class="result"><p>Long-term seizure freedom</p><p class="value">' + rLong + '%</p></div>'
      + '</div>'
      + '<p class="result-note">Score (recurrence): ' + totalRecur + ' &mdash; Score (long-term): ' + totalLong + '</p>'
      + '<p class="result-note">Results are based on population-level data and should complement, not replace, clinical judgment.</p>';

    window.UI.showResult(html);
  }

  window.calculate = calculate;
})();
