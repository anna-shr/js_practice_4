const form = document.getElementById('contactForm');

form.addEventListener('submit', function (e) {
    e.preventDefault();
});

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const message = document.getElementById('message');
const consent = document.getElementById('consent');

let data = {};

const FIELD_CONFIG = {
    firstName: { name: 'First Name', checkSpecials: true },
    lastName: { name: 'Last Name', checkSpecials: true },
    email: { name: 'Email', checkSpecials: false },
    message: { name: 'Message', checkSpecials: true }
};

function saveFormData() {
    data = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        queryType: document.querySelector('input[name="queryType"]:checked')?.value || '',
        message: message.value,
        consent: consent.checked
    };
}

function isEmpty(value) {
    return value.trim() === '';
}

function hasSpecialChars(value) {
    return /[@#$%&*()_+=\[\]{}|\\;:'",<>/?]/.test(value);
}

function showError(field, message) {
    clearError(field);

    if (message) {
        field.classList.add('error');
        const errorMsg = document.createElement('span');
        errorMsg.className = 'field-error';
        errorMsg.textContent = '❌ ' + message;
        field.parentElement.appendChild(errorMsg);
    }
}

function clearError(field) {
    const oldError = field.parentElement?.querySelector('.field-error');
    if (oldError) oldError.remove();
    field.classList.remove('error');
}


function validateField(field, fieldName, checkSpecials) {
    const value = field.value.trim();
    let error = '';

    if (isEmpty(value)) {
        error = fieldName + ' is required';
    } else if (value.length < 5 || value.length > 30) {
        error = 'Your text should be from 5 to 30 symbols';
    } else if (checkSpecials && hasSpecialChars(value)) {
        error = 'No symbols like (@#$%&*()_+=)';
    }

    if (error) {
        showError(field, error);
        return false;
    } else {
        clearError(field);
        return true;
    }
}

function validateAllFields() {
    let isValid = true;

    for (const [id, config] of Object.entries(FIELD_CONFIG)) {
        const field = document.getElementById(id);
        if (!validateField(field, config.name, config.checkSpecials)) {
            isValid = false;
        }
    }

    const queryTypeSelected = document.querySelector('input[name="queryType"]:checked');
    const queryGroup = document.querySelector('.radio-group');
    if (!queryTypeSelected) {
        showError(queryGroup, 'Please select a query type');
        isValid = false;
    } else {
        clearError(queryGroup);
    }

    if (!consent.checked) {
        showError(consent, 'You must consent to being contacted');
        isValid = false;
    } else {
        clearError(consent);
    }

    return isValid;
}

function isFormValid() {
    for (const [id, config] of Object.entries(FIELD_CONFIG)) {
        const field = document.getElementById(id);
        const value = field.value.trim();
        if (isEmpty(value)) return false;
        if (value.length < 5 || value.length > 30) return false;
        if (config.checkSpecials && hasSpecialChars(value)) return false;
    }

    if (!document.querySelector('input[name="queryType"]:checked')) return false;
    if (!consent.checked) return false;

    return true;
}

function updateSubmitButton() {
    const isValid = isFormValid();
    submitBtn.disabled = !isValid;
    submitBtn.style.opacity = isValid ? '1' : '0.5';
    submitBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
}

function onFieldChange(e) {
    const field = e.target;

    if (field.type === 'checkbox') {
        saveFormData();
        updateSubmitButton();
        return;
    }

    const config = FIELD_CONFIG[field.id];
    if (config) {
        validateField(field, config.name, config.checkSpecials);
    }

    saveFormData();
    updateSubmitButton();
}

function setupValidation() {
    const allFields = [firstName, lastName, email, message, consent];

    allFields.forEach(field => {
        if (field && field.type !== 'checkbox') {
            field.addEventListener('change', onFieldChange);
            field.addEventListener('input', onFieldChange);
        }
    });

    document.querySelectorAll('input[name="queryType"]').forEach(radio => {
        radio.addEventListener('change', function () {
            saveFormData();
            updateSubmitButton();
        });
    });

    if (consent) {
        consent.addEventListener('change', function () {
            saveFormData();
            updateSubmitButton();
        });
    }
}

const submitBtn = form.querySelector('.submit-btn');

submitBtn.addEventListener("click", function () {
    if (validateAllFields()) {
        console.log('✅ Данные отправлены:', data);
    }
});

setupValidation();
updateSubmitButton();