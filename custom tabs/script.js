document.addEventListener("DOMContentLoaded", function () {
    const tabsNav = document.getElementById('tabsNav');
    const buttons = tabsNav.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.dataset.tab;

            buttons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');

            panels.forEach(panel => panel.classList.remove('active'));
            
            const targetPanel = document.getElementById(tabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
});