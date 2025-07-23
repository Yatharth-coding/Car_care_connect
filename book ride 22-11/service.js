// Add JavaScript functionality if needed (e.g., dynamic updates, map interactions).
document.querySelectorAll('.tab button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.tab .active').classList.remove('active');
    button.classList.add('active');
  });
});

function redirectToPage() {
  window.open('n.html', '_blank'); // Opens the page in a new tab
}
