document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Age Calculation
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const ageDisplay = document.getElementById('age-display');
    if (ageDisplay) {
        // Animate the number counting up
        const targetAge = calculateAge('1996-08-14');
        let current = 0;
        const speed = 50;

        const countUp = () => {
            if (current < targetAge) {
                current++;
                ageDisplay.textContent = current;
                setTimeout(countUp, speed);
            } else {
                ageDisplay.textContent = targetAge;
            }
        };
        countUp();
    }

    // 2. Last Update Date
    const updateDisplay = document.getElementById('last-update');
    if (updateDisplay) {
        const now = new Date();
        const dateString = now.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '.'); // Replace / with . for digital look

        updateDisplay.textContent = dateString;
    }
});
