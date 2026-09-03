document.addEventListener("DOMContentLoaded", function() {
    const details = document.querySelectorAll('.accordion-item');
    
    details.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                details.forEach(other => {
                    if (other !== this && other.open) {
                        other.open = false;
                    }
                });
            }
        });
    });
});