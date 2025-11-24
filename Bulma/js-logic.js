document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.presentation-slide');
    const presentationContainer = document.getElementById('presentation-container');
    let currentSlideIndex = 0;
    const totalSlides = slides.length; // Loetakse nüüd 9-ks

    /**
     * Kontrollib ja kuvab õige slaidi.
     * @param {number} newIndex - Uue slaidi indeks.
     */
    function showSlide(newIndex) {
        // Veendu, et indeks on piirides
        if (newIndex >= 0 && newIndex < totalSlides) {
            // Peida praegune slaid
            slides[currentSlideIndex].classList.remove('is-active');
            
            // Uuenda indeksit
            currentSlideIndex = newIndex;
            
            // Näita uut slaidi
            slides[currentSlideIndex].classList.add('is-active');
        }
    }

    // Seadista esialgne aktiivne slaid
    if (!slides[currentSlideIndex].classList.contains('is-active')) {
         slides[currentSlideIndex].classList.add('is-active');
    }

    // -------------------------------------
    // 1. NOOLEKLAHVIGA KONTROLL
    // -------------------------------------
    document.addEventListener('keydown', (e) => {
        // Keela nooleklahvide vaikimisi kerimine
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault(); 
        }

        if (e.key === "ArrowRight") {
            showSlide(currentSlideIndex + 1);
        } else if (e.key === "ArrowLeft") {
            showSlide(currentSlideIndex - 1);
        }
    });

    // -------------------------------------
    // 2. EKRAANIKLÕPSAMISE KONTROLL
    // -------------------------------------

    presentationContainer.addEventListener('click', (e) => {
        // Kontrolli, kas klõps ei tabanud interaktiivset elementi (nt nuppu või linki)
        if (e.target.closest('button, a, .modal-content, [data-target]')) {
             return;
        }

        const clickX = e.clientX;
        const width = presentationContainer.offsetWidth;
        const boundary = width * 0.20; // Kasutame 20% äärealasid

        if (clickX > width - boundary) {
            // Klõps paremal 20% alal -> Järgmine slaid
            showSlide(currentSlideIndex + 1);
        } else if (clickX < boundary) {
            // Klõps vasakul 20% alal -> Eelmine slaid
            showSlide(currentSlideIndex - 1);
        }
    });


    // -------------------------------------
    // 3. MODAALI AKTIVEERIMISE LOOGIKA
    // -------------------------------------
    
    const modalActivators = document.querySelectorAll('[data-target]');
    const modalClosers = document.querySelectorAll('.modal .delete, .modal-close, .modal-background');

    // Avamine
    modalActivators.forEach(el => {
        el.addEventListener('click', () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            $target.classList.add('is-active');
        });
    });

    // Sulgemine
    modalClosers.forEach(el => {
        el.addEventListener('click', () => {
            const $target = el.closest('.modal');
            $target.classList.remove('is-active');
        });
    });
});