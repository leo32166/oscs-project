require('babel-polyfill');
const firebase = require('firebase/app');
require('firebase/auth');
const InputValidator = require('./modules/InputValidator').default;
const UIUtils = require('./modules/UIUtils').default;
const config = require('./modules/config').config;
const axios = require('axios').default;

firebase.initializeApp(config);

const rule_create_name = document.getElementById('rule--name');
const rule_create_access = document.getElementById('rule--access');
const rule_create_proto_inputs = document.querySelectorAll('input[name="proto"]');
const rule_create_priority = document.getElementById('rule--priority');
const rule_create_sip = document.getElementById('rule--source-ip');
const rule_create_sport = document.getElementById('rule--source-port');
const rule_create_dip = document.getElementById('rule--dest-ip');
const rule_create_dport = document.getElementById('rule--dest-port');
const rule_create_btn = document.getElementById('rule-button--update');

function checkAllInputs() {
    UIUtils.update_text_field_ui(rule_create_name, 
        InputValidator.isValidRuleName(rule_create_name.value));
    UIUtils.update_text_field_ui(rule_create_priority, 
        InputValidator.isNum(rule_create_priority.value));
    UIUtils.update_text_field_ui(rule_create_sip, 
        InputValidator.isValidIp(rule_create_sip.value));
    UIUtils.update_text_field_ui(rule_create_sport, 
        InputValidator.isValidPortNum(rule_create_sport.value));
    UIUtils.update_text_field_ui(rule_create_dip, 
        InputValidator.isValidIp(rule_create_dip.value));
    UIUtils.update_text_field_ui(rule_create_dport, 
        InputValidator.isValidPortNum(rule_create_dport.value));
}

checkAllInputs();

/* ::Add keyboard event listeners to validate text fields:: */
rule_create_name.addEventListener('focus', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidRuleName(e.target.value));
}); rule_create_name.addEventListener('keyup', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidRuleName(e.target.value));
});

rule_create_priority.addEventListener('focus', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isNum(e.target.value));
}); rule_create_priority.addEventListener('keyup', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isNum(e.target.value));
});

rule_create_sip.addEventListener('focus', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidIp(e.target.value));
}); rule_create_sip.addEventListener('keyup', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidIp(e.target.value));
});

rule_create_sport.addEventListener('focus', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidPortNum(e.target.value));
}); rule_create_sport.addEventListener('keyup', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidPortNum(e.target.value));
});

rule_create_dip.addEventListener('focus', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidIp(e.target.value));
}); rule_create_dip.addEventListener('keyup', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidIp(e.target.value));
});

rule_create_dport.addEventListener('focus', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidPortNum(e.target.value));
}); rule_create_dport.addEventListener('keyup', e => {
    UIUtils.update_text_field_ui(e.target, 
        InputValidator.isValidPortNum(e.target.value));
});
/* ::Add keyboard event listeners to validate text fields:: */

document.addEventListener('keyup', e => {
    if (e.keyCode === 13) rule_create_btn.click();
});

firebase.auth()
.onAuthStateChanged(user => {
    if (!InputValidator.isEmpty(user)) {
        rule_create_btn.addEventListener('click', e => {
            checkAllInputs();
            
            if (UIUtils.stillAnyInvalid()) return;
            
            let rule_create_proto = null;

            for (let i = 0; i < rule_create_proto_inputs.length; i++) {
                if (rule_create_proto_inputs[i].checked) {
                    rule_create_proto = rule_create_proto_inputs[i].value;
                }
            }

            user.getIdToken(true)
            .then(token => {
                return axios({
                    url: '/rule-create',
                    method: 'POST',
                    headers: {
                        'Authorisation': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        name: rule_create_name.value,
                        access: rule_create_access.checked.toString(),
                        priority: rule_create_priority.value,
                        proto: rule_create_proto,
                        sip: rule_create_sip.value,
                        sport: rule_create_sport.value,
                        dip: rule_create_dip.value,
                        dport: rule_create_dport.value
                    }
                });
            }).then(response => {
                // console.log(response.data);
                if (response.data.code === 'rule/creation-success') {
                    location.replace('/#firewall-rule');
                } else {
                    UIUtils.showSnackbar(response.data.message);
                }
            }).catch(error => {
                console.error("Error while performing rule creation request: ", error);
                if (error.message === "Network Error") {
                    UIUtils.showSnackbar("Please check your network connection and try again.");
                } else if (error.message.search('404') >= 0) {
                    UIUtils.showSnackbar("Sorry. The functionality has not been enabled.");
                } else {
                    UIUtils.showSnackbar("An unexpected error occurred. Please try again later.");
                }
            });
        });
    } else {
        // UIUtils.logoutUI();
        console.log();
    }
});