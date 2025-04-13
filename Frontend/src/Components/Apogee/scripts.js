document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('.row');

    function handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight;
        rows.forEach((row) => {
            const rowTop = row.offsetTop;
            if (scrollPosition > rowTop) {
                row.style.opacity = 1; // Fade in the current row
            } else {
                row.style.opacity = 0; // Fade out rows that are not in view
            }
        });
    }

    // Attach scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check to handle initial load
    handleScroll();
});

function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modal.style.display = 'block';
    modalImage.src = src;
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}
