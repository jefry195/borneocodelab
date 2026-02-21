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
        fetch('admin/api.php')
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
                    card.innerHTML = `
                        <div class="portfolio-image">
                            <img src="${p.image}" alt="${p.title}">
                        </div>
                        <div class="portfolio-content">
                            <span class="tag">${p.category}</span>
                            <h3>${p.title}</h3>
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

    const API_KEY = 'AIzaSyAta4sxZ8Aveo7Z_0EgCsrRCbft5r4qjcA';

    const systemPrompt = `Kamu adalah Asisten AI untuk BorneoCodeLab, sebuah agensi pembuatan website yang didirikan oleh Jefri (Jefrianus Markus). 
Informasi tentang Jefri dan layanannya:
- Jefri adalah seorang web developer independen.
- Menawarkan layanan pembuatan website: Company Profile, Web Sekolah / E-Learning, Web UMKM / Toko Online, Sistem Informasi, Landing Page, dan Custom Website.
- Keunggulan: Responsive, Halaman Admin, CRUD Data, Dashboard, Integrasi Database, Hosting & Domain (opsional), Maintenance 1 bulan.
- Pilihan Paket Harga:
  - Starter (Rp 1.2jt/web): Max 5 halaman, responsive, gratis domain .com 1 thn, integrasi WA.
  - Business (Rp 2.0jt/web): 8-10 halaman, premium design, SEO dasar, email bisnis, gratis revisi 2x. Paling laris.
  - Toko Online (Rp 2.8jt/web): Unlimited produk, keranjang & ongkir otomatis, payment gateway, laporan penjualan, training admin.
  - Custom Website: Harga disesuaikan (Chat via WA), sistem & fitur custom kompleks, API integration, UI/UX custom.
- Kontak Layanan: WhatsApp 082354506569, Email digitalmedia.agensi@gmail.com.
- Media Sosial Jefri: 
  - Facebook: https://www.facebook.com/jefry195
  - Instagram: https://www.instagram.com/jefry195
  - LinkedIn: https://www.linkedin.com/in/jefrianus-markus
- Proses pengerjaan: 7-14 hari kerja tergantung kesiapan konten.
- Perpanjangan server minimal Rp 500rb - 1jt / tahun.
Tugasmu adalah menjawab pertanyaan pengunjung website secara natural, ramah, persuasif, ringkas, dan informatif mengenai layanan BorneoCodeLab serta informasi terkait Jefri. Ajak pengunjung untuk berdiskusi dengan Jefri via WA apabila mereka tertarik atau penjelasannya sudah kamu berikan. Berikan jawaban dalam teks murni tanpa formatting seperti bold (*) atau headers (#).`;

    const chatHistory = [];

    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.textContent = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return msgDiv;
    };

    const sendMessageToAI = async (text) => {
        appendMessage(text, 'user');
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        chatbotSendBtn.disabled = true;

        const typingMsg = appendMessage('Mengetik balasan...', 'ai');

        chatHistory.push({ role: "user", parts: [{ text }] });

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: chatHistory
                })
            });

            const data = await response.json();
            typingMsg.remove();

            if (data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage(aiText, 'ai');
                chatHistory.push({ role: "model", parts: [{ text: aiText }] });
            } else {
                appendMessage("Mohon maaf, terjadi kesalahan sistem saat mencoba merespon.", 'ai');
            }
        } catch (error) {
            console.error('API Error:', error);
            typingMsg.remove();
            appendMessage("Maaf, jaringan atau server sedang bermasalah. Silakan hubungi WA Jefri di 082354506569 langsung.", 'ai');
        } finally {
            chatbotInput.disabled = false;
            chatbotSendBtn.disabled = false;
            chatbotInput.focus();
        }
    };

    if (chatbotSendBtn) {
        chatbotSendBtn.addEventListener('click', () => {
            const text = chatbotInput.value.trim();
            if (text) {
                sendMessageToAI(text);
            }
        });
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = chatbotInput.value.trim();
                if (text) {
                    sendMessageToAI(text);
                }
            }
        });
    }
});
