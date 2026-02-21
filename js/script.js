document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic for FAQ
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Close other items
            const currentActive = document.querySelector('.accordion-header.active');
            if (currentActive && currentActive !== header) {
                currentActive.classList.remove('active');
                currentActive.nextElementSibling.style.maxHeight = null;
            }

            // Toggle current item
            header.classList.toggle('active');
            const content = header.nextElementSibling;

            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle (Basic implementation)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        });
    }

    // Reset mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'row';
            navLinks.style.position = 'static';
            navLinks.style.padding = '0';
            navLinks.style.boxShadow = 'none';
        } else {
            navLinks.style.display = 'none';
        }
    });

    // Load Portfolios Dynamically
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (portfolioGrid) {
        fetch('admin/api')
            .then(res => res.json())
            .then(data => {
                if (!data || data.length === 0) {
                    portfolioGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">Belum ada portfolio tersedia.</div>';
                    return;
                }

                portfolioGrid.innerHTML = '';
                data.forEach(p => {
                    const tagSpans = p.tags ? p.tags.split(',').map(t => `<span>${t.trim()}</span>`).join('') : '';

                    const card = document.createElement('div');
                    card.className = 'portfolio-card';

                    const wrapLink = (content) => {
                        return p.portfolio_link
                            ? `<a href="${p.portfolio_link}" target="_blank" style="text-decoration: none; color: inherit;">${content}</a>`
                            : content;
                    };

                    card.innerHTML = `
                        <div class="portfolio-image">
                            ${wrapLink(`<img src="${p.image}" alt="${p.title}">`)}
                        </div>
                        <div class="portfolio-content">
                            <span class="tag">${p.category}</span>
                            ${wrapLink(`<h3>${p.title}</h3>`)}
                            <p>${p.description}</p>
                            <div class="tags">
                                ${tagSpans}
                            </div>
                        </div>
                    `;
                    portfolioGrid.appendChild(card);
                });
            })
            .catch(err => {
                console.error('Error loading portfolios:', err);
                portfolioGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: red; padding: 40px;">Gagal memuat data portfolio.</div>';
            });
    }

    // Daily Promo Countdown
    const updateCountdown = () => {
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const diff = endOfDay - now;

        if (diff > 0) {
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = m.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = s.toString().padStart(2, '0');
        }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // AI Chatbot Logic
    const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
    const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (chatbotToggleBtn) {
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
    }

    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    const sendToWhatsApp = (text) => {
        const phoneNumber = '6282354506569';
        const encodedText = encodeURIComponent(text);
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        window.open(waUrl, '_blank');
        chatbotInput.value = '';
        chatbotWindow.classList.remove('active'); // optionally close chatbot after sending
    };

    if (chatbotSendBtn) {
        chatbotSendBtn.addEventListener('click', () => {
            const text = chatbotInput.value.trim();
            if (text) sendToWhatsApp(text);
        });
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = chatbotInput.value.trim();
                if (text) sendToWhatsApp(text);
            }
        });
    }
});
