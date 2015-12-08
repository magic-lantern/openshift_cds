"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('antimicrobial-cds/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'antimicrobial-cds/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _antimicrobialCdsConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _antimicrobialCdsConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _antimicrobialCdsConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _antimicrobialCdsConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('antimicrobial-cds/components/aom-modal', ['exports', 'ember', 'moment', 'antimicrobial-cds/config/environment'], function (exports, _ember, _moment, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    total_steps: 5,
    med_form: null,
    medication_callback: null,
    medication: {},
    isOverride: false,
    medicationselection: _ember['default'].computed('fc.patient.hasPenicillinAllergy', function () {
      if (!_ember['default'].isNone(this.fc.patient.hasPenicillinAllergy) && this.fc.patient.hasPenicillinAllergy) {
        return 'aom-non-penicillin';
      } else {
        return 'aom-penicillin';
      }
    }),
    exceedTempThreshold: _ember['default'].computed('fc.patient.temp.value', function () {
      return this.fc.patient.temp.value > _antimicrobialCdsConfigEnvironment['default'].APP.aom_temp_threshold;
    }),
    missingWeight: _ember['default'].computed('this.fc.patient.weight.value', function () {
      if (_ember['default'].isNone(this.fc.patient.weight.value) || this.fc.patient.weight.value === 'No Observation') {
        return true;
      }
      return false;
    }),
    uncheck_steps: function uncheck_steps(current_step) {
      //step 5 is medication, don't want to change that
      for (var step_num = current_step + 1; step_num < this.total_steps; step_num++) {
        _ember['default'].$('#aom_step' + step_num).find(":checked").attr('checked', false);
      }
    },
    toggle_next_steps: function toggle_next_steps(current_step) {
      var hide_next = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (hide_next) {
        _ember['default'].$('#aom_step' + (current_step + 1)).addClass('hidden');
      } else {
        _ember['default'].$('#aom_step' + (current_step + 1)).removeClass('hidden');
      }
      for (var step_num = current_step + 2; step_num <= this.total_steps; step_num++) {
        _ember['default'].$('#aom_step' + step_num).addClass('hidden');
      }
    },
    hide_override: function hide_override() {
      _ember['default'].$('#aom_override').addClass('hidden');
      this.set('isOverride', false);
      _ember['default'].$('#aom_override').val('');
    },
    actions: {
      step1_next: function step1_next(idenable, iddisable) {
        _ember['default'].$('#' + idenable).addClass('selectedimage');
        _ember['default'].$('#' + iddisable).removeClass('selectedimage');
        this.toggle_next_steps(1);
        _ember['default'].$('#aom_criteria_not_met').addClass('hidden');
        _ember['default'].$('#aom_review').addClass('hidden');
        this.hide_override();
        this.uncheck_steps(1);
      },
      step1_done: function step1_done(idenable, iddisable) {
        _ember['default'].$('#' + idenable).addClass('selectedimage');
        _ember['default'].$('#' + iddisable).removeClass('selectedimage');
        this.toggle_next_steps(1, true);
        _ember['default'].$('#aom_criteria_not_met').removeClass('hidden');
        _ember['default'].$('#aom_review').removeClass('hidden');
        _ember['default'].$('#aom_override').addClass('hidden');
        this.uncheck_steps(1);
      },
      step2_next: function step2_next() {
        this.toggle_next_steps(2);
        _ember['default'].$('#aom_criteria_not_met').addClass('hidden');
        _ember['default'].$('#aom_review').addClass('hidden');
        this.hide_override();
        this.uncheck_steps(2);
      },
      step2_done: function step2_done() {
        this.toggle_next_steps(2, true);
        _ember['default'].$('#aom_criteria_not_met').removeClass('hidden');
        _ember['default'].$('#aom_review').removeClass('hidden');
        _ember['default'].$('#aom_override').addClass('hidden');
        this.uncheck_steps(2);
      },
      step3_next: function step3_next() {
        this.toggle_next_steps(3);
        _ember['default'].$('#aom_criteria_not_met').addClass('hidden');
        _ember['default'].$('#aom_review').addClass('hidden');
        this.hide_override();
        this.uncheck_steps(3);
      },
      step3_done: function step3_done() {
        this.toggle_next_steps(3, true);
        _ember['default'].$('#aom_criteria_not_met').removeClass('hidden');
        _ember['default'].$('#aom_review').removeClass('hidden');
        _ember['default'].$('#aom_override').addClass('hidden');
        this.uncheck_steps(3);
      },
      step4: function step4(med_form) {
        this.set('med_form', med_form);
        _ember['default'].$('#aom_step5').removeClass('hidden');
        if (!this.isOverride) {
          _ember['default'].$('#aom_criteria_not_met').addClass('hidden');
        }
        _ember['default'].$('#aom_review').removeClass('hidden');
        this.uncheck_steps(4);
      },
      step5: function step5(med) {
        this.set('medication', med);
        _ember['default'].$('#aom_review').removeClass('hidden');
        _ember['default'].$('#aom_override').addClass('hidden');
      },
      override: function override() {
        _ember['default'].$('#aom_override').removeClass('hidden');
      },
      forceallergy: function forceallergy() {
        if (_ember['default'].$('#aom_forceallergy').is(':checked')) {
          this.set('fc.patient.hasPenicillinAllergy', true);
        } else {
          this.set('fc.patient.hasPenicillinAllergy', false);
        }
      },
      forcemedication: function forcemedication() {
        if (!_ember['default'].isEmpty(_ember['default'].$('#aom_override').val())) {
          _ember['default'].$('#aom_step4').removeClass('hidden');
          this.set('isOverride', true);
        } else {
          _ember['default'].$('#aom_step4').addClass('hidden');
          _ember['default'].$('#aom_step5').addClass('hidden');
          this.set('isOverride', false);
        }
      },
      saveweight: function saveweight() {
        this.set('fc.patient.weight.value', parseInt(_ember['default'].$('#aom_weight').val()));
        this.set('fc.patient.weight.unit', 'kg');
        this.set('fc.patient.weight.date', (0, _moment['default'])().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format));
      },
      save: function save() {
        this.get('medication_callback')(this.get('medication'));
        _ember['default'].$('#AOMModal').modal('hide');
      }
    }
  });
});
define('antimicrobial-cds/components/aom-non-penicillin', ['exports', 'ember', 'antimicrobial-cds/config/environment'], function (exports, _ember, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    cefdinir_dose: 0,
    cefuroxime_dose: 0,
    cefpodoxime_dose: 0,
    duration_unit: null,
    duration_value: null,
    form: null,
    medication_callback: null,
    unit: 'mg',
    type: _ember['default'].computed('form', function () {
      if (this.form === 'liquid') {
        return ' Suspension';
      } else {
        return '';
      }
    }),
    weightChanged: _ember['default'].observer('this.fc.patient.weight.value', function () {
      this.calculate_dose();
    }),
    init: function init() {
      this._super.apply(this, arguments);
      this.calculate_dose();
    },
    calculate_dose: function calculate_dose() {
      var dose = 0;
      // Cefdinir calculation
      if (this.fc.patient.weight.unit === 'kg') {
        dose = this.fc.patient.weight.value * 14 / 2;
        if (dose > 300) {
          this.set('cefdinir_dose', 300);
        } else {
          this.set('cefdinir_dose', 150.0 * Math.round(dose / 150.0));
        }
      }

      // Cefuroxime calculation
      if (this.fc.patient.weight.unit === 'kg') {
        dose = this.fc.patient.weight.value * 30 / 2;
        if (dose > 500) {
          this.set('cefuroxime_dose', 500);
        } else {
          this.set('cefuroxime_dose', 125.0 * Math.round(dose / 125.0));
        }
      }

      // Cefpodoxime calculation
      if (this.fc.patient.weight.unit === 'kg') {
        dose = this.fc.patient.weight.value * 10 / 2;
        if (dose > 200) {
          this.set('cefpodoxime_dose', 200);
        } else {
          this.set('cefpodoxime_dose', 50.0 * Math.round(dose / 50.0));
        }
      }

      // duration
      if (this.fc.patient.age_value < 2) {
        this.set('duration_value', '10');
      } else if (this.fc.patient.age_value >= 2 && this.fc.patient.age_value <= 5) {
        this.set('duration_value', '7');
      } else {
        this.set('duration_value', '5 - 7');
      }
      this.set('duration_unit', 'days');

      this.get('medication_callback')({
        display: 'Cefdinir ' + this.get('cefdinir_dose') + this.get('unit'),
        code: 'code',
        dosageInstruction: 'b.i.d',
        date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
        duration_value: this.get('duration_value'),
        duration_unit: this.get('duration_unit'),
        refills: 1
      });
    },
    actions: {
      step5: function step5(med) {
        var display;
        if (!_ember['default'].isNone(med)) {
          if (med === 'cefdinir') {
            display = 'Cefdinir ' + this.get('cefdinir_dose') + this.get('unit');
          } else if (med === 'cefuroxime') {
            display = 'Cefuroxime ' + this.get('cefuroxime_dose') + this.get('unit');
          } else if (med === 'cefpodoxime') {
            display = 'Cefpodoxime ' + this.get('cefuroxime_dose') + this.get('unit');
          }
          this.get('medication_callback')({
            display: display,
            code: 'code',
            dosageInstruction: 'b.i.d',
            date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
            duration_value: this.get('duration_value'),
            duration_unit: this.get('duration_unit'),
            refills: 1
          });
        } else {
          this.get('medication_callback')({});
        }
      }
    }
  });
});
define('antimicrobial-cds/components/aom-penicillin', ['exports', 'ember', 'antimicrobial-cds/config/environment'], function (exports, _ember, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    dose: 0,
    duration_unit: null,
    duration_value: null,
    form: null,
    medication_callback: null,
    unit: 'mg',
    type: _ember['default'].computed('form', function () {
      if (this.form === 'liquid') {
        return ' Suspension';
      }
    }),
    weightChanged: _ember['default'].observer('this.fc.patient.weight.value', function () {
      this.calculate_dose();
    }),
    init: function init() {
      this._super.apply(this, arguments);
      this.calculate_dose();
    },
    calculate_dose: function calculate_dose() {
      if (this.fc.patient.weight.unit === 'kg') {
        var dose = this.fc.patient.weight.value * 85 / 2;
        if (dose > 2000) {
          this.set('dose', 2000);
        } else {
          this.set('dose', 125.0 * Math.round(dose / 125.0));
        }
      }
      if (this.fc.patient.age_value < 2) {
        this.set('duration_value', '10');
        this.set('duration_unit', 'days');
      } else if (this.fc.patient.age_value >= 2 && this.fc.patient.age_value <= 5) {
        this.set('duration_value', '7');
        this.set('duration_unit', 'days');
      } else {
        this.set('duration_value', '5 - 7');
        this.set('duration_unit', 'days');
      }

      // since AOM with no allergy has default medication, send back automatically.
      this.get('medication_callback')({
        display: 'Amoxicillin ' + this.get('dose') + this.get('unit'),
        code: 'code',
        dosageInstruction: 'b.i.d',
        date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
        duration_value: this.get('duration_value'),
        duration_unit: this.get('duration_unit'),
        refills: 1
      });
    },
    actions: {
      step5: function step5(med) {
        console.log("46 - aom-penicillin step5 action. med: ", med);
        if (!_ember['default'].isNone(med)) {
          this.get('medication_callback')({
            display: med[0].toUpperCase() + med.slice(1) + ' ' + this.get('dose') + this.get('unit'),
            code: 'code',
            dosageInstruction: 'b.i.d',
            date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
            duration_value: this.get('duration_value'),
            duration_unit: this.get('duration_unit'),
            refills: 1
          });
        } else {
          this.get('medication_callback')({});
        }
      }
    }
  });
});
define('antimicrobial-cds/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'antimicrobial-cds/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _antimicrobialCdsConfigEnvironment) {

  var name = _antimicrobialCdsConfigEnvironment['default'].APP.name;
  var version = _antimicrobialCdsConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('antimicrobial-cds/components/fa-icon', ['exports', 'ember-cli-font-awesome/components/fa-icon'], function (exports, _emberCliFontAwesomeComponentsFaIcon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFontAwesomeComponentsFaIcon['default'];
    }
  });
});
define('antimicrobial-cds/components/fa-list-icon', ['exports', 'ember-cli-font-awesome/components/fa-list-icon'], function (exports, _emberCliFontAwesomeComponentsFaListIcon) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFontAwesomeComponentsFaListIcon['default'];
    }
  });
});
define('antimicrobial-cds/components/fa-list', ['exports', 'ember-cli-font-awesome/components/fa-list'], function (exports, _emberCliFontAwesomeComponentsFaList) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFontAwesomeComponentsFaList['default'];
    }
  });
});
define('antimicrobial-cds/components/fa-stack', ['exports', 'ember-cli-font-awesome/components/fa-stack'], function (exports, _emberCliFontAwesomeComponentsFaStack) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFontAwesomeComponentsFaStack['default'];
    }
  });
});
define('antimicrobial-cds/components/launch-instructions', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('antimicrobial-cds/components/medication-list', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    highlight_color: null,
    meds: null,
    index: 0,
    display: null,
    shouldShow: false,
    init: function init() {
      this._super.apply(this, arguments);
      if (!_ember['default'].isEmpty(this.meds) && !_ember['default'].isEmpty(this.meds[this.index])) {
        this.set('display', this.meds[this.index].display);
        this.set('shouldShow', true);
      }
    }
  });
});
define('antimicrobial-cds/components/strep-modal', ['exports', 'ember', 'moment', 'antimicrobial-cds/config/environment'], function (exports, _ember, _moment, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    total_steps: 5,
    med_form: null,
    medication_callback: null,
    medication: {},
    isOverride: false,
    medicationselection: _ember['default'].computed('fc.patient.hasPenicillinAllergy', function () {
      if (!_ember['default'].isNone(this.fc.patient.hasPenicillinAllergy) && this.fc.patient.hasPenicillinAllergy) {
        return 'strep-non-penicillin';
      } else {
        return 'strep-penicillin';
      }
    }),
    exceedTempThreshold: _ember['default'].computed('fc.patient.temp.value', function () {
      return this.fc.patient.temp.value > _antimicrobialCdsConfigEnvironment['default'].APP.strep_temp_threshold;
    }),
    missingWeight: _ember['default'].computed('this.fc.patient.weight.value', function () {
      if (_ember['default'].isNone(this.fc.patient.weight.value) || this.fc.patient.weight.value === 'No Observation') {
        return true;
      }
      return false;
    }),
    uncheck_steps: function uncheck_steps(current_step) {
      //step 5 is medication, don't want to change that
      for (var step_num = current_step + 1; step_num < this.total_steps; step_num++) {
        _ember['default'].$('#strep_step' + step_num).find(":checked").attr('checked', false);
      }
    },
    toggle_next_steps: function toggle_next_steps(current_step) {
      var hide_next = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (hide_next) {
        _ember['default'].$('#strep_step' + (current_step + 1)).addClass('hidden');
      } else {
        _ember['default'].$('#strep_step' + (current_step + 1)).removeClass('hidden');
      }
      for (var step_num = current_step + 2; step_num <= this.total_steps; step_num++) {
        _ember['default'].$('#strep_step' + step_num).addClass('hidden');
      }
    },
    hide_override: function hide_override() {
      _ember['default'].$('#strep_override').addClass('hidden');
      this.set('isOverride', false);
      _ember['default'].$('#strep_override').val('');
    },
    actions: {
      step1_next: function step1_next() {
        this.toggle_next_steps(1);
        _ember['default'].$('#strep_criteria_not_met').addClass('hidden');
        _ember['default'].$('#strep_review').addClass('hidden');
        this.hide_override();
        this.uncheck_steps(1);
      },
      step1_done: function step1_done() {
        this.toggle_next_steps(1, true);
        _ember['default'].$('#strep_criteria_not_met').removeClass('hidden');
        _ember['default'].$('#strep_review').removeClass('hidden');
        _ember['default'].$('#strep_override').addClass('hidden');
        this.uncheck_steps(1);
      },
      step2_next: function step2_next() {
        _ember['default'].$('#strep_step3').addClass('hidden');
        _ember['default'].$('#strep_step4').removeClass('hidden');
        _ember['default'].$('#strep_step5').addClass('hidden');
        _ember['default'].$('#strep_criteria_not_met').addClass('hidden');
        _ember['default'].$('#strep_review').addClass('hidden');
        this.hide_override();
        this.uncheck_steps(2);
      },
      step2_done: function step2_done() {
        _ember['default'].$('#strep_step3').removeClass('hidden');
        _ember['default'].$('#strep_step4').addClass('hidden');
        _ember['default'].$('#strep_step5').addClass('hidden');
        _ember['default'].$('#strep_criteria_not_met').addClass('hidden');
        _ember['default'].$('#strep_review').removeClass('hidden');
        this.hide_override();
        this.uncheck_steps(2);
      },
      step3_next: function step3_next() {
        console.log('called step3');
        _ember['default'].$('#strep_step4').removeClass('hidden');
        _ember['default'].$('#strep_step5').addClass('hidden');
        _ember['default'].$('#strep_criteria_not_met').addClass('hidden');
        _ember['default'].$('#strep_review').addClass('hidden');
        this.hide_override();
        this.uncheck_steps(3);
      },
      step3_done: function step3_done() {
        _ember['default'].$('#strep_step4').addClass('hidden');
        _ember['default'].$('#strep_step5').addClass('hidden');
        _ember['default'].$('#strep_criteria_not_met').removeClass('hidden');
        _ember['default'].$('#strep_review').removeClass('hidden');
        _ember['default'].$('#strep_override').addClass('hidden');
        this.uncheck_steps(3);
      },
      step4: function step4(med_form) {
        this.set('med_form', med_form);
        _ember['default'].$('#strep_step5').removeClass('hidden');
        if (!this.isOverride) {
          _ember['default'].$('#strep_criteria_not_met').addClass('hidden');
        }
        _ember['default'].$('#strep_override').addClass('hidden');
        this.uncheck_steps(4);
      },
      step5: function step5(med) {
        this.set('medication', med);
        _ember['default'].$('#strep_review').removeClass('hidden');
        _ember['default'].$('#strep_override').addClass('hidden');
      },
      override: function override() {
        _ember['default'].$('#strep_override').removeClass('hidden');
      },
      forceallergy: function forceallergy() {
        if (_ember['default'].$('#strep_forceallergy').is(':checked')) {
          this.set('fc.patient.hasPenicillinAllergy', true);
        } else {
          this.set('fc.patient.hasPenicillinAllergy', false);
        }
      },
      forcemedication: function forcemedication() {
        if (!_ember['default'].isEmpty(_ember['default'].$('#strep_override').val())) {
          console.log('override value provided, need to show medication options');
          _ember['default'].$('#strep_step4').removeClass('hidden');
          this.set('isOverride', true);
        } else {
          _ember['default'].$('#strep_step4').addClass('hidden');
          _ember['default'].$('#strep_step5').addClass('hidden');
          this.set('isOverride', false);
        }
      },
      saveweight: function saveweight() {
        this.set('fc.patient.weight.value', parseInt(_ember['default'].$('#strep_weight').val()));
        this.set('fc.patient.weight.unit', 'kg');
        this.set('fc.patient.weight.date', (0, _moment['default'])().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format));
      },
      save: function save() {
        console.log("strep need to pass medication back to condition page");
        this.get('medication_callback')(this.get('medication'));
        _ember['default'].$('#StrepModal').modal('hide');
      }
    }
  });
});
define('antimicrobial-cds/components/strep-non-penicillin', ['exports', 'ember', 'antimicrobial-cds/config/environment'], function (exports, _ember, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    cephalexin_dose: 0,
    cephalexin_duration_value: null,
    cephalexin_frequency: null,
    azithromycin_dose: 0,
    azithromycin_duration_value: null,
    azithromycin_frequency: null,
    clindamycin_dose: 0,
    clindamycin_duration_value: null,
    clindamycin_frequency: null,
    duration_unit: 'days',
    form: null,
    unit: 'mg',
    medication_callback: null,
    weightChanged: _ember['default'].observer('this.fc.patient.weight.value', function () {
      this.calculate_dose();
    }),
    init: function init() {
      this._super.apply(this, arguments);
      this.calculate_dose();
    },
    calculate_dose: function calculate_dose() {
      var dose = 0;
      // Cephalexin calculation
      if (this.fc.patient.weight.unit === 'kg') {
        dose = this.fc.patient.weight.value * 20 / 2;
        if (dose > 500) {
          this.set('cephalexin_dose', 500);
        } else {
          this.set('cephalexin_dose', 125.0 * Math.round(dose / 125.0));
        }
      }
      this.set('cephalexin_duration_value', '10');
      this.set('cephalexin_frequency', 'b.i.d.');

      // Azithromycin calculation
      if (this.fc.patient.weight.unit === 'kg') {
        dose = this.fc.patient.weight.value * 12;
        if (dose > 500) {
          this.set('azithromycin_dose', 500);
        } else {
          this.set('azithromycin_dose', 125.0 * Math.round(dose / 125.0));
        }
      }
      this.set('azithromycin_duration_value', '5');
      this.set('azithromycin_frequency', 'once daily');

      // Clindamycin calculation
      if (this.fc.patient.weight.unit === 'kg') {
        dose = this.fc.patient.weight.value * 7;
        if (dose * 3 > 900) {
          this.set('clindamycin_dose', 300);
        } else {
          this.set('clindamycin_dose', 50.0 * Math.round(dose / 50.0));
        }
      }
      this.set('clindamycin_frequency', '3 times daily');
      this.set('clindamycin_duration_value', '10');
    },
    actions: {
      step5: function step5(med) {
        if (!_ember['default'].isNone(med)) {
          var display = med[0].toUpperCase() + med.slice(1) + ' ' + this.get(med + '_dose') + this.get('unit');
          this.get('medication_callback')({
            display: display,
            code: 'code',
            dosageInstruction: this.get(med + '_frequency'),
            date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
            duration_value: this.get(med + '_duration_value'),
            duration_unit: this.get('duration_unit'),
            refills: 1
          });
        } else {
          this.get('medication_callback')({});
        }
      }
    }
  });
});
define('antimicrobial-cds/components/strep-penicillin', ['exports', 'ember', 'antimicrobial-cds/config/environment'], function (exports, _ember, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Component.extend({
    penicillin_dose: 0,
    penicillin_unit: 'mg',
    penicillin_duration: '10 days',
    benzathine_dose: 0,
    benzathine_unit: 'IU IM',
    benzathine_duration_value: 'x 1',
    benzathine_duration_unit: 'dose',
    suspension_dose: 0,
    suspension_unit: 'mg',
    form: null,
    medication_callback: null,
    needsLiquid: _ember['default'].computed('form', function () {
      if (this.form === 'liquid') {
        this.get('medication_callback')({
          display: 'Amoxicillin suspension ' + this.get('suspension_dose') + this.get('suspension_unit'),
          code: 'code',
          dosageInstruction: '1 daily',
          date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
          duration_value: '10',
          duration_unit: 'days',
          refills: 1
        });
        return true;
      } else {
        return false;
      }
    }),
    weightChanged: _ember['default'].observer('this.fc.patient.weight.value', function () {
      this.calculate_dose();
    }),
    init: function init() {
      this._super.apply(this, arguments);
      this.calculate_dose();
    },
    calculate_dose: function calculate_dose() {
      if (this.fc.patient.weight.unit === 'kg') {
        if (this.fc.patient.weight.value < 27) {
          this.set('penicillin_dose', 250);
          this.set('benzathine_dose', '600,000');
        } else {
          this.set('penicillin_dose', 500);
          this.set('benzathine_dose', '1,200,000');
        }
        var dose = this.fc.patient.weight.value * 50;
        console.log('this.fc.patient.weight.value :', this.fc.patient.weight.value);
        console.log('dose :', dose);
        if (dose > 1000) {
          this.set('suspension_dose', 1000);
        } else {
          this.set('suspension_dose', this.set('dose', 125.0 * Math.round(dose / 125.0)));
        }
      }
    },
    actions: {
      step5: function step5(med) {
        console.log("60 - strep-penicillin step5 action. med: ", med);
        if (!_ember['default'].isNone(med)) {
          if (med === 'Amoxicillin suspension') {
            this.get('medication_callback')({
              display: med + ' ' + this.get('suspension_dose') + this.get('suspension_unit'),
              code: 'code',
              dosageInstruction: '1 daily',
              date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
              duration_value: '10',
              duration_unit: 'days',
              refills: 1
            });
          } else if (med === 'Penicillin VK') {
            this.get('medication_callback')({
              display: med + ' ' + this.get('penicillin_dose') + this.get('penicillin_unit'),
              code: 'code',
              dosageInstruction: 'b.i.d',
              date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
              duration_value: '10',
              duration_unit: 'days',
              refills: 1
            });
          } else if (med === 'Benzathine penicillin') {
            this.get('medication_callback')({
              display: med + ' ' + this.get('benzathine_dose') + this.get('benzathine_unit'),
              code: 'code',
              dosageInstruction: '1 dose',
              date: moment().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format),
              duration_value: this.get('benzathine_duration_value'),
              duration_unit: this.get('benzathine_duration_unit'),
              refills: 1
            });
          }
        } else {
          this.get('medication_callback')({});
        }
      }
    }
  });
});
define('antimicrobial-cds/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('antimicrobial-cds/controllers/conditions', ['exports', 'ember', 'antimicrobial-cds/config/environment'], function (exports, _ember, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Controller.extend({
    medication: {},
    actions: {
      fire_cds: function fire_cds() {
        var diagnosis = _ember['default'].$('#condition_diagnosis').val();
        if (!_ember['default'].isEmpty(diagnosis)) {
          if (_antimicrobialCdsConfigEnvironment['default'].APP.aom_cds.indexOf(diagnosis) > -1) {
            console.log("need to fire AOM CDS");
            _ember['default'].$('#AOMModal').modal('show');
          } else if (_antimicrobialCdsConfigEnvironment['default'].APP.strep_cds.indexOf(diagnosis) > -1) {
            console.log("need to fire Strep CDS");
            _ember['default'].$('#StrepModal').modal('show');
          } else {
            console.log("unknown SNOMED-CT code.");
          }
        }
      },
      medication_callback: function medication_callback(med) {
        console.log('medication : ', med);
        this.set('medication', med);
      },
      clearall: function clearall() {
        this.set('medication', {});
        _ember['default'].$('#condition_form').trigger('reset');
      },
      save: function save() {
        if (!_ember['default'].isNone(this.medication)) {
          this.fc.addMedication(this.medication);
        }
        this.send('clearall');
      }
    }
  });
});
define('antimicrobial-cds/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('antimicrobial-cds/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _emberMomentHelpersMomentDuration) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberMomentHelpersMomentDuration['default'];
    }
  });
});
define('antimicrobial-cds/helpers/moment-format', ['exports', 'ember', 'antimicrobial-cds/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _ember, _antimicrobialCdsConfigEnvironment, _emberMomentHelpersMomentFormat) {
  exports['default'] = _emberMomentHelpersMomentFormat['default'].extend({
    globalOutputFormat: _ember['default'].get(_antimicrobialCdsConfigEnvironment['default'], 'moment.outputFormat'),
    globalAllowEmpty: !!_ember['default'].get(_antimicrobialCdsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('antimicrobial-cds/helpers/moment-from-now', ['exports', 'ember', 'antimicrobial-cds/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _ember, _antimicrobialCdsConfigEnvironment, _emberMomentHelpersMomentFromNow) {
  exports['default'] = _emberMomentHelpersMomentFromNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_antimicrobialCdsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('antimicrobial-cds/helpers/moment-to-now', ['exports', 'ember', 'antimicrobial-cds/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _ember, _antimicrobialCdsConfigEnvironment, _emberMomentHelpersMomentToNow) {
  exports['default'] = _emberMomentHelpersMomentToNow['default'].extend({
    globalAllowEmpty: !!_ember['default'].get(_antimicrobialCdsConfigEnvironment['default'], 'moment.allowEmpty')
  });
});
define('antimicrobial-cds/helpers/round', ['exports', 'ember'], function (exports, _ember) {
  exports.round = round;

  function round(params /*, hash*/) {
    var val = params[0];
    var decimals = params[1] || 2;
    if (typeof val !== 'undefined' && val !== 'No Observation') {
      var retStr = parseFloat(val).toFixed(decimals);
      return new _ember['default'].Handlebars.SafeString(retStr);
    } else {
      return val;
    }
  }

  exports['default'] = _ember['default'].Helper.helper(round);
});
define('antimicrobial-cds/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'antimicrobial-cds/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_antimicrobialCdsConfigEnvironment['default'].APP.name, _antimicrobialCdsConfigEnvironment['default'].APP.version)
  };
});
define('antimicrobial-cds/initializers/export-application-global', ['exports', 'ember', 'antimicrobial-cds/config/environment'], function (exports, _ember, _antimicrobialCdsConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_antimicrobialCdsConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _antimicrobialCdsConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_antimicrobialCdsConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('antimicrobial-cds/initializers/fhirclient-service', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize(application) {
    application.inject('route', 'fc', 'service:fhir-client');
    application.inject('controller', 'fc', 'service:fhir-client');
    application.inject('component', 'fc', 'service:fhir-client');
  }

  exports['default'] = {
    name: 'fhirclient-service',
    initialize: initialize
  };
});
define('antimicrobial-cds/router', ['exports', 'ember', 'antimicrobial-cds/config/environment'], function (exports, _ember, _antimicrobialCdsConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _antimicrobialCdsConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('medicationorders');
    this.route('conditions');
    this.route('patient');
    this.route('about');
  });

  exports['default'] = Router;

  /*
    need routes for:
      patient - default?
      medicationorders
      conditions
  
      ember generate route medicationorders
      ember generate route conditions
      */

  /* need a objects for:
      vitals/observations (possibly combine with Lab)
        need most recent temperature, weight. Any others needed?
      problem list - FHIR resource Condition
      medication - FHIR resource MedicationOrder
      allergy - FHIR resource AllergyIntolerance
      lab result - FHIR resource Observation
  
      need collection for each of the above. Sort by date
  */
});
define('antimicrobial-cds/routes/about', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('antimicrobial-cds/routes/conditions', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      if (!this.get('fc.isAuthenticated')) {
        this.transitionTo('index');
      }
    }
  });
});
define('antimicrobial-cds/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    actions: {
      showinstructions: function showinstructions() {
        _ember['default'].$('#instructions').toggleClass('hidden');
      },
      override: function override() {
        this.set('fc.isAuthenticated', true);
      }
    }
  });
});
define('antimicrobial-cds/routes/medicationorders', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      if (!this.get('fc.isAuthenticated')) {
        this.transitionTo('index');
      }
    }
  });
});
define('antimicrobial-cds/routes/patient', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      if (!this.get('fc.isAuthenticated')) {
        this.transitionTo('index');
      }
    }
  });
});
define('antimicrobial-cds/services/fhir-client', ['exports', 'ember', 'moment', 'antimicrobial-cds/config/environment'], function (exports, _ember, _moment, _antimicrobialCdsConfigEnvironment) {
  exports['default'] = _ember['default'].Service.extend({
    patient: {
      formatted_name: null,
      gender: null,
      birthDate: null,
      formatted_address: null,
      age_value: 0,
      age_unit: 'years',
      temp: {},
      weight: {},
      bloodpressure: {
        diastolic: {},
        systolic: {}
      },
      medications: [],
      allergies: [],
      hasPenicillinAllergy: null
    },
    patientContext: null,
    fhirclient: null,
    fhirPatient: null,
    isAuthenticated: false,
    isLoading: true,
    fhirFailed: false,
    isPediatric: false,
    birthDateChanged: _ember['default'].observer('patient.birthDate', function () {
      var retval = 0;
      if (!_ember['default'].isNone(this.patient.birthDate)) {
        var bday = (0, _moment['default'])(this.patient.birthDate, _antimicrobialCdsConfigEnvironment['default'].APP.date_format);
        retval = (0, _moment['default'])().diff(bday, 'years');
        if (retval < 19) {
          this.set('isPediatric', true);
        }
        if (retval <= 2) {
          this.set('patient.age_value', (0, _moment['default'])().diff(bday, 'months'));
          this.set('patient.age_unit', 'months');
        } else {
          this.set('patient.age_value', retval);
          this.set('patient.age_unit', 'years');
        }
      }
    }),

    init: function init() {
      // this not available in callbacks
      var self = this;
      this._super.apply(this, arguments);

      // wait up to 10 seconds for everything to work. If fails, use fake patient data
      var timeout = setTimeout(function () {
        self.set('fhirFailed', true);
        self.set('isLoading', false);
        self.loadPatient('demo');
      }, 5000);

      // this line prevents the addition of a timestamp to the fhir-client.js file
      _ember['default'].$.ajaxSetup({ cache: true });
      // calling this creates the global FHIR object
      _ember['default'].$.getScript("https://sandbox.hspconsortium.org/dstu2/fhir-client/fhir-client.js")
      //Ember.$.getScript("/js/fhir-client.js")
      .done(function () {
        FHIR.oauth2.ready(function (fhirclient) {
          self.set('isAuthenticated', true);
          self.set('fhirclient', fhirclient);
          if (!_ember['default'].isNone(fhirclient)) {
            console.log("fhirclient : ", fhirclient);
            if (!_ember['default'].isNone(fhirclient.patient)) {
              console.log("fhirclient.patient : ", fhirclient.patient);
              self.set('patientContext', fhirclient.patient);
              _ember['default'].$.when(self.patientContext.read()).done(function (p) {
                console.log("Patient: ", p);
                self.set('fhirPatient', p);
                var name = p.name[0];
                self.patient.formatted_name = name.given.join(" ") + " " + name.family;
                if (!_ember['default'].isNone(p.address)) {
                  self.patient.formatted_address = p.address[0].line[0] + ', ' + p.address[0].city + ', ' + p.address[0].state;
                }
                self.set('patient.birthDate', p.birthDate);
                self.set('patient.gender', p.gender);
                self.readWeight();
                self.readTemp();
                self.readBP();
                self.readMedications();
                //self.getConditions();
                clearTimeout(timeout);
                self.set('isLoading', false);
              });
            }
          }
        });
        console.log("service - FHIR script loaded successfully.");
      }).fail(function () {
        console.log("service - FHIR script FAILED to load.");
      });
    },
    readWeight: function readWeight() {
      var self = this;
      self.getObservation('3141-9', function (r) {
        self.patient.weight = r;
      });
    },
    readTemp: function readTemp() {
      var self = this;
      self.getObservation('8310-5', function (r) {
        self.patient.temp = r;
      });
    },
    readBP: function readBP() {
      var self = this;
      self.patient.bloodpressure = {};
      self.getObservation('8462-4', function (r) {
        self.patient.bloodpressure.diastolic = r;
      });
      self.getObservation('8480-6', function (r) {
        self.patient.bloodpressure.systolic = r;
      });
    },
    getObservation: function getObservation(code, callback) {
      var count = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

      var ret = { value: 'No Observation' };

      _ember['default'].$.when(this.patientContext.api.search({
        'type': "Observation",
        'query': {
          'code': code,
          '_sort:desc': 'date' },
        'count': count })).done(function (observations) {
        console.log('observations: ', observations);
        if (!_ember['default'].isNone(observations.data.entry)) {
          observations.data.entry.forEach(function (obs) {
            if (obs.resource.hasOwnProperty('effectiveDateTime') && obs.resource.hasOwnProperty('valueQuantity') && obs.resource.valueQuantity.hasOwnProperty('value') && obs.resource.valueQuantity.hasOwnProperty('unit')) {
              ret.value = obs.resource.valueQuantity.value;
              ret.date = obs.resource.effectiveDateTime;
              ret.unit = obs.resource.valueQuantity.unit;
            } else {
              console.log("fhir-client - expected properties missing for code ", code);
            }
          });
        }
        if (typeof callback === 'function') {
          callback(ret);
        }
      });
    },
    readMedications: function readMedications() {
      var self = this;
      self.getMedications('', function (r) {
        self.set('patient.medications', r);
        console.log("161: ", self.patient.medications);
      });
    },
    addMedication: function addMedication(input) {
      var m = {};
      m.display = input.display;
      m.code = input.code;
      m.dosageInstruction = input.dosageInstruction;
      m.date = input.date;
      m.duration_value = input.duration_value;
      m.duration_unit = input.duration_unit;
      m.refills = input.refills;
      this.patient.medications.unshiftObject(m);
    },
    getMedications: function getMedications(code, callback) {
      var count = arguments.length <= 2 || arguments[2] === undefined ? 5 : arguments[2];

      var ret = [];
      _ember['default'].$.when(this.patientContext.api.search({
        'type': "MedicationOrder",
        // 'query': {
        //   'code': code,
        //   '_sort:desc':'date'},
        'count': count })).done(function (medications) {
        console.log('medications: ', medications);
        if (!_ember['default'].isNone(medications.data.entry)) {
          medications.data.entry.forEach(function (med) {
            if (med.resource.hasOwnProperty('medicationCodeableConcept')) {
              var m = med.resource;
              var r = {};
              r.display = m.medicationCodeableConcept.coding[0].display;
              r.code = m.medicationCodeableConcept.coding[0].code;
              r.dosageInstruction = m.dosageInstruction[0].text;
              r.date = m.dosageInstruction[0].timing.repeat.boundsPeriod.start;
              r.duration_value = m.dispenseRequest.expectedSupplyDuration.value;
              r.duration_unit = m.dispenseRequest.expectedSupplyDuration.unit;
              r.refills = m.dispenseRequest.numberOfRepeatsAllowed;
              ret.push(r);
            } else {
              console.log("fhir-client - expected properties missing for medication ", med);
            }
          });
        }
        if (typeof callback === 'function') {
          callback(ret);
        }
      });
    },
    getConditions: function getConditions() {
      var self = this;
      console.log("this.patientContext : ", self.patientContext);
      setTimeout(function () {
        console.log("this.patientContext : ", self.patientContext);
        self.patientContext.Condition.where.code('102594003').search().then(function (conds) {
          console.log("Conditions: ", conds);
        });
      }, 3000);
    },
    loadPatient: function loadPatient(patient) {
      if (patient === 'demo') {
        var date = (0, _moment['default'])().format(_antimicrobialCdsConfigEnvironment['default'].APP.date_format);
        this.set('patient.formatted_name', 'Kacey Jones');
        this.set('patient.formatted_address', '123 Place Lane, Salt Lake City, UT');
        this.set('patient.gender', 'male');
        this.set('patient.birthDate', '2008/01/01');
        this.set('patient.weight', {
          value: 18,
          date: date,
          unit: 'kg'
        });
        this.set('patient.temp', {
          value: 40,
          date: date,
          unit: 'Cel'
        });
        this.set('patient.bloodpressure', {
          systolic: {
            value: 100,
            date: date,
            unit: 'mmHg'
          },
          diastolic: {
            value: 60,
            date: date,
            unit: 'mmHg'
          }
        });
        this.set('patient.hasPenicillinAllergy', true);
      }
    }
  });
});
/* global FHIR */
define('antimicrobial-cds/services/moment', ['exports', 'ember', 'moment'], function (exports, _ember, _moment2) {
  var computed = _ember['default'].computed;
  exports['default'] = _ember['default'].Service.extend({
    _locale: null,
    _timeZone: null,

    locale: computed({
      get: function get() {
        return this.get('_locale');
      },
      set: function set(propertyKey, locale) {
        this.set('_locale', locale);
        return locale;
      }
    }),

    timeZone: computed({
      get: function get() {
        return this.get('_timeZone');
      },
      set: function set(propertyKey, timeZone) {
        if (_moment2['default'].tz) {
          this.set('_timeZone', timeZone);
          return timeZone;
        } else {
          _ember['default'].Logger.warn('[ember-moment] attempted to set timezone, but moment-timezone unavailable.');
        }
      }
    }),

    changeLocale: function changeLocale(locale) {
      this.set('locale', locale);
    },

    changeTimeZone: function changeTimeZone(timeZone) {
      this.set('timeZone', timeZone);
    },

    moment: function moment() {
      var time = _moment2['default'].apply(undefined, arguments);
      var locale = this.get('locale');
      var timeZone = this.get('timeZone');

      if (locale) {
        time = time.locale(locale);
      }

      if (timeZone && time.tz) {
        time = time.tz(timeZone);
      }

      return time;
    }
  });
});
define("antimicrobial-cds/templates/about", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/about.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("The overprescribing of antibiotics is a broad collection of issues that cannot\n  be solved easily at once. In order to quickly provide a measurable solution to\n  the problem we propose to create a limited scope Clinical Decision Support\n  system (CDSS) to make antibiotic recommendations for pediatric patients for\n  acute otitis media (AOM) and streptococcal pharyngitis.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("This prototype system will provide antibiotic recommendations for pediatric\n  populations. The recommendation will include which antibiotic(s)\n  to prescribe, dosage, and length of treatment based on patient specific\n  values.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Technologies employed:");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("EmberJS");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Bootstrap");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Font Awesome");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("SMART on FHIR");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Proposed topic and research developed by:");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Jeremy Gleed");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Nicholas Link");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Sashi Poudel");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Jace Richards");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Seth Russell");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n  ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 12, 12, contextualElement);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [27, 2], [27, 12]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("antimicrobial-cds/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 22,
                "column": 10
              },
              "end": {
                "line": 28,
                "column": 10
              }
            },
            "moduleName": "antimicrobial-cds/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("ul");
            dom.setAttribute(el1, "class", "nav navbar-nav navbar-right");
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("li");
            dom.setAttribute(el2, "class", "navcontent");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("li");
            dom.setAttribute(el2, "class", "navcontent");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("li");
            dom.setAttribute(el2, "class", "navcontent");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
            morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
            morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
            return morphs;
          },
          statements: [["content", "fc.patient.formatted_name", ["loc", [null, [24, 37], [24, 66]]]], ["content", "fc.patient.gender", ["loc", [null, [25, 37], [25, 58]]]], ["content", "fc.patient.birthDate", ["loc", [null, [26, 37], [26, 61]]]]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 21,
              "column": 8
            },
            "end": {
              "line": 29,
              "column": 8
            }
          },
          "moduleName": "antimicrobial-cds/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "unless", [["get", "fc.isLoading", ["loc", [null, [22, 20], [22, 32]]]]], [], 0, null, ["loc", [null, [22, 10], [28, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "triple-curlies"
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 43,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        dom.setAttribute(el2, "id", "title");
        var el3 = dom.createTextNode("Pediatric Antimicrobial CDS");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2, "class", "navbar navbar-default");
        dom.setAttribute(el2, "role", "navigation");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "container-fluid");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "navbar-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "class", "navbar-toggle collapsed");
        dom.setAttribute(el5, "data-toggle", "collapse");
        dom.setAttribute(el5, "data-target", "#appnavbar");
        dom.setAttribute(el5, "aria-expanded", "false");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "class", "sr-only");
        var el7 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "class", "icon-bar");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "class", "icon-bar");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "class", "icon-bar");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "collapse navbar-collapse");
        dom.setAttribute(el4, "id", "appnavbar");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5, "class", "nav navbar-nav");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        dom.setAttribute(el6, "id", "about");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Source code available at ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "https://github.com/magic-lantern/AntimicrobialCDS");
        var el5 = dom.createTextNode("https://github.com/magic-lantern/AntimicrobialCDS");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        var el4 = dom.createTextNode("Source code Copyright © 2015 Seth Russell, Licensed under the Apache License, Version 2.0.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [3, 1, 3]);
        var element3 = dom.childAt(element2, [1]);
        var morphs = new Array(7);
        morphs[0] = dom.createMorphAt(dom.childAt(element3, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element3, [3]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(element3, [5]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element3, [7]), 0, 0);
        morphs[4] = dom.createMorphAt(dom.childAt(element3, [9]), 0, 0);
        morphs[5] = dom.createMorphAt(element2, 3, 3);
        morphs[6] = dom.createMorphAt(element1, 5, 5);
        return morphs;
      },
      statements: [["inline", "link-to", ["App Home", "index"], [], ["loc", [null, [15, 14], [15, 44]]]], ["inline", "link-to", ["Patient Summary", "patient"], [], ["loc", [null, [16, 14], [16, 53]]]], ["inline", "link-to", ["Medications", "medicationorders"], [], ["loc", [null, [17, 14], [17, 58]]]], ["inline", "link-to", ["Conditions", "conditions"], [], ["loc", [null, [18, 14], [18, 51]]]], ["inline", "link-to", ["About", "about"], [], ["loc", [null, [19, 25], [19, 52]]]], ["block", "if", [["get", "fc.isAuthenticated", ["loc", [null, [21, 14], [21, 32]]]]], [], 0, null, ["loc", [null, [21, 8], [29, 15]]]], ["content", "outlet", ["loc", [null, [33, 0], [33, 10]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("antimicrobial-cds/templates/components/aom-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 82,
              "column": 21
            },
            "end": {
              "line": 84,
              "column": 22
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fa-icon", [], ["icon", "check-circle-o"], ["loc", [null, [83, 24], [83, 57]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 84,
              "column": 22
            },
            "end": {
              "line": 86,
              "column": 22
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["inline", "fa-icon", [], ["icon", "times-circle-o"], ["loc", [null, [85, 24], [85, 57]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 113,
              "column": 16
            },
            "end": {
              "line": 115,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createTextNode("Select antibiotic ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("small");
          var el3 = dom.createElement("input");
          dom.setAttribute(el3, "id", "aom_forceallergy");
          dom.setAttribute(el3, "type", "checkbox");
          dom.setAttribute(el3, "checked", "");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" Penicillin Allergy");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          if (this.cachedFragment) {
            dom.repairClonedNode(dom.childAt(fragment, [1, 1, 0]), [], true);
          }
          var element3 = dom.childAt(fragment, [1, 1, 0]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element3);
          return morphs;
        },
        statements: [["element", "action", ["forceallergy"], ["on", "change"], ["loc", [null, [114, 92], [114, 129]]]]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 115,
              "column": 16
            },
            "end": {
              "line": 117,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createTextNode("Select antibiotic ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("small");
          var el3 = dom.createElement("input");
          dom.setAttribute(el3, "id", "aom_forceallergy");
          dom.setAttribute(el3, "type", "checkbox");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" Penicillin Allergy");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1, 1, 0]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element2);
          return morphs;
        },
        statements: [["element", "action", ["forceallergy"], ["on", "change"], ["loc", [null, [116, 92], [116, 129]]]]],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 118,
              "column": 16
            },
            "end": {
              "line": 130,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1, "class", "form-horizontal");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "form-group zeroborder");
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("label");
          dom.setAttribute(el3, "for", "condition_datetime");
          dom.setAttribute(el3, "class", "col-sm-2 control-label");
          var el4 = dom.createTextNode("Weight");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-sm-4");
          var el4 = dom.createTextNode("\n                        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("input");
          dom.setAttribute(el4, "id", "aom_weight");
          dom.setAttribute(el4, "class", "form-control");
          dom.setAttribute(el4, "placeholder", "Patient Weight in kg");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-sm-5");
          var el4 = dom.createTextNode("\n                        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "text-warning");
          var el5 = dom.createTextNode("Weight required for dose calculation");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 1, 3, 1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["element", "action", ["saveweight"], ["on", "change"], ["loc", [null, [123, 103], [123, 138]]]]],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 130,
              "column": 16
            },
            "end": {
              "line": 136,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Based on patient ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2, "class", "note");
          var el3 = dom.createTextNode("current weight ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(",\n                    age ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" old");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(", and known allergies, recommended option selected");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "radio_group");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(5);
          morphs[0] = dom.createMorphAt(element0, 1, 1);
          morphs[1] = dom.createMorphAt(element0, 2, 2);
          morphs[2] = dom.createMorphAt(element0, 4, 4);
          morphs[3] = dom.createMorphAt(element0, 6, 6);
          morphs[4] = dom.createMorphAt(dom.childAt(fragment, [3]), 1, 1);
          return morphs;
        },
        statements: [["inline", "round", [["get", "fc.patient.weight.value", ["loc", [null, [131, 80], [131, 103]]]]], [], ["loc", [null, [131, 72], [131, 105]]]], ["content", "fc.patient.weight.unit", ["loc", [null, [131, 105], [131, 131]]]], ["content", "fc.patient.age_value", ["loc", [null, [132, 24], [132, 48]]]], ["content", "fc.patient.age_unit", ["loc", [null, [132, 49], [132, 72]]]], ["inline", "component", [["get", "medicationselection", ["loc", [null, [134, 32], [134, 51]]]]], ["form", ["subexpr", "@mut", [["get", "med_form", ["loc", [null, [134, 57], [134, 65]]]]], [], []], "medication_callback", ["subexpr", "action", ["step5"], [], ["loc", [null, [134, 86], [134, 102]]]]], ["loc", [null, [134, 20], [134, 104]]]]],
        locals: [],
        templates: []
      };
    })();
    var child6 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 141,
              "column": 14
            },
            "end": {
              "line": 145,
              "column": 14
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "row");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createTextNode("Diagnostic Criteria for Acute Otitis Media requiring antibiotics met");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 164,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/aom-modal.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "AOMModal");
        dom.setAttribute(el1, "class", "modal fade");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "modal-dialog");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "modal-content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "modal-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "class", "close");
        dom.setAttribute(el5, "data-dismiss", "modal");
        dom.setAttribute(el5, "aria-label", "Close");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "aria-hidden", "true");
        var el7 = dom.createTextNode("×");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5, "class", "modal-title");
        var el6 = dom.createTextNode("Bacterial disease diagnosis and medication guide");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Based on Intermountain Healthcare's ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "https://intermountainhealthcare.org/ext/Dcmnt?ncid=522927223");
        var el7 = dom.createTextNode("Acute Otitis Media Care Process Model");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" updated September 2013");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "modal-body");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "container");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "modal-fixes");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row");
        dom.setAttribute(el7, "id", "aom_step1");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h4");
        var el9 = dom.createTextNode("Select the image that most closely resembles the patient's inner ear");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-sm-6");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9, "id", "bacterial_infection");
        dom.setAttribute(el9, "src", "images/bacterial_infection.jpg");
        dom.setAttribute(el9, "alt", "Acute otitis media");
        dom.setAttribute(el9, "class", "img-circle img-responsive");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-sm-6");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("img");
        dom.setAttribute(el9, "id", "no_antibiotic");
        dom.setAttribute(el9, "src", "images/no_antibiotic.jpg");
        dom.setAttribute(el9, "alt", "Otitis media with effusion");
        dom.setAttribute(el9, "class", "img-circle img-responsive");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "aom_step2");
        dom.setAttribute(el7, "class", "hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "col-sm-6");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10, "class", "radio");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("label");
        var el12 = dom.createTextNode("\n                      ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("h4");
        var el13 = dom.createTextNode("\n                        ");
        dom.appendChild(el12, el13);
        var el13 = dom.createElement("input");
        dom.setAttribute(el13, "type", "radio");
        dom.setAttribute(el13, "name", "aommeets");
        dom.setAttribute(el13, "id", "aommeetsRadios1");
        dom.setAttribute(el13, "value", "option1");
        dom.appendChild(el12, el13);
        var el13 = dom.createTextNode("\n                        Meets the following\n                      ");
        dom.appendChild(el12, el13);
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "col-sm-6");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10, "class", "radio");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("label");
        var el12 = dom.createTextNode("\n                      ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("h4");
        var el13 = dom.createTextNode("\n                        ");
        dom.appendChild(el12, el13);
        var el13 = dom.createElement("input");
        dom.setAttribute(el13, "type", "radio");
        dom.setAttribute(el13, "name", "aommeets");
        dom.setAttribute(el13, "id", "aommeetsRadios2");
        dom.setAttribute(el13, "value", "option2");
        dom.appendChild(el12, el13);
        var el13 = dom.createTextNode("\n                        Does NOT meet the following\n                      ");
        dom.appendChild(el12, el13);
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Has cloudy yellow fluid in the middle ear space PLUS at least 1 of the following:");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("ol");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Bulging ear drum");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Otorrhea");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Mild bulging with redness AND new pain");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "aom_step3");
        dom.setAttribute(el7, "class", "hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "col-sm-6");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10, "class", "radio");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("label");
        var el12 = dom.createTextNode("\n                      ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("h4");
        var el13 = dom.createTextNode("\n                        ");
        dom.appendChild(el12, el13);
        var el13 = dom.createElement("input");
        dom.setAttribute(el13, "type", "radio");
        dom.setAttribute(el13, "name", "severity");
        dom.setAttribute(el13, "id", "severityRadios1");
        dom.setAttribute(el13, "value", "option1");
        dom.appendChild(el12, el13);
        var el13 = dom.createTextNode("\n                        Severe AOM\n                      ");
        dom.appendChild(el12, el13);
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "col-sm-6");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10, "class", "radio");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("label");
        var el12 = dom.createTextNode("\n                      ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("h4");
        var el13 = dom.createTextNode("\n                        ");
        dom.appendChild(el12, el13);
        var el13 = dom.createElement("input");
        dom.setAttribute(el13, "type", "radio");
        dom.setAttribute(el13, "name", "severity");
        dom.setAttribute(el13, "id", "severityRadios2");
        dom.setAttribute(el13, "value", "option2");
        dom.appendChild(el12, el13);
        var el13 = dom.createTextNode("\n                        Mild or Moderate AOM\n                      ");
        dom.appendChild(el12, el13);
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("Severe Includes:");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "list");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("p");
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode(" Significant ear pain for > 48 hours OR");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("p");
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("                    Fever > 39°C ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("span");
        dom.setAttribute(el11, "class", "note");
        var el12 = dom.createTextNode("Current temp: ");
        dom.appendChild(el11, el12);
        var el12 = dom.createComment("");
        dom.appendChild(el11, el12);
        var el12 = dom.createComment("");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode(" OR");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("p");
        var el11 = dom.createComment("");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode(" Otorrhea");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "aom_step4");
        dom.setAttribute(el7, "class", "hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("h4");
        var el10 = dom.createTextNode("Select patient medication preference");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio_group");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10, "class", "radio");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("label");
        var el12 = dom.createTextNode("\n                    ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("input");
        dom.setAttribute(el12, "type", "radio");
        dom.setAttribute(el12, "name", "medication_form");
        dom.setAttribute(el12, "id", "aom_medication_form_liquid");
        dom.setAttribute(el12, "value", "liquid");
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                    Liquid\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("div");
        dom.setAttribute(el10, "class", "radio");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("label");
        var el12 = dom.createTextNode("\n                    ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("input");
        dom.setAttribute(el12, "type", "radio");
        dom.setAttribute(el12, "name", "medication_form");
        dom.setAttribute(el12, "id", "aom_medication_form_pill");
        dom.setAttribute(el12, "value", "pill");
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                    Pill/Tablet\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "aom_step5");
        dom.setAttribute(el7, "class", "hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("p");
        var el10 = dom.createTextNode("NOTE: Azithromycin is NOT recommended due to antibiotic resistance.");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "aom_criteria_not_met");
        dom.setAttribute(el7, "class", "row hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h4");
        var el9 = dom.createTextNode("Diagnostic Criteria for Acute Otitis Media requiring antibiotics ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("span");
        dom.setAttribute(el9, "class", "note");
        var el10 = dom.createTextNode("not");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode(" met.");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Recommend close follow-up but no antibiotics. ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("button");
        dom.setAttribute(el9, "type", "button");
        dom.setAttribute(el9, "class", "btn btn-sm btn-warning");
        var el10 = dom.createTextNode("Override");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("input");
        dom.setAttribute(el8, "id", "aom_override");
        dom.setAttribute(el8, "type", "text");
        dom.setAttribute(el8, "class", "form-control hidden");
        dom.setAttribute(el8, "placeholder", "Reason for override");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "modal-footer");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "id", "aom_cancel");
        dom.setAttribute(el5, "class", "btn btn-danger pull-left");
        dom.setAttribute(el5, "data-dismiss", "modal");
        var el6 = dom.createTextNode("Cancel");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "id", "aom_review");
        dom.setAttribute(el5, "class", "btn btn-primary hidden");
        var el6 = dom.createTextNode("Review");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" /.modal-content ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /.modal-dialog ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" /.modal ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0, 1, 1]);
        var element5 = dom.childAt(element4, [3, 1, 1]);
        var element6 = dom.childAt(element5, [3]);
        var element7 = dom.childAt(element6, [1, 1]);
        var element8 = dom.childAt(element6, [3, 1]);
        var element9 = dom.childAt(element5, [5, 1]);
        var element10 = dom.childAt(element9, [1, 1, 1, 1, 1]);
        var element11 = dom.childAt(element9, [3, 1, 1, 1, 1]);
        var element12 = dom.childAt(element5, [7]);
        var element13 = dom.childAt(element12, [1]);
        var element14 = dom.childAt(element13, [1, 1, 1, 1, 1]);
        var element15 = dom.childAt(element13, [3, 1, 1, 1, 1]);
        var element16 = dom.childAt(element12, [3, 3]);
        var element17 = dom.childAt(element16, [3]);
        var element18 = dom.childAt(element17, [2]);
        var element19 = dom.childAt(element5, [9, 1, 3]);
        var element20 = dom.childAt(element19, [1, 1, 1]);
        var element21 = dom.childAt(element19, [3, 1, 1]);
        var element22 = dom.childAt(element5, [11]);
        var element23 = dom.childAt(element22, [1]);
        var element24 = dom.childAt(element5, [13]);
        var element25 = dom.childAt(element24, [3, 1]);
        var element26 = dom.childAt(element24, [5]);
        var element27 = dom.childAt(element4, [5, 3]);
        var morphs = new Array(20);
        morphs[0] = dom.createElementMorph(element7);
        morphs[1] = dom.createElementMorph(element8);
        morphs[2] = dom.createElementMorph(element10);
        morphs[3] = dom.createElementMorph(element11);
        morphs[4] = dom.createElementMorph(element14);
        morphs[5] = dom.createElementMorph(element15);
        morphs[6] = dom.createMorphAt(dom.childAt(element16, [1]), 0, 0);
        morphs[7] = dom.createMorphAt(element17, 0, 0);
        morphs[8] = dom.createMorphAt(element18, 1, 1);
        morphs[9] = dom.createMorphAt(element18, 2, 2);
        morphs[10] = dom.createMorphAt(dom.childAt(element16, [5]), 0, 0);
        morphs[11] = dom.createElementMorph(element20);
        morphs[12] = dom.createElementMorph(element21);
        morphs[13] = dom.createMorphAt(element23, 1, 1);
        morphs[14] = dom.createMorphAt(element23, 2, 2);
        morphs[15] = dom.createMorphAt(element22, 5, 5);
        morphs[16] = dom.createElementMorph(element25);
        morphs[17] = dom.createElementMorph(element26);
        morphs[18] = dom.createElementMorph(element27);
        morphs[19] = dom.createMorphAt(fragment, 3, 3, contextualElement);
        return morphs;
      },
      statements: [["element", "action", ["step1_next", "bacterial_infection", "no_antibiotic"], [], ["loc", [null, [17, 142], [17, 203]]]], ["element", "action", ["step1_done", "no_antibiotic", "bacterial_infection"], [], ["loc", [null, [20, 138], [20, 199]]]], ["element", "action", ["step2_next"], ["on", "change"], ["loc", [null, [29, 97], [29, 132]]]], ["element", "action", ["step2_done"], ["on", "change"], ["loc", [null, [39, 97], [39, 132]]]], ["element", "action", ["step3_next"], ["on", "change"], ["loc", [null, [61, 97], [61, 132]]]], ["element", "action", ["step3_done"], ["on", "change"], ["loc", [null, [71, 97], [71, 132]]]], ["inline", "fa-icon", [], ["icon", "circle-o"], ["loc", [null, [81, 21], [81, 48]]]], ["block", "if", [["get", "exceedTempThreshold", ["loc", [null, [82, 27], [82, 46]]]]], [], 0, 1, ["loc", [null, [82, 21], [86, 29]]]], ["inline", "round", [["get", "fc.patient.temp.value", ["loc", [null, [87, 78], [87, 99]]]]], [], ["loc", [null, [87, 70], [87, 101]]]], ["content", "fc.patient.temp.unit", ["loc", [null, [87, 101], [87, 125]]]], ["inline", "fa-icon", [], ["icon", "circle-o"], ["loc", [null, [88, 21], [88, 48]]]], ["element", "action", ["step4", "liquid"], ["on", "change"], ["loc", [null, [98, 110], [98, 149]]]], ["element", "action", ["step4", "pill"], ["on", "change"], ["loc", [null, [104, 106], [104, 143]]]], ["block", "if", [["get", "fc.patient.hasPenicillinAllergy", ["loc", [null, [113, 22], [113, 53]]]]], [], 2, 3, ["loc", [null, [113, 16], [117, 23]]]], ["block", "if", [["get", "missingWeight", ["loc", [null, [118, 22], [118, 35]]]]], [], 4, 5, ["loc", [null, [118, 16], [136, 23]]]], ["block", "unless", [["get", "isOverride", ["loc", [null, [141, 24], [141, 34]]]]], [], 6, null, ["loc", [null, [141, 14], [145, 25]]]], ["element", "action", ["override"], [], ["loc", [null, [149, 116], [149, 137]]]], ["element", "action", ["forcemedication"], ["on", "change"], ["loc", [null, [150, 113], [150, 153]]]], ["element", "action", ["save"], [], ["loc", [null, [157, 77], [157, 94]]]], ["content", "yield", ["loc", [null, [163, 0], [163, 9]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6]
    };
  })());
});
define("antimicrobial-cds/templates/components/aom-non-penicillin", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/aom-non-penicillin.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "medicationOptionsRadios");
        dom.setAttribute(el3, "id", "medicationOptionsRadios4");
        dom.setAttribute(el3, "value", "option4");
        dom.setAttribute(el3, "checked", "");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Cefdinir");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" b.i.d. for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "medicationOptionsRadios");
        dom.setAttribute(el3, "id", "medicationOptionsRadios5");
        dom.setAttribute(el3, "value", "option5");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  Second Line Choice - ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Cefuroxime");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" b.i.d. for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "medicationOptionsRadios");
        dom.setAttribute(el3, "id", "medicationOptionsRadios6");
        dom.setAttribute(el3, "value", "option6");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  Second Line Choice - ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Cefpodoxime");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" b.i.d. for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "medicationOptionsRadios");
        dom.setAttribute(el3, "id", "medicationOptionsRadios7");
        dom.setAttribute(el3, "value", "option7");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  No Antibiotic\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        if (this.cachedFragment) {
          dom.repairClonedNode(dom.childAt(element0, [1]), [], true);
        }
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(fragment, [2, 1]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [3]);
        var element6 = dom.childAt(fragment, [4, 1]);
        var element7 = dom.childAt(element6, [1]);
        var element8 = dom.childAt(element6, [3]);
        var element9 = dom.childAt(fragment, [6, 1, 1]);
        var morphs = new Array(20);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createMorphAt(element2, 4, 4);
        morphs[4] = dom.createMorphAt(element2, 6, 6);
        morphs[5] = dom.createMorphAt(element2, 8, 8);
        morphs[6] = dom.createElementMorph(element4);
        morphs[7] = dom.createMorphAt(element5, 1, 1);
        morphs[8] = dom.createMorphAt(element5, 3, 3);
        morphs[9] = dom.createMorphAt(element5, 4, 4);
        morphs[10] = dom.createMorphAt(element5, 6, 6);
        morphs[11] = dom.createMorphAt(element5, 8, 8);
        morphs[12] = dom.createElementMorph(element7);
        morphs[13] = dom.createMorphAt(element8, 1, 1);
        morphs[14] = dom.createMorphAt(element8, 3, 3);
        morphs[15] = dom.createMorphAt(element8, 4, 4);
        morphs[16] = dom.createMorphAt(element8, 6, 6);
        morphs[17] = dom.createMorphAt(element8, 8, 8);
        morphs[18] = dom.createElementMorph(element9);
        morphs[19] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        return morphs;
      },
      statements: [["element", "action", ["step5", "cefdinir"], ["on", "change"], ["loc", [null, [3, 99], [3, 140]]]], ["content", "type", ["loc", [null, [4, 18], [4, 26]]]], ["content", "cefdinir_dose", ["loc", [null, [4, 28], [4, 45]]]], ["content", "unit", ["loc", [null, [4, 45], [4, 53]]]], ["content", "duration_value", ["loc", [null, [4, 65], [4, 83]]]], ["content", "duration_unit", ["loc", [null, [4, 84], [4, 101]]]], ["element", "action", ["step5", "cefuroxime"], ["on", "change"], ["loc", [null, [9, 99], [9, 142]]]], ["content", "type", ["loc", [null, [10, 41], [10, 49]]]], ["content", "cefuroxime_dose", ["loc", [null, [10, 51], [10, 70]]]], ["content", "unit", ["loc", [null, [10, 70], [10, 78]]]], ["content", "duration_value", ["loc", [null, [10, 90], [10, 108]]]], ["content", "duration_unit", ["loc", [null, [10, 109], [10, 126]]]], ["element", "action", ["step5", "cefpodoxime"], ["on", "change"], ["loc", [null, [15, 99], [15, 143]]]], ["content", "type", ["loc", [null, [16, 42], [16, 50]]]], ["content", "cefpodoxime_dose", ["loc", [null, [16, 52], [16, 72]]]], ["content", "unit", ["loc", [null, [16, 72], [16, 80]]]], ["content", "duration_value", ["loc", [null, [16, 92], [16, 110]]]], ["content", "duration_unit", ["loc", [null, [16, 111], [16, 128]]]], ["element", "action", ["step5"], ["on", "change"], ["loc", [null, [21, 99], [21, 129]]]], ["content", "yield", ["loc", [null, [26, 0], [26, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("antimicrobial-cds/templates/components/aom-penicillin", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/aom-penicillin.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "medicationOptionsRadios");
        dom.setAttribute(el3, "id", "medicationOptionsRadios1");
        dom.setAttribute(el3, "value", "option1");
        dom.setAttribute(el3, "checked", "");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Amoxicillin");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" b.i.d. for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "medicationOptionsRadios");
        dom.setAttribute(el3, "id", "medicationOptionsRadios2");
        dom.setAttribute(el3, "value", "option2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  Second Line Choice - Use if patient has taken amoxicillin in past 30 days or has conjunctivitis\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Amoxicillin-clavulanate");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(": ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" b.i.d. for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "medicationOptionsRadios");
        dom.setAttribute(el3, "id", "medicationOptionsRadios3");
        dom.setAttribute(el3, "value", "option3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  No Antibiotic\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        if (this.cachedFragment) {
          dom.repairClonedNode(dom.childAt(element0, [1]), [], true);
        }
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(fragment, [2, 1]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [3]);
        var element6 = dom.childAt(fragment, [4, 1, 1]);
        var morphs = new Array(14);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createMorphAt(element2, 4, 4);
        morphs[4] = dom.createMorphAt(element2, 6, 6);
        morphs[5] = dom.createMorphAt(element2, 8, 8);
        morphs[6] = dom.createElementMorph(element4);
        morphs[7] = dom.createMorphAt(element5, 1, 1);
        morphs[8] = dom.createMorphAt(element5, 3, 3);
        morphs[9] = dom.createMorphAt(element5, 4, 4);
        morphs[10] = dom.createMorphAt(element5, 6, 6);
        morphs[11] = dom.createMorphAt(element5, 8, 8);
        morphs[12] = dom.createElementMorph(element6);
        morphs[13] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        return morphs;
      },
      statements: [["element", "action", ["step5", "amoxicillin"], ["on", "change"], ["loc", [null, [3, 99], [3, 143]]]], ["content", "type", ["loc", [null, [4, 21], [4, 29]]]], ["content", "dose", ["loc", [null, [4, 31], [4, 39]]]], ["content", "unit", ["loc", [null, [4, 39], [4, 47]]]], ["content", "duration_value", ["loc", [null, [4, 59], [4, 77]]]], ["content", "duration_unit", ["loc", [null, [4, 78], [4, 95]]]], ["element", "action", ["step5", "amoxicillin-clavulanate"], ["on", "change"], ["loc", [null, [9, 99], [9, 155]]]], ["content", "type", ["loc", [null, [11, 33], [11, 41]]]], ["content", "dose", ["loc", [null, [11, 43], [11, 51]]]], ["content", "unit", ["loc", [null, [11, 51], [11, 59]]]], ["content", "duration_value", ["loc", [null, [11, 71], [11, 89]]]], ["content", "duration_unit", ["loc", [null, [11, 90], [11, 107]]]], ["element", "action", ["step5"], ["on", "change"], ["loc", [null, [16, 99], [16, 130]]]], ["content", "yield", ["loc", [null, [21, 0], [21, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("antimicrobial-cds/templates/components/launch-instructions", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 30,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/launch-instructions.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("To use the applciation, please do the following:");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ol");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Open ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "https://sandbox.hspconsortium.org/dstu2/demo");
        var el4 = dom.createTextNode("HSPC DSTU2 Sandbox: https://sandbox.hspconsortium.org/dstu2/demo");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Select sign in the upper right as shown in this image below:\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3, "class", "img-responsive img-rounded");
        dom.setAttribute(el3, "src", "images/start.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Use username of \"demo\" and password of \"demo\" – or setup your own account.\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3, "class", "img-responsive img-rounded");
        dom.setAttribute(el3, "src", "images/login.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Select desired pediatric patient (under age 19):\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3, "class", "img-responsive img-rounded");
        dom.setAttribute(el3, "src", "images/patient_selection.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("In \"Custom App\" region on the right, select the App_ID field and type \"bmi6300_antimicrobial\"\n     and in the Launch URL field, type \"http://cds-magiclantern.rhcloud.com/launch.html\" Then click\n      \"Custom App\" to launch the application.\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3, "class", "img-responsive img-rounded");
        dom.setAttribute(el3, "src", "images/application_launch.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("You will then be redirected to the OpenID application authorization page to allow a\n    single sign on token to be created. In the \"Remember this decision:\" section, select the desired time\n    such as \"remember this decision for one hour\" and click \"Authorize\".\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.setAttribute(el3, "class", "img-responsive img-rounded");
        dom.setAttribute(el3, "src", "images/openID_approval.png");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("If you want to revoke the single sign on token visit this page:\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "https://sandbox.hspconsortium.org/dstu2/hsp-reference-authorization/manage/user/approved");
        var el4 = dom.createTextNode("\n      Manage Approved Sites: https://sandbox.hspconsortium.org/dstu2/hsp-reference-authorization/manage/user/approved");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [29, 0], [29, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("antimicrobial-cds/templates/components/medication-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/medication-list.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [0]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(element0, 0, 0);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["row ", ["get", "highlight_color", ["loc", [null, [2, 18], [2, 33]]]]]]], ["content", "display", ["loc", [null, [2, 37], [2, 48]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/medication-list.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 1, 1, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "if", [["get", "shouldShow", ["loc", [null, [1, 6], [1, 16]]]]], [], 0, null, ["loc", [null, [1, 0], [3, 7]]]], ["content", "yield", ["loc", [null, [4, 0], [4, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("antimicrobial-cds/templates/components/strep-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 113,
              "column": 16
            },
            "end": {
              "line": 115,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/strep-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createTextNode("Select antibiotic ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("small");
          var el3 = dom.createElement("input");
          dom.setAttribute(el3, "id", "strep_forceallergy");
          dom.setAttribute(el3, "type", "checkbox");
          dom.setAttribute(el3, "checked", "");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" Penicillin Allergy");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          if (this.cachedFragment) {
            dom.repairClonedNode(dom.childAt(fragment, [1, 1, 0]), [], true);
          }
          var element3 = dom.childAt(fragment, [1, 1, 0]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element3);
          return morphs;
        },
        statements: [["element", "action", ["forceallergy"], ["on", "change"], ["loc", [null, [114, 94], [114, 131]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 115,
              "column": 16
            },
            "end": {
              "line": 117,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/strep-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createTextNode("Select antibiotic ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("small");
          var el3 = dom.createElement("input");
          dom.setAttribute(el3, "id", "strep_forceallergy");
          dom.setAttribute(el3, "type", "checkbox");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" Penicillin Allergy");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1, 1, 0]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element2);
          return morphs;
        },
        statements: [["element", "action", ["forceallergy"], ["on", "change"], ["loc", [null, [116, 94], [116, 131]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 118,
              "column": 16
            },
            "end": {
              "line": 130,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/strep-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("form");
          dom.setAttribute(el1, "class", "form-horizontal");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "form-group zeroborder");
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("label");
          dom.setAttribute(el3, "for", "condition_datetime");
          dom.setAttribute(el3, "class", "col-sm-2 control-label");
          var el4 = dom.createTextNode("Weight");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-sm-4");
          var el4 = dom.createTextNode("\n                        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("input");
          dom.setAttribute(el4, "id", "strep_weight");
          dom.setAttribute(el4, "class", "form-control");
          dom.setAttribute(el4, "placeholder", "Patient Weight in kg");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3, "class", "col-sm-5");
          var el4 = dom.createTextNode("\n                        ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("i");
          dom.setAttribute(el4, "class", "text-warning");
          var el5 = dom.createTextNode("Weight required for dose calculation");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n                      ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 1, 3, 1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["element", "action", ["saveweight"], ["on", "change"], ["loc", [null, [123, 105], [123, 140]]]]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 130,
              "column": 16
            },
            "end": {
              "line": 136,
              "column": 16
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/strep-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Medication based on patient ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2, "class", "note");
          var el3 = dom.createTextNode("current weight ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(",\n                    age ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" old");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(", and known allergies.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n                  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "radio_group");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n                  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(5);
          morphs[0] = dom.createMorphAt(element0, 1, 1);
          morphs[1] = dom.createMorphAt(element0, 2, 2);
          morphs[2] = dom.createMorphAt(element0, 4, 4);
          morphs[3] = dom.createMorphAt(element0, 6, 6);
          morphs[4] = dom.createMorphAt(dom.childAt(fragment, [3]), 1, 1);
          return morphs;
        },
        statements: [["inline", "round", [["get", "fc.patient.weight.value", ["loc", [null, [131, 91], [131, 114]]]]], [], ["loc", [null, [131, 83], [131, 116]]]], ["content", "fc.patient.weight.unit", ["loc", [null, [131, 116], [131, 142]]]], ["content", "fc.patient.age_value", ["loc", [null, [132, 24], [132, 48]]]], ["content", "fc.patient.age_unit", ["loc", [null, [132, 49], [132, 72]]]], ["inline", "component", [["get", "medicationselection", ["loc", [null, [134, 32], [134, 51]]]]], ["form", ["subexpr", "@mut", [["get", "med_form", ["loc", [null, [134, 57], [134, 65]]]]], [], []], "medication_callback", ["subexpr", "action", ["step5"], [], ["loc", [null, [134, 86], [134, 102]]]]], ["loc", [null, [134, 20], [134, 104]]]]],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 138,
              "column": 14
            },
            "end": {
              "line": 142,
              "column": 14
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/strep-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "row");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createTextNode("Diagnostic Criteria for Streptococcal Pharyngitis requiring antibiotics met");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 161,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/strep-modal.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "StrepModal");
        dom.setAttribute(el1, "class", "modal fade");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "modal-dialog");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "modal-content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "modal-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "class", "close");
        dom.setAttribute(el5, "data-dismiss", "modal");
        dom.setAttribute(el5, "aria-label", "Close");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "aria-hidden", "true");
        var el7 = dom.createTextNode("×");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5, "class", "modal-title");
        var el6 = dom.createTextNode("Bacterial disease diagnosis and medication guide");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("Based on Intermountain Healthcare's ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "href", "https://intermountainhealthcare.org/ext/Dcmnt?ncid=525953897");
        var el7 = dom.createTextNode("Streptococcal Pharyngitis Care Process Model");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" updated January 2014");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "modal-body");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "container");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "modal-fixes");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row");
        dom.setAttribute(el7, "id", "strep_step1");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-sm-6");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("h4");
        var el12 = dom.createTextNode("\n                      ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("input");
        dom.setAttribute(el12, "type", "radio");
        dom.setAttribute(el12, "name", "strepmeets");
        dom.setAttribute(el12, "id", "strepMeetsRadios1");
        dom.setAttribute(el12, "value", "option1");
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                      Matches Streptococcal pharyngitis\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("ul");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Sudden onset of sore throat");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Age 5–15 years (most common)");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Fever");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Headache");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Nausea, vomiting, abdominal pain");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Tonsillopharyngeal inflammation");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Patchy tonsillopharyngeal exudates");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Palatal petechiae");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Tender nodes");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Winter and early spring presentation");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("History of exposure to strep pharyngitis");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Scarlatiniform rash");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Edematous uvula");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "col-sm-6");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                    ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("h4");
        var el12 = dom.createTextNode("\n                      ");
        dom.appendChild(el11, el12);
        var el12 = dom.createElement("input");
        dom.setAttribute(el12, "type", "radio");
        dom.setAttribute(el12, "name", "strepmeets");
        dom.setAttribute(el12, "id", "strepMeetsRadios2");
        dom.setAttribute(el12, "value", "option2");
        dom.appendChild(el11, el12);
        var el12 = dom.createTextNode("\n                      Matches Viral pharyngitis\n                    ");
        dom.appendChild(el11, el12);
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("ul");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Conjunctivitis");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Coryza");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Cough");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Diarrhea");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Hoarseness");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Discrete ulcerative stomatitis");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("li");
        var el11 = dom.createTextNode("Viral exanthema");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row hidden");
        dom.setAttribute(el7, "id", "strep_step2");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h4");
        var el9 = dom.createTextNode("Rapid antigen detection test (RADT) result");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("No RADT result on file - perform test in office to proceed.");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "radio_group");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                      ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("input");
        dom.setAttribute(el11, "type", "radio");
        dom.setAttribute(el11, "name", "radt");
        dom.setAttribute(el11, "id", "radt1");
        dom.setAttribute(el11, "value", "positive");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                      Positive\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                      ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("input");
        dom.setAttribute(el11, "type", "radio");
        dom.setAttribute(el11, "name", "radt");
        dom.setAttribute(el11, "id", "radt2");
        dom.setAttribute(el11, "value", "negative");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                      Negative\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "class", "row hidden");
        dom.setAttribute(el7, "id", "strep_step3");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h4");
        var el9 = dom.createTextNode("Throat Culture result");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("No Throat Culture result on file - perform test to proceed.");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "radio_group");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                      ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("input");
        dom.setAttribute(el11, "type", "radio");
        dom.setAttribute(el11, "name", "culture");
        dom.setAttribute(el11, "id", "culture1");
        dom.setAttribute(el11, "value", "positive");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                      Positive\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                      ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("input");
        dom.setAttribute(el11, "type", "radio");
        dom.setAttribute(el11, "name", "culture");
        dom.setAttribute(el11, "id", "culture2");
        dom.setAttribute(el11, "value", "negative");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                      Negative\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "strep_step4");
        dom.setAttribute(el7, "class", "row hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h4");
        var el9 = dom.createTextNode("Select patient medication preference");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "radio_group");
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("input");
        dom.setAttribute(el11, "type", "radio");
        dom.setAttribute(el11, "name", "medication_form");
        dom.setAttribute(el11, "id", "medication_form_liquid");
        dom.setAttribute(el11, "value", "liquid");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  Liquid\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n                ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("div");
        dom.setAttribute(el9, "class", "radio");
        var el10 = dom.createTextNode("\n                  ");
        dom.appendChild(el9, el10);
        var el10 = dom.createElement("label");
        var el11 = dom.createTextNode("\n                  ");
        dom.appendChild(el10, el11);
        var el11 = dom.createElement("input");
        dom.setAttribute(el11, "type", "radio");
        dom.setAttribute(el11, "name", "medication_form");
        dom.setAttribute(el11, "id", "medication_form_pill");
        dom.setAttribute(el11, "value", "pill");
        dom.appendChild(el10, el11);
        var el11 = dom.createTextNode("\n                  Pill/Tablet\n                  ");
        dom.appendChild(el10, el11);
        dom.appendChild(el9, el10);
        var el10 = dom.createTextNode("\n                ");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("\n              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "strep_step5");
        dom.setAttribute(el7, "class", "hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("div");
        dom.setAttribute(el8, "class", "row");
        var el9 = dom.createTextNode("\n");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createComment("");
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode("              ");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n");
        dom.appendChild(el7, el8);
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("div");
        dom.setAttribute(el7, "id", "strep_criteria_not_met");
        dom.setAttribute(el7, "class", "row hidden");
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("h4");
        var el9 = dom.createTextNode("Diagnostic Criteria for Streptococcal Pharyngitis requiring antibiotics ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("span");
        dom.setAttribute(el9, "class", "note");
        var el10 = dom.createTextNode("not");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        var el9 = dom.createTextNode(" met.");
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("p");
        var el9 = dom.createTextNode("Recommend close follow-up but no antibiotics. ");
        dom.appendChild(el8, el9);
        var el9 = dom.createElement("button");
        dom.setAttribute(el9, "type", "button");
        dom.setAttribute(el9, "class", "btn btn-sm btn-warning");
        var el10 = dom.createTextNode("Override");
        dom.appendChild(el9, el10);
        dom.appendChild(el8, el9);
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n              ");
        dom.appendChild(el7, el8);
        var el8 = dom.createElement("input");
        dom.setAttribute(el8, "id", "strep_override");
        dom.setAttribute(el8, "type", "text");
        dom.setAttribute(el8, "class", "form-control hidden");
        dom.setAttribute(el8, "placeholder", "Reason for override");
        dom.appendChild(el7, el8);
        var el8 = dom.createTextNode("\n            ");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "modal-footer");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "id", "strep_cancel");
        dom.setAttribute(el5, "class", "btn btn-danger pull-left");
        dom.setAttribute(el5, "data-dismiss", "modal");
        var el6 = dom.createTextNode("Cancel");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5, "type", "button");
        dom.setAttribute(el5, "id", "strep_review");
        dom.setAttribute(el5, "class", "btn btn-primary hidden");
        var el6 = dom.createTextNode("Review");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" /.modal-content ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /.modal-dialog ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" /.modal ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0, 1, 1]);
        var element5 = dom.childAt(element4, [3, 1, 1]);
        var element6 = dom.childAt(element5, [1]);
        var element7 = dom.childAt(element6, [1, 1, 1, 1, 1]);
        var element8 = dom.childAt(element6, [3, 1, 1, 1, 1]);
        var element9 = dom.childAt(element5, [3, 5]);
        var element10 = dom.childAt(element9, [1, 1, 1]);
        var element11 = dom.childAt(element9, [3, 1, 1]);
        var element12 = dom.childAt(element5, [5, 5]);
        var element13 = dom.childAt(element12, [1, 1, 1]);
        var element14 = dom.childAt(element12, [3, 1, 1]);
        var element15 = dom.childAt(element5, [7, 3]);
        var element16 = dom.childAt(element15, [1, 1, 1]);
        var element17 = dom.childAt(element15, [3, 1, 1]);
        var element18 = dom.childAt(element5, [9]);
        var element19 = dom.childAt(element18, [1]);
        var element20 = dom.childAt(element5, [11]);
        var element21 = dom.childAt(element20, [3, 1]);
        var element22 = dom.childAt(element20, [5]);
        var element23 = dom.childAt(element4, [5, 3]);
        var morphs = new Array(15);
        morphs[0] = dom.createElementMorph(element7);
        morphs[1] = dom.createElementMorph(element8);
        morphs[2] = dom.createElementMorph(element10);
        morphs[3] = dom.createElementMorph(element11);
        morphs[4] = dom.createElementMorph(element13);
        morphs[5] = dom.createElementMorph(element14);
        morphs[6] = dom.createElementMorph(element16);
        morphs[7] = dom.createElementMorph(element17);
        morphs[8] = dom.createMorphAt(element19, 1, 1);
        morphs[9] = dom.createMorphAt(element19, 2, 2);
        morphs[10] = dom.createMorphAt(element18, 3, 3);
        morphs[11] = dom.createElementMorph(element21);
        morphs[12] = dom.createElementMorph(element22);
        morphs[13] = dom.createElementMorph(element23);
        morphs[14] = dom.createMorphAt(fragment, 3, 3, contextualElement);
        return morphs;
      },
      statements: [["element", "action", ["step1_next"], ["on", "change"], ["loc", [null, [17, 99], [17, 134]]]], ["element", "action", ["step1_done"], ["on", "change"], ["loc", [null, [42, 99], [42, 134]]]], ["element", "action", ["step2_next"], ["on", "change"], ["loc", [null, [64, 82], [64, 117]]]], ["element", "action", ["step2_done"], ["on", "change"], ["loc", [null, [70, 82], [70, 117]]]], ["element", "action", ["step3_next"], ["on", "change"], ["loc", [null, [82, 88], [82, 123]]]], ["element", "action", ["step3_done"], ["on", "change"], ["loc", [null, [88, 88], [88, 123]]]], ["element", "action", ["step4", "liquid"], ["on", "change"], ["loc", [null, [99, 104], [99, 143]]]], ["element", "action", ["step4", "pill"], ["on", "change"], ["loc", [null, [105, 100], [105, 137]]]], ["block", "if", [["get", "fc.patient.hasPenicillinAllergy", ["loc", [null, [113, 22], [113, 53]]]]], [], 0, 1, ["loc", [null, [113, 16], [117, 23]]]], ["block", "if", [["get", "missingWeight", ["loc", [null, [118, 22], [118, 35]]]]], [], 2, 3, ["loc", [null, [118, 16], [136, 23]]]], ["block", "unless", [["get", "isOverride", ["loc", [null, [138, 24], [138, 34]]]]], [], 4, null, ["loc", [null, [138, 14], [142, 25]]]], ["element", "action", ["override"], [], ["loc", [null, [146, 116], [146, 137]]]], ["element", "action", ["forcemedication"], ["on", "change"], ["loc", [null, [147, 115], [147, 155]]]], ["element", "action", ["save"], [], ["loc", [null, [154, 79], [154, 96]]]], ["content", "yield", ["loc", [null, [160, 0], [160, 9]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  })());
});
define("antimicrobial-cds/templates/components/strep-non-penicillin", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 27,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/strep-non-penicillin.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
        dom.setAttribute(el3, "id", "strep_medicationOptionsRadios1");
        dom.setAttribute(el3, "value", "option1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Cephalexin: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
        dom.setAttribute(el3, "id", "strep_medicationOptionsRadios2");
        dom.setAttribute(el3, "value", "option2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Azithromycin: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
        dom.setAttribute(el3, "id", "strep_medicationOptionsRadios3");
        dom.setAttribute(el3, "value", "option3");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("strong");
        var el4 = dom.createTextNode("Clindamycin: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" for ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
        dom.setAttribute(el3, "id", "strep_medicationOptionsRadios4");
        dom.setAttribute(el3, "value", "option4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  No Antibiotic\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var element3 = dom.childAt(fragment, [2, 1]);
        var element4 = dom.childAt(element3, [1]);
        var element5 = dom.childAt(element3, [3]);
        var element6 = dom.childAt(fragment, [4, 1]);
        var element7 = dom.childAt(element6, [1]);
        var element8 = dom.childAt(element6, [3]);
        var element9 = dom.childAt(fragment, [6, 1, 1]);
        var morphs = new Array(20);
        morphs[0] = dom.createElementMorph(element1);
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(element2, 2, 2);
        morphs[3] = dom.createMorphAt(element2, 4, 4);
        morphs[4] = dom.createMorphAt(element2, 6, 6);
        morphs[5] = dom.createMorphAt(element2, 8, 8);
        morphs[6] = dom.createElementMorph(element4);
        morphs[7] = dom.createMorphAt(element5, 1, 1);
        morphs[8] = dom.createMorphAt(element5, 2, 2);
        morphs[9] = dom.createMorphAt(element5, 4, 4);
        morphs[10] = dom.createMorphAt(element5, 6, 6);
        morphs[11] = dom.createMorphAt(element5, 8, 8);
        morphs[12] = dom.createElementMorph(element7);
        morphs[13] = dom.createMorphAt(element8, 1, 1);
        morphs[14] = dom.createMorphAt(element8, 2, 2);
        morphs[15] = dom.createMorphAt(element8, 4, 4);
        morphs[16] = dom.createMorphAt(element8, 6, 6);
        morphs[17] = dom.createMorphAt(element8, 8, 8);
        morphs[18] = dom.createElementMorph(element9);
        morphs[19] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        return morphs;
      },
      statements: [["element", "action", ["step5", "cephalexin"], ["on", "change"], ["loc", [null, [3, 111], [3, 154]]]], ["content", "cephalexin_dose", ["loc", [null, [4, 22], [4, 41]]]], ["content", "unit", ["loc", [null, [4, 41], [4, 49]]]], ["content", "cephalexin_frequency", ["loc", [null, [4, 50], [4, 74]]]], ["content", "cephalexin_duration_value", ["loc", [null, [4, 79], [4, 108]]]], ["content", "duration_unit", ["loc", [null, [4, 109], [4, 126]]]], ["element", "action", ["step5", "azithromycin"], ["on", "change"], ["loc", [null, [9, 111], [9, 156]]]], ["content", "azithromycin_dose", ["loc", [null, [10, 24], [10, 45]]]], ["content", "unit", ["loc", [null, [10, 45], [10, 53]]]], ["content", "azithromycin_frequency", ["loc", [null, [10, 54], [10, 80]]]], ["content", "azithromycin_duration_value", ["loc", [null, [10, 85], [10, 116]]]], ["content", "duration_unit", ["loc", [null, [10, 117], [10, 134]]]], ["element", "action", ["step5", "clindamycin"], ["on", "change"], ["loc", [null, [15, 111], [15, 155]]]], ["content", "clindamycin_dose", ["loc", [null, [16, 23], [16, 43]]]], ["content", "unit", ["loc", [null, [16, 43], [16, 51]]]], ["content", "clindamycin_frequency", ["loc", [null, [16, 52], [16, 77]]]], ["content", "clindamycin_duration_value", ["loc", [null, [16, 82], [16, 112]]]], ["content", "duration_unit", ["loc", [null, [16, 113], [16, 130]]]], ["element", "action", ["step5"], ["on", "change"], ["loc", [null, [21, 111], [21, 141]]]], ["content", "yield", ["loc", [null, [26, 0], [26, 9]]]]],
      locals: [],
      templates: []
    };
  })());
});
define("antimicrobial-cds/templates/components/strep-penicillin", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 8,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/strep-penicillin.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "radio");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("input");
          dom.setAttribute(el3, "type", "radio");
          dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
          dom.setAttribute(el3, "id", "strep_medicationOptionsRadios3");
          dom.setAttribute(el3, "value", "option3");
          dom.setAttribute(el3, "checked", "");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("strong");
          var el4 = dom.createTextNode("Amoxicillin suspension: ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" once daily for 10 days");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element6 = dom.childAt(fragment, [1, 1]);
          if (this.cachedFragment) {
            dom.repairClonedNode(dom.childAt(element6, [1]), [], true);
          }
          var element7 = dom.childAt(element6, [1]);
          var element8 = dom.childAt(element6, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createElementMorph(element7);
          morphs[1] = dom.createMorphAt(element8, 1, 1);
          morphs[2] = dom.createMorphAt(element8, 2, 2);
          return morphs;
        },
        statements: [["element", "action", ["step5", "Amoxicillin suspension"], ["on", "change"], ["loc", [null, [4, 113], [4, 168]]]], ["content", "suspension_dose", ["loc", [null, [5, 36], [5, 55]]]], ["content", "suspension_unit", ["loc", [null, [5, 55], [5, 74]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 0
            },
            "end": {
              "line": 21,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/components/strep-penicillin.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "radio");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("input");
          dom.setAttribute(el3, "type", "radio");
          dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
          dom.setAttribute(el3, "id", "strep_medicationOptionsRadios1");
          dom.setAttribute(el3, "value", "option1");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("strong");
          var el4 = dom.createTextNode("Penicillin VK: ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" b.i.d for ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "radio");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("input");
          dom.setAttribute(el3, "type", "radio");
          dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
          dom.setAttribute(el3, "id", "strep_medicationOptionsRadios2");
          dom.setAttribute(el3, "value", "option2");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("strong");
          var el4 = dom.createTextNode("Benzathine penicillin: ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element0, [3]);
          var element3 = dom.childAt(fragment, [3, 1]);
          var element4 = dom.childAt(element3, [1]);
          var element5 = dom.childAt(element3, [3]);
          var morphs = new Array(9);
          morphs[0] = dom.createElementMorph(element1);
          morphs[1] = dom.createMorphAt(element2, 1, 1);
          morphs[2] = dom.createMorphAt(element2, 2, 2);
          morphs[3] = dom.createMorphAt(element2, 4, 4);
          morphs[4] = dom.createElementMorph(element4);
          morphs[5] = dom.createMorphAt(element5, 1, 1);
          morphs[6] = dom.createMorphAt(element5, 2, 2);
          morphs[7] = dom.createMorphAt(element5, 4, 4);
          morphs[8] = dom.createMorphAt(element5, 6, 6);
          return morphs;
        },
        statements: [["element", "action", ["step5", "Penicillin VK"], ["on", "change"], ["loc", [null, [11, 113], [11, 159]]]], ["content", "penicillin_dose", ["loc", [null, [12, 27], [12, 46]]]], ["content", "penicillin_unit", ["loc", [null, [12, 46], [12, 65]]]], ["content", "penicillin_duration", ["loc", [null, [12, 76], [12, 99]]]], ["element", "action", ["step5", "Benzathine penicillin"], ["on", "change"], ["loc", [null, [17, 113], [17, 167]]]], ["content", "benzathine_dose", ["loc", [null, [18, 35], [18, 54]]]], ["content", "benzathine_unit", ["loc", [null, [18, 54], [18, 73]]]], ["content", "benzathine_duration_value", ["loc", [null, [18, 74], [18, 103]]]], ["content", "benzathine_duration_unit", ["loc", [null, [18, 104], [18, 132]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 31,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/components/strep-penicillin.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "radio");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("input");
        dom.setAttribute(el3, "type", "radio");
        dom.setAttribute(el3, "name", "strep_medicationOptionsRadios");
        dom.setAttribute(el3, "id", "strep_medicationOptionsRadios4");
        dom.setAttribute(el3, "value", "option4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  No Antibiotic\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element9 = dom.childAt(fragment, [1, 1, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createElementMorph(element9);
        morphs[2] = dom.createMorphAt(fragment, 3, 3, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "if", [["get", "needsLiquid", ["loc", [null, [1, 6], [1, 17]]]]], [], 0, 1, ["loc", [null, [1, 0], [21, 7]]]], ["element", "action", ["step5"], ["on", "change"], ["loc", [null, [24, 111], [24, 141]]]], ["content", "yield", ["loc", [null, [30, 0], [30, 9]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("antimicrobial-cds/templates/conditions", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 34,
              "column": 2
            },
            "end": {
              "line": 41,
              "column": 2
            }
          },
          "moduleName": "antimicrobial-cds/templates/conditions.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "form-group");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2, "class", "col-sm-offset-2 col-sm-5");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("strong");
          var el4 = dom.createTextNode("CDS Assigned Medication");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(", ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(", ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode(" ");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1, 3]);
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(element0, 0, 0);
          morphs[1] = dom.createMorphAt(element0, 2, 2);
          morphs[2] = dom.createMorphAt(element0, 4, 4);
          morphs[3] = dom.createMorphAt(element0, 6, 6);
          return morphs;
        },
        statements: [["content", "medication.display", ["loc", [null, [38, 9], [38, 31]]]], ["content", "medication.dosageInstruction", ["loc", [null, [38, 33], [38, 65]]]], ["content", "medication.duration_value", ["loc", [null, [38, 67], [38, 96]]]], ["content", "medication.duration_unit", ["loc", [null, [38, 97], [38, 125]]]]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 56,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/conditions.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        dom.setAttribute(el1, "id", "condition_form");
        dom.setAttribute(el1, "class", "form-horizontal");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "condition_datetime");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Date");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-5");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("input");
        dom.setAttribute(el4, "id", "condition_date");
        dom.setAttribute(el4, "type", "datetime");
        dom.setAttribute(el4, "class", "form-control");
        dom.setAttribute(el4, "placeholder", "Now");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "condition_diagnosis");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Primary Diagnosis");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-5");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("select");
        dom.setAttribute(el4, "class", "form-control");
        dom.setAttribute(el4, "id", "condition_diagnosis");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("option");
        dom.setAttribute(el5, "value", "");
        var el6 = dom.createTextNode(" - Select Diagnosis - ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("option");
        dom.setAttribute(el5, "value", "3110003");
        var el6 = dom.createTextNode("Acute Otitis Media");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("option");
        dom.setAttribute(el5, "value", "65363002");
        var el6 = dom.createTextNode("Otitis Media");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("option");
        dom.setAttribute(el5, "value", "43878008");
        var el6 = dom.createTextNode("Streptococcal Pharyngitis");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("option");
        dom.setAttribute(el5, "value", "1532007");
        var el6 = dom.createTextNode("Viral pharyngitis");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "for", "condition_notes");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Clinical Notes");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-10");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("textarea");
        dom.setAttribute(el4, "id", "condition_notes");
        dom.setAttribute(el4, "class", "form-control");
        dom.setAttribute(el4, "rows", "3");
        dom.setAttribute(el4, "placeholder", "Enter Notes here.");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-offset-2 col-sm-2");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "reset");
        dom.setAttribute(el4, "class", "btn btn-danger");
        var el5 = dom.createTextNode("Reset Form");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-3 pull-right");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "submit");
        dom.setAttribute(el4, "class", "btn btn-success");
        var el5 = dom.createTextNode("Sign & Submit");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [4]);
        var element2 = dom.childAt(element1, [3, 3, 1]);
        var element3 = dom.childAt(element1, [9]);
        var element4 = dom.childAt(element3, [1, 1]);
        var element5 = dom.childAt(element3, [3, 1]);
        var morphs = new Array(7);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createElementMorph(element2);
        morphs[3] = dom.createMorphAt(element1, 7, 7);
        morphs[4] = dom.createElementMorph(element4);
        morphs[5] = dom.createElementMorph(element5);
        morphs[6] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["inline", "aom-modal", [], ["medication_callback", ["subexpr", "action", ["medication_callback"], [], ["loc", [null, [1, 32], [1, 62]]]]], ["loc", [null, [1, 0], [1, 64]]]], ["inline", "strep-modal", [], ["medication_callback", ["subexpr", "action", ["medication_callback"], [], ["loc", [null, [3, 34], [3, 64]]]]], ["loc", [null, [3, 0], [3, 66]]]], ["element", "action", ["fire_cds"], ["on", "change"], ["loc", [null, [17, 60], [17, 93]]]], ["block", "if", [["get", "medication.display", ["loc", [null, [34, 8], [34, 26]]]]], [], 0, null, ["loc", [null, [34, 2], [41, 9]]]], ["element", "action", ["clearall"], [], ["loc", [null, [45, 52], [45, 73]]]], ["element", "action", ["save"], [], ["loc", [null, [48, 54], [48, 71]]]], ["content", "outlet", ["loc", [null, [55, 0], [55, 10]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("antimicrobial-cds/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": {
            "name": "triple-curlies"
          },
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-danger");
          dom.setAttribute(el1, "role", "alert");
          var el2 = dom.createTextNode("\n    Authentication or Loading patient data failed. Click ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "type", "button");
          dom.setAttribute(el2, "class", "btn btn-sm btn-warning");
          var el3 = dom.createTextNode("Override");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" to use fake patient data.\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["element", "action", ["override"], [], ["loc", [null, [3, 110], [3, 131]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 12,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-danger");
          dom.setAttribute(el1, "role", "alert");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2, "class", "bg-danger");
          var el3 = dom.createTextNode("Patient Context not loaded or not Authenticated, app will not function.");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          return morphs;
        },
        statements: [["content", "launch-instructions", ["loc", [null, [11, 2], [11, 25]]]]],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 14,
                "column": 2
              },
              "end": {
                "line": 16,
                "column": 2
              }
            },
            "moduleName": "antimicrobial-cds/templates/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "alert alert-info");
            dom.setAttribute(el1, "role", "alert");
            var el2 = dom.createTextNode("Loading Application... Waiting up to 5 seconds.");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        var child0 = (function () {
          var child0 = (function () {
            return {
              meta: {
                "fragmentReason": false,
                "revision": "Ember@2.2.0",
                "loc": {
                  "source": null,
                  "start": {
                    "line": 19,
                    "column": 6
                  },
                  "end": {
                    "line": 23,
                    "column": 6
                  }
                },
                "moduleName": "antimicrobial-cds/templates/index.hbs"
              },
              isEmpty: false,
              arity: 0,
              cachedFragment: null,
              hasRendered: false,
              buildFragment: function buildFragment(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("div");
                dom.setAttribute(el1, "class", "alert alert-warning");
                dom.setAttribute(el1, "role", "alert");
                var el2 = dom.createTextNode("\n          Patient is not a pediatric patient or has a missing/invalid birthdate.\n        ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              buildRenderNodes: function buildRenderNodes() {
                return [];
              },
              statements: [],
              locals: [],
              templates: []
            };
          })();
          return {
            meta: {
              "fragmentReason": false,
              "revision": "Ember@2.2.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 17,
                  "column": 4
                },
                "end": {
                  "line": 24,
                  "column": 4
                }
              },
              "moduleName": "antimicrobial-cds/templates/index.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("h4");
              var el2 = dom.createTextNode("Patient Context has loaded.");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment, 3, 3, contextualElement);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [["block", "unless", [["get", "fc.isPediatric", ["loc", [null, [19, 16], [19, 30]]]]], [], 0, null, ["loc", [null, [19, 6], [23, 17]]]]],
            locals: [],
            templates: [child0]
          };
        })();
        return {
          meta: {
            "fragmentReason": false,
            "revision": "Ember@2.2.0",
            "loc": {
              "source": null,
              "start": {
                "line": 16,
                "column": 2
              },
              "end": {
                "line": 25,
                "column": 2
              }
            },
            "moduleName": "antimicrobial-cds/templates/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["block", "unless", [["get", "fc.fhirFailed", ["loc", [null, [17, 14], [17, 27]]]]], [], 0, null, ["loc", [null, [17, 4], [24, 15]]]]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 0
            },
            "end": {
              "line": 32,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h4");
          var el2 = dom.createTextNode("Authentication has succeeded.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1, "id", "instructions-button");
          dom.setAttribute(el1, "class", "btn btn-default");
          var el2 = dom.createTextNode("View HSPC Instructions");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "hidden");
          dom.setAttribute(el1, "id", "instructions");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [9]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(fragment, 3, 3, contextualElement);
          morphs[1] = dom.createElementMorph(element0);
          morphs[2] = dom.createMorphAt(dom.childAt(fragment, [11]), 1, 1);
          return morphs;
        },
        statements: [["block", "if", [["get", "fc.isLoading", ["loc", [null, [14, 8], [14, 20]]]]], [], 0, 1, ["loc", [null, [14, 2], [25, 9]]]], ["element", "action", ["showinstructions"], [], ["loc", [null, [28, 59], [28, 88]]]], ["content", "launch-instructions", ["loc", [null, [30, 4], [30, 27]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["wrong-type", "multiple-nodes"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 34,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[2] = dom.createMorphAt(fragment, 3, 3, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["block", "if", [["get", "fc.fhirFailed", ["loc", [null, [1, 6], [1, 19]]]]], [], 0, null, ["loc", [null, [1, 0], [5, 7]]]], ["block", "unless", [["get", "fc.isAuthenticated", ["loc", [null, [7, 10], [7, 28]]]]], [], 1, 2, ["loc", [null, [7, 0], [32, 11]]]], ["content", "outlet", ["loc", [null, [33, 0], [33, 10]]]]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("antimicrobial-cds/templates/medicationorders", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 12,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/medicationorders.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("h4");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("dl");
          dom.setAttribute(el1, "class", "dl-horizontal");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("dt");
          var el3 = dom.createTextNode("Supply Duration");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("dd");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("dt");
          var el3 = dom.createTextNode("Refills");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("dd");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("dt");
          var el3 = dom.createTextNode("Prescribed");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("dd");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [0]);
          var element1 = dom.childAt(fragment, [2]);
          var element2 = dom.childAt(element1, [3]);
          var morphs = new Array(6);
          morphs[0] = dom.createMorphAt(element0, 0, 0);
          morphs[1] = dom.createMorphAt(element0, 2, 2);
          morphs[2] = dom.createMorphAt(element2, 0, 0);
          morphs[3] = dom.createMorphAt(element2, 2, 2);
          morphs[4] = dom.createMorphAt(dom.childAt(element1, [7]), 0, 0);
          morphs[5] = dom.createMorphAt(dom.childAt(element1, [11]), 0, 0);
          return morphs;
        },
        statements: [["content", "med.display", ["loc", [null, [3, 4], [3, 19]]]], ["content", "med.dosageInstruction", ["loc", [null, [3, 20], [3, 45]]]], ["content", "med.duration_value", ["loc", [null, [6, 6], [6, 28]]]], ["content", "med.duration_unit", ["loc", [null, [6, 29], [6, 50]]]], ["content", "med.refills", ["loc", [null, [8, 6], [8, 21]]]], ["content", "med.date", ["loc", [null, [10, 6], [10, 18]]]]],
        locals: ["med"],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 0
            },
            "end": {
              "line": 14,
              "column": 0
            }
          },
          "moduleName": "antimicrobial-cds/templates/medicationorders.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("No Medication History");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/medicationorders.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h3");
        var el2 = dom.createTextNode("Medication History");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        morphs[1] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        return morphs;
      },
      statements: [["block", "each", [["get", "fc.patient.medications", ["loc", [null, [2, 8], [2, 30]]]]], [], 0, 1, ["loc", [null, [2, 0], [14, 9]]]], ["content", "outlet", ["loc", [null, [16, 0], [16, 10]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("antimicrobial-cds/templates/patient", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 97,
              "column": 8
            },
            "end": {
              "line": 99,
              "column": 8
            }
          },
          "moduleName": "antimicrobial-cds/templates/patient.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        Total Medications: ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["content", "fc.patient.medications.length", ["loc", [null, [98, 27], [98, 60]]]]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 99,
              "column": 8
            },
            "end": {
              "line": 101,
              "column": 8
            }
          },
          "moduleName": "antimicrobial-cds/templates/patient.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("No Medication History");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 141,
              "column": 6
            },
            "end": {
              "line": 145,
              "column": 6
            }
          },
          "moduleName": "antimicrobial-cds/templates/patient.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "row bg-infolight-b");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("strong");
          var el3 = dom.createTextNode("Penicillin");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "fragmentReason": false,
          "revision": "Ember@2.2.0",
          "loc": {
            "source": null,
            "start": {
              "line": 145,
              "column": 6
            },
            "end": {
              "line": 149,
              "column": 6
            }
          },
          "moduleName": "antimicrobial-cds/templates/patient.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "row info");
          var el2 = dom.createTextNode("\n        No relevant allergies\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "fragmentReason": {
          "name": "missing-wrapper",
          "problems": ["multiple-nodes", "wrong-type"]
        },
        "revision": "Ember@2.2.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 155,
            "column": 0
          }
        },
        "moduleName": "antimicrobial-cds/templates/patient.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-6 border");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row zeroborder");
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h3");
        var el6 = dom.createTextNode("Patient Information");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("dl");
        dom.setAttribute(el5, "class", "dl-horizontal zeroborder");
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("Name");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n        ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("Birth Date");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("Sex");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("Address");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n      ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row zeroborder");
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5, "class", "lead");
        var el6 = dom.createTextNode("Recent Vitals");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("dl");
        dom.setAttribute(el5, "class", "dl-horizontal zeroborder");
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("Weight");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "patientspan");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("Temperature");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "patientspan");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("BP Systolic");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "patientspan");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dt");
        var el7 = dom.createTextNode("BP Diastolic");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("dd");
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode(" ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "patientspan");
        var el8 = dom.createComment("");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n      ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-6 border");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Reason for current visit");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("Unknown");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-1");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-5");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Problem List");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row bg-infolight-a");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "patientspan");
        var el6 = dom.createTextNode("Hypertensive disorder\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "problembutton pull-right hidden");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("i");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row bg-infolight-b");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("Transformed migraine\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "problembutton pull-right hidden");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("i");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row bg-infolight-a");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("Hypercholesterolemia\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "problembutton pull-right hidden");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("i");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5, "class", "lead");
        var el6 = dom.createTextNode("Non-Chronic");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row bg-infolight-b");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("Bacterial pneumonia\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "problembutton pull-right hidden");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("i");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-1");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-5");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Medication History");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row info");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-1");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-5");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Lab Results");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row bg-infolight-a");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Triglycerides, Serum or Plasma");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" 72 ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "class", "faded");
        var el7 = dom.createTextNode("Aug 12, 2015");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "labbutton pull-right hidden");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("i");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "row bg-infolight-b");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Stat Gram Stain");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" +1 - click review for more details ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("span");
        dom.setAttribute(el6, "class", "faded");
        var el7 = dom.createTextNode("Yesterday");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("div");
        dom.setAttribute(el6, "class", "labbutton pull-right hidden");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("em");
        var el8 = dom.createTextNode("i");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-1");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-md-5");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        var el5 = dom.createTextNode("Allergies");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 1]);
        var element1 = dom.childAt(element0, [1, 3]);
        var element2 = dom.childAt(element0, [3, 3]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(element2, [7]);
        var element5 = dom.childAt(element2, [11]);
        var element6 = dom.childAt(element2, [15]);
        var element7 = dom.childAt(fragment, [2]);
        var element8 = dom.childAt(element7, [1, 7]);
        var morphs = new Array(25);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [3]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [7]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [11]), 0, 0);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [15]), 0, 0);
        morphs[4] = dom.createMorphAt(element3, 0, 0);
        morphs[5] = dom.createMorphAt(element3, 2, 2);
        morphs[6] = dom.createMorphAt(dom.childAt(element3, [4]), 0, 0);
        morphs[7] = dom.createMorphAt(element4, 0, 0);
        morphs[8] = dom.createMorphAt(element4, 2, 2);
        morphs[9] = dom.createMorphAt(dom.childAt(element4, [4]), 0, 0);
        morphs[10] = dom.createMorphAt(element5, 0, 0);
        morphs[11] = dom.createMorphAt(element5, 2, 2);
        morphs[12] = dom.createMorphAt(dom.childAt(element5, [4]), 0, 0);
        morphs[13] = dom.createMorphAt(element6, 0, 0);
        morphs[14] = dom.createMorphAt(element6, 2, 2);
        morphs[15] = dom.createMorphAt(dom.childAt(element6, [4]), 0, 0);
        morphs[16] = dom.createMorphAt(element8, 3, 3);
        morphs[17] = dom.createMorphAt(element8, 5, 5);
        morphs[18] = dom.createMorphAt(element8, 7, 7);
        morphs[19] = dom.createMorphAt(element8, 9, 9);
        morphs[20] = dom.createMorphAt(element8, 11, 11);
        morphs[21] = dom.createMorphAt(dom.childAt(element8, [13]), 1, 1);
        morphs[22] = dom.createMorphAt(dom.childAt(element8, [15]), 3, 3);
        morphs[23] = dom.createMorphAt(dom.childAt(element7, [3, 7]), 3, 3);
        morphs[24] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        return morphs;
      },
      statements: [["content", "fc.patient.formatted_name", ["loc", [null, [8, 12], [8, 41]]]], ["content", "fc.patient.birthDate", ["loc", [null, [11, 12], [11, 36]]]], ["content", "fc.patient.gender", ["loc", [null, [13, 12], [13, 33]]]], ["content", "fc.patient.formatted_address", ["loc", [null, [15, 12], [15, 44]]]], ["inline", "round", [["get", "fc.patient.weight.value", ["loc", [null, [22, 20], [22, 43]]]]], [], ["loc", [null, [22, 12], [22, 45]]]], ["content", "fc.patient.weight.unit", ["loc", [null, [22, 46], [22, 72]]]], ["content", "fc.patient.weight.date", ["loc", [null, [22, 99], [22, 125]]]], ["inline", "round", [["get", "fc.patient.temp.value", ["loc", [null, [24, 20], [24, 41]]]]], [], ["loc", [null, [24, 12], [24, 43]]]], ["content", "fc.patient.temp.unit", ["loc", [null, [24, 44], [24, 68]]]], ["content", "fc.patient.temp.date", ["loc", [null, [24, 95], [24, 119]]]], ["content", "fc.patient.bloodpressure.systolic.value", ["loc", [null, [26, 12], [26, 55]]]], ["content", "fc.patient.bloodpressure.systolic.unit", ["loc", [null, [26, 56], [26, 98]]]], ["content", "fc.patient.bloodpressure.systolic.date", ["loc", [null, [27, 36], [27, 78]]]], ["content", "fc.patient.bloodpressure.diastolic.value", ["loc", [null, [29, 12], [29, 56]]]], ["content", "fc.patient.bloodpressure.diastolic.unit", ["loc", [null, [29, 57], [29, 100]]]], ["content", "fc.patient.bloodpressure.diastolic.date", ["loc", [null, [30, 36], [30, 79]]]], ["inline", "medication-list", [], ["meds", ["subexpr", "@mut", [["get", "fc.patient.medications", ["loc", [null, [91, 29], [91, 51]]]]], [], []], "index", 0, "highlight_color", "bg-infolight-b"], ["loc", [null, [91, 6], [91, 94]]]], ["inline", "medication-list", [], ["meds", ["subexpr", "@mut", [["get", "fc.patient.medications", ["loc", [null, [92, 29], [92, 51]]]]], [], []], "index", 1, "highlight_color", "bg-infolight-a"], ["loc", [null, [92, 6], [92, 94]]]], ["inline", "medication-list", [], ["meds", ["subexpr", "@mut", [["get", "fc.patient.medications", ["loc", [null, [93, 29], [93, 51]]]]], [], []], "index", 2, "highlight_color", "bg-infolight-b"], ["loc", [null, [93, 6], [93, 94]]]], ["inline", "medication-list", [], ["meds", ["subexpr", "@mut", [["get", "fc.patient.medications", ["loc", [null, [94, 29], [94, 51]]]]], [], []], "index", 3, "highlight_color", "bg-infolight-a"], ["loc", [null, [94, 6], [94, 94]]]], ["inline", "medication-list", [], ["meds", ["subexpr", "@mut", [["get", "fc.patient.medications", ["loc", [null, [95, 29], [95, 51]]]]], [], []], "index", 4, "highlight_color", "bg-infolight-b"], ["loc", [null, [95, 6], [95, 94]]]], ["block", "if", [["get", "fc.patient.medications", ["loc", [null, [97, 14], [97, 36]]]]], [], 0, 1, ["loc", [null, [97, 8], [101, 15]]]], ["inline", "link-to", ["Medications", "medicationorders"], ["class", "btn btn-default pull-right"], ["loc", [null, [105, 8], [105, 87]]]], ["block", "if", [["get", "fc.patient.hasPenicillinAllergy", ["loc", [null, [141, 12], [141, 43]]]]], [], 2, 3, ["loc", [null, [141, 6], [149, 13]]]], ["content", "outlet", ["loc", [null, [154, 0], [154, 10]]]]],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  })());
});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('antimicrobial-cds/config/environment', ['ember'], function(Ember) {
  var prefix = 'antimicrobial-cds';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (!runningTests) {
  require("antimicrobial-cds/app")["default"].create({"date_format":"YYYY/MM/DD","aom_cds":["3110003","65363002"],"strep_cds":["43878008","1532007"],"lab_exclusions":["55284-4","8480-6","8462-4","3141-9","8310-5"],"aom_temp_threshold":39,"strep_temp_threshold":38,"name":"antimicrobial-cds","version":"0.0.0+0e072679"});
}

/* jshint ignore:end */
//# sourceMappingURL=antimicrobial-cds.map