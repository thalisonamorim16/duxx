document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. FIXED NAV BAR SCROLL TOGGLE
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially in case of refresh down the page


    /* ==========================================================================
       2. MOBILE MENU NAVIGATION TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');

    const toggleMenu = () => {
        const isOpen = menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       3. SMOOTH NAVIGATION ACTIVE STATES
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the central zone
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').substring(1);
                    if (href === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });


    /* ==========================================================================
       4. SCROLL REVEAL (FADE-IN / SLIDE-UP)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before entering viewport
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================================================
       5. INTERACTIVE NUMBERS COUNT-UP ANIMATION
       ========================================================================== */
    const countElements = document.querySelectorAll('[data-target], [data-counter]');

    const animateValue = (element, start, end, duration, prefix = '', suffix = '', isRange = false) => {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            
            // Format number to PT-BR standards (12000 -> 12.000)
            const formattedVal = currentVal.toLocaleString('pt-BR');
            
            if (isRange) {
                element.innerHTML = `${start}${suffix} a ${formattedVal}${suffix}`;
            } else {
                element.innerHTML = `${prefix}${formattedVal}${suffix}`;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    };

    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Parse attributes
                const targetAttr = el.getAttribute('data-target') || el.getAttribute('data-counter');
                const target = parseInt(targetAttr, 10);
                if (isNaN(target)) return;

                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                
                // Check if it's the range element "100% a 300%"
                const originalText = el.textContent;
                const isRange = originalText.includes('a') && suffix === '%';
                const start = isRange ? 100 : 0;

                animateValue(el, start, target, 1500, prefix, suffix, isRange);
                observer.unobserve(el); // Animate only once
            }
        });
    }, counterObserverOptions);

    countElements.forEach(el => {
        counterObserver.observe(el);
    });


    /* ==========================================================================
       6. AJAX CONTACT FORM SUBMISSION HANDLER
       ========================================================================== */
    const contactForm = document.getElementById('duxx-lead-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    // CNPJ Auto-format (00.000.000/0000-00)
    const cnpjInput = document.getElementById('form-cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 14) value = value.slice(0, 14);
            
            if (value.length > 12) {
                value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, '$1.$2.$3/$4-$5');
            } else if (value.length > 8) {
                value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, '$1.$2.$3/$4');
            } else if (value.length > 5) {
                value = value.replace(/^(\d{2})(\d{3})(\d{1,3})$/, '$1.$2.$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{1,3})$/, '$1.$2');
            }
            e.target.value = value;
        });
    }

    // WhatsApp Auto-format ((00) 90000-0000)
    const whatsappInput = document.getElementById('form-whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{1,4})$/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{1,4})$/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)$/, '($1');
            }
            e.target.value = value;
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Collect Form Inputs
            const nameInput = document.getElementById('form-name');
            const companyInput = document.getElementById('form-company');
            const instagramInput = document.getElementById('form-instagram');
            const messageInput = document.getElementById('form-message');

            const name = nameInput.value.trim();
            const company = companyInput.value.trim();
            const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
            const cnpj = cnpjInput ? cnpjInput.value.trim() : '';
            const instagram = instagramInput ? instagramInput.value.trim() : '';
            const message = messageInput.value.trim();

            // Client-side Validation check
            if (!name || !company || !whatsapp || !cnpj || !instagram) {
                showStatus('Por favor, preencha todos os campos obrigatórios.', 'error');
                
                // Highlight invalid inputs
                if (!name) nameInput.style.borderColor = 'red';
                if (!company) companyInput.style.borderColor = 'red';
                if (!whatsapp && whatsappInput) whatsappInput.style.borderColor = 'red';
                if (!cnpj && cnpjInput) cnpjInput.style.borderColor = 'red';
                if (!instagram && instagramInput) instagramInput.style.borderColor = 'red';
                return;
            }

            // Clear red borders on success
            nameInput.style.borderColor = '';
            companyInput.style.borderColor = '';
            if (whatsappInput) whatsappInput.style.borderColor = '';
            if (cnpjInput) cnpjInput.style.borderColor = '';
            if (instagramInput) instagramInput.style.borderColor = '';

            // Transition UI to loading state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';

            // Send to maycon.duxx@gmail.com using FormSubmit AJAX Endpoint
            const payload = {
                Nome: name,
                Imobiliaria: company,
                WhatsApp: whatsapp,
                CNPJ: cnpj,
                Instagram: instagram,
                Mensagem: message || 'Nenhuma mensagem adicional'
            };

            fetch('https://formsubmit.co/ajax/maycon.duxx@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Falha no envio do servidor');
                }
            })
            .then(data => {
                showStatus('Dados enviados com sucesso! Nosso time entrará em contato em menos de 5 minutos.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Submission Error:', error);
                showStatus('Ocorreu um erro no envio. Por favor, tente novamente ou nos contate via WhatsApp.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
        });

        // Dynamic border highlight resets on typing
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }

    const showStatus = (message, type) => {
        formStatus.textContent = message;
        formStatus.className = `form-feedback ${type}`;
        formStatus.style.display = 'block';
        
        // Dynamic scroll to feedback if on small screens
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

});
