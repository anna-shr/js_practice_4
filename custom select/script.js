document.addEventListener("DOMContentLoaded", function() {
const customSelect = document.getElementById('customSelect');
const trigger = document.getElementById('customSelectTrigger');
const optionsContainer = document.getElementById('customSelectOptions');
const valueDisplay = document.getElementById('customSelectValue');
const hiddenSelect = document.getElementById('select');

trigger.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = optionsContainer.classList.contains('open');
    
    document.querySelectorAll('.custom-select-options.open').forEach(el => {
        el.classList.remove('open');
        el.closest('.custom-select').querySelector('.custom-select-trigger').classList.remove('active');
    });
    
    if (isOpen) {
        optionsContainer.classList.remove('open');
        trigger.classList.remove('active');
    } else {
        optionsContainer.classList.add('open');
        trigger.classList.add('active');
    }
});

optionsContainer.addEventListener('click', function(e) {
    const option = e.target.closest('.custom-select-option');
    if (!option) return;
    
    const value = option.dataset.value;
    const text = option.textContent;
    
    valueDisplay.textContent = text;
    
    hiddenSelect.value = value;
    hiddenSelect.dispatchEvent(new Event('change'));
    
    document.querySelectorAll('.custom-select-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
    optionsContainer.classList.remove('open');
    trigger.classList.remove('active');
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        optionsContainer.classList.remove('open');
        trigger.classList.remove('active');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        optionsContainer.classList.remove('open');
        trigger.classList.remove('active');
    }
});

hiddenSelect.addEventListener('change', function() {
    const value = this.value;
    const option = document.querySelector(`.custom-select-option[data-value="${value}"]`);
    if (option) {
        valueDisplay.textContent = option.textContent;
        document.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
    }
});

function setSelectValue(value) {
    hiddenSelect.value = value;
    hiddenSelect.dispatchEvent(new Event('change'));
}
})