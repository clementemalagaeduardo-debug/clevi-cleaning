document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavigation();
    initCounters();
    initBeforeAfterSlider();
    initTestimonials();
    initFormValidation();
});


function initNavigation() {
    const header = document.getElementById('sticky-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-navy-900', 'shadow-2xl', 'py-3');
            header.classList.remove('bg-navy-900/95', 'py-4');
        } else {
            header.classList.remove('bg-navy-900', 'shadow-2xl', 'py-3');
            header.classList.add('bg-navy-900/95', 'py-4');
        }
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });


    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}


function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100;

    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
        let current = 0;

        const update = () => {
            const increment = target / speed;
            if (current < target) {
                current += increment;
                counter.innerText = current.toFixed(decimals) + (target === 500 || target === 200 ? '+' : '');
                setTimeout(update, 10);
            } else {
                counter.innerText = target.toFixed(decimals) + (target === 500 || target === 200 ? '+' : '');
            }
        };
        update();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    counters.forEach(counter => observer.observe(counter));
}


function initBeforeAfterSlider() {
    const container = document.getElementById('before-after-slider');
    const afterWrapper = document.getElementById('after-image-wrapper');
    const handle = document.getElementById('slider-handle');

    if (!container || !afterWrapper || !handle) return;

    let isDragging = false;

    const moveSlider = (clientX) => {
        const rect = container.getBoundingClientRect();
        const position = clientX - rect.left;
        let percentage = (position / rect.width) * 100;

        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        afterWrapper.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    };


    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });


    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
    });
    window.addEventListener('touchend', () => {
        isDragging = false;
    });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        if (e.touches && e.touches[0]) {
            moveSlider(e.touches[0].clientX);
        }
    }, { passive: true });
}


const testimonials = [
    {
        quote: "Clevi Cleaning Service exceeded my expectations. The team was professional, punctual, and left my home spotless.",
        author: "Sarah M.",
        location: "Bonsall, CA",
        initials: "SM"
    },
    {
        quote: "Our office has never looked better. Highly recommend their services.",
        author: "Michael R.",
        location: "Oceanside, CA",
        initials: "MR"
    },
    {
        quote: "Excellent communication, fair pricing, and amazing attention to detail.",
        author: "Jennifer T.",
        location: "Carlsbad, CA",
        initials: "JT"
    }
];

function initTestimonials() {
    const container = document.getElementById('testimonial-container');
    const dotsContainer = document.getElementById('testimonial-dots');
    if (!container || !dotsContainer) return;

    let currentIndex = 0;


    testimonials.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-gold w-6' : 'bg-gray-300'}`;
        dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = idx;
            renderTestimonial(idx);
        });
        dotsContainer.appendChild(dot);
    });

    function renderTestimonial(index) {
        const activeData = testimonials[index];
        container.innerHTML = `
            <div class="testimonial-card bg-slate-50 p-8 rounded-2xl border border-gray-100 shadow-md opacity-0 transform translate-y-2">
                <p class="text-gray-700 italic text-sm sm:text-base leading-relaxed">"${activeData.quote}"</p>
                <div class="flex items-center gap-3 mt-6">
                    <div class="w-12 h-12 rounded-full bg-navy-900 text-gold flex items-center justify-center font-bold text-sm border border-gold/45">${activeData.initials}</div>
                    <div>
                        <h5 class="font-bold text-navy-900 text-sm">${activeData.author}</h5>
                        <p class="text-xs text-gray-400">${activeData.location}</p>
                    </div>
                </div>
            </div>
        `;


        setTimeout(() => {
            const card = container.querySelector('.testimonial-card');
            card.classList.remove('opacity-0', 'translate-y-2');
        }, 50);


        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, idx) => {
            if (idx === index) {
                dot.className = 'w-2.5 h-2.5 rounded-full bg-gold w-6 transition-all duration-300';
            } else {
                dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300';
            }
        });
    }


    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        renderTestimonial(currentIndex);
    }, 6000);

    renderTestimonial(0);
}


function initFormValidation() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const notesInput = document.getElementById('clientNotes');
    const feedbackBlock = document.getElementById('formFeedback');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');
    const notesError = document.getElementById('notesError');


    const validateField = (input, errorEl, condition) => {
        if (condition) {
            input.classList.remove('border-red-500', 'focus:border-red-500');
            input.classList.add('border-emerald-500', 'focus:border-emerald-500');
            errorEl.classList.add('hidden');
            return true;
        } else {
            input.classList.remove('border-emerald-500', 'focus:border-emerald-500');
            input.classList.add('border-red-500', 'focus:border-red-500');
            errorEl.classList.remove('hidden');
            return false;
        }
    };

    nameInput.addEventListener('input', () => {
        validateField(nameInput, nameError, nameInput.value.trim().length > 0);
    });

    phoneInput.addEventListener('input', () => {
        const phoneRegex = new RegExp('^[+]?[0-9\\s-\\(\\)]{7,15}$');
        validateField(phoneInput, phoneError, phoneRegex.test(phoneInput.value.trim()));
    });

    emailInput.addEventListener('input', () => {
        const emailRegex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
        validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    });

    notesInput.addEventListener('input', () => {
        validateField(notesInput, notesError, notesInput.value.trim().length > 0);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 0);
        const phoneRegex = new RegExp('^[+]?[0-9\\s-\\(\\)]{7,15}$');
        const isPhoneValid = validateField(phoneInput, phoneError, phoneRegex.test(phoneInput.value.trim()));
        const emailRegex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
        const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
        const isNotesValid = validateField(notesInput, notesError, notesInput.value.trim().length > 0);

        if (isNameValid && isPhoneValid && isEmailValid && isNotesValid) {
            feedbackBlock.classList.remove('hidden');
            feedbackBlock.classList.add('animate-pulse');
            form.reset();
            

            [nameInput, phoneInput, emailInput, notesInput].forEach(inp => {
                inp.classList.remove('border-emerald-500', 'focus:border-emerald-500');
            });

            setTimeout(() => {
                feedbackBlock.classList.add('hidden');
                feedbackBlock.classList.remove('animate-pulse');
            }, 8000);
        }
    });
}
