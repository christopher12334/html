document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.presentation-slide');
    const presentationContainer = document.getElementById('presentation-container');
    const progressBar = document.getElementById('progressBar'); 
    let currentSlideIndex = 0;
    const totalSlides = slides.length; 

    /**
     * Kontrollib ja kuvab õige slaidi.
     */
    function showSlide(newIndex) {
        if (newIndex >= 0 && newIndex < totalSlides) {
            // Eemalda eelmiselt
            slides[currentSlideIndex].classList.remove('is-active');
            
            // Uuenda indeksit
            currentSlideIndex = newIndex;
            
            // Lisa uuele
            slides[currentSlideIndex].classList.add('is-active');
            
            // Uuenda edenemisriba
            updateProgressBar();
        }
    }

    function updateProgressBar() {
        if(!progressBar) return;
        // Arvutame protsendi: (praegune / (kokku - 1)) * 100
        const percentage = (currentSlideIndex / (totalSlides - 1)) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    // Algseadistus
    if (!slides[currentSlideIndex].classList.contains('is-active')) {
         slides[currentSlideIndex].classList.add('is-active');
    }
    updateProgressBar(); // Käivita alguses ka

    // -------------------------------------
    // 1. NOOLEKLAHVIGA KONTROLL
    // -------------------------------------
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            showSlide(currentSlideIndex + 1);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            showSlide(currentSlideIndex - 1);
        }
    });

    // -------------------------------------
    // 2. HIITREKLÕPSAMISE KONTROLL
    // -------------------------------------
    presentationContainer.addEventListener('click', (e) => {
        // Kui klikitakse nupule, lingile või modaalile, ära vaheta slaidi
        if (e.target.closest('button, a, .modal-content, [data-target], .code-window, #finish-btn')) {
             return;
        }
        const clickX = e.clientX;
        const width = window.innerWidth;
        
        if (clickX > width * 0.7) {
            showSlide(currentSlideIndex + 1);
        } else if (clickX < width * 0.3) {
            showSlide(currentSlideIndex - 1);
        }
    });


    // -------------------------------------
    // 3. MODAALI LOOGIKA
    // -------------------------------------
    const modalActivators = document.querySelectorAll('[data-target]');
    const modalClosers = document.querySelectorAll('.modal-close, .modal-background, .delete-btn');

    modalActivators.forEach(el => {
        el.addEventListener('click', () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            if($target) $target.classList.add('is-active');
        });
    });

    modalClosers.forEach(el => {
        el.addEventListener('click', () => {
            // Sulge kõik lahtised modaalid
            document.querySelectorAll('.modal.is-active').forEach(m => {
                m.classList.remove('is-active');
            });
        });
    });

    // -------------------------------------
    // 4. LÕPUSLAIDI EFEKT (KONFETI) - UUS
    // -------------------------------------
    const finishBtn = document.getElementById('finish-btn');
    
    if (finishBtn) {
        finishBtn.addEventListener('click', (e) => {
            // Peatame mullitamise, et slaid ei vahetuks
            e.stopPropagation(); 

            // 1. Muudame ikooni värvi ja stiili
            const icon = finishBtn.querySelector('i');
            finishBtn.style.borderColor = '#48c774'; // Ring roheliseks
            finishBtn.style.boxShadow = '0 0 40px #48c774, inset 0 0 20px #48c774';
            icon.classList.remove('fa-check');
            icon.classList.add('fa-face-laugh-beam', 'success-glow'); // Naerunägu

            // 2. Tekitame 50 osakest (konfetit)
            const colors = ['#a872cc', '#6da2ed', '#ffffff', '#48c774', '#f14668'];
            
            // Saame nupu koordinaadid, et plahvatus tuleks nupu keskelt
            const rect = finishBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Juhuslik värv
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Alguspunkt (nupu keskel)
                particle.style.left = centerX + 'px';
                particle.style.top = centerY + 'px';

                // Arvutame juhusliku suuna (X ja Y teljel)
                // Random arv vahemikus -200px kuni +200px
                const destX = (Math.random() - 0.5) * 400 + 'px';
                const destY = (Math.random() - 0.5) * 400 + 'px';

                // Määrame CSS muutujad, mida animatsioon kasutab
                particle.style.setProperty('--x', destX);
                particle.style.setProperty('--y', destY);

                document.body.appendChild(particle);

                // Kustutame elemendi pärast animatsiooni lõppu (1 sekund)
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }
        });
    }
});