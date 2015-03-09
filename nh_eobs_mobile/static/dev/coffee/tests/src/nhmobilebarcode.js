var NHMobileBarcode,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

NHMobileBarcode = (function(superClass) {
  extend(NHMobileBarcode, superClass);

  function NHMobileBarcode(trigger_button) {
    var self;
    this.trigger_button = trigger_button;
    self = this;
    this.trigger_button.addEventListener('click', function(event) {
      return self.trigger_button_click(self);
    });
    NHMobileBarcode.__super__.constructor.call(this);
  }

  NHMobileBarcode.prototype.trigger_button_click = function(self) {
    var cancel, input;
    input = '<div class="block"><input type="text" ' + 'name="barcode_scan" class="barcode_scan"/></div>';
    cancel = '<a href="#" data-target="patient_barcode" ' + 'data-action="close">Cancel</a>';
    new NHModal('patient_barcode', 'Scan patient wristband', input, [cancel], 0, document.getElementsByTagName('body')[0]);
    self.input = document.getElementsByClassName('barcode_scan')[0];
    self.input.addEventListener('change', function(event) {
      return self.barcode_scanned(self, event);
    });
    return self.input.focus();
  };

  NHMobileBarcode.prototype.barcode_scanned = function(self, event) {
    var hosp_num, input, url, url_meth;
    event.preventDefault();
    input = event.srcElement ? event.srcElement : event.target;
    hosp_num = input.value;
    url = self.urls.json_patient_barcode(hosp_num);
    url_meth = url.method;
    return Promise.when(self.process_request(url_meth, url.url)).then(function(server_data) {
      var content, data, patientDOB, patient_details, patient_name;
      data = server_data[0][0];
      patient_name = '';
      patient_details = '';
      if (data.full_name) {
        patient_name += " " + data.full_name;
      }
      if (data.gender) {
        patient_name += '<span class="alignright">' + data.gender + '</span>';
      }
      if (data.dob) {
        patientDOB = self.date_from_string(data.dob);
        patient_details += "<dt>DOB:</dt><dd>" + self.date_to_dob_string(patientDOB) + "</dd>";
      }
      if (data.location) {
        patient_details += "<dt>Location:</dt><dd>" + data.location;
      }
      if (data.parent_location) {
        patient_details += ',' + data.parent_location + '</dd>';
      } else {
        patient_details += '</dd>';
      }
      if (data.ews_score) {
        patient_details += '<dt class="twoline">Latest Score:</dt>' + '<dd class="twoline">' + data.ews_score + '</dd>';
      }
      if (data.other_identifier) {
        patient_details += "<dt>Hospital ID:</dt><dd>" + data.other_identifier + "</dd>";
      }
      if (data.patient_identifier) {
        patient_details += "<dt>NHS Number:</dt><dd>" + data.patient_identifier + "</dd>";
      }
      content = '<dl>' + patient_details + '</dl><p><a href="' + self.urls['single_patient'](data.other_identifier).url + '" id="patient_obs_fullscreen" class="button patient_obs">' + 'View Patient Observation Data</a></p>';
      return self.input.parentNode.innerHTML = content;
    });
  };

  return NHMobileBarcode;

})(NHMobile);

if (!window.NH) {
  window.NH = {};
}

if (typeof window !== "undefined" && window !== null) {
  window.NH.NHMobileBarcode = NHMobileBarcode;
}
