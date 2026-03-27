// APK Showcase Script with Multi-language Support
// Customize for your app

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        CONFIG_FILE: 'apks.json',           // Your config file name
        DOWNLOAD_TIMEOUT: 30000,            // Download timeout in ms
        animationThreshold: 0.1,            // Animation trigger threshold
        animationRootMargin: '0px 0px -50px 0px'
    };

    // ===== STATE =====
    let state = {
        currentAPK: null,
        currentCode: null,
        apkName: null,
        appData: null,
        currentLanguage: 'en'
    };

    // ===== DOM ELEMENTS =====
    const elements = {
        navDownloadBtn: null,
        heroDownloadBtn: null,
        heroAndroidBtn: null,
        bannerDownloadBtn: null
    };

    // ===== INITIALIZATION =====
    function init() {
        // Detect and apply language
        detectAndApplyLanguage();

        // Setup language switcher
        setupLanguageSwitcher();

        // Cache DOM elements
        elements.navDownloadBtn = document.getElementById('navDownloadBtn');
        elements.heroDownloadBtn = document.getElementById('heroDownloadBtn');
        elements.heroAndroidBtn = document.getElementById('heroAndroidBtn');
        elements.bannerDownloadBtn = document.getElementById('bannerDownloadBtn');

        // Load APK configuration
        loadAPKConfig();

        // Attach event listeners
        attachEventListeners();

        // Add entrance animations
        addEntranceAnimations();

        // Setup smooth scroll
        setupSmoothScroll();

        // Add parallax effect
        setupParallaxEffect();

        // Add scroll progress
        addScrollProgress();

        // Setup download handlers
        setupDownloadHandlers();
    }

    // ===== LANGUAGE FUNCTIONS =====
    function detectAndApplyLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];

        if (translations[langCode]) {
            state.currentLanguage = langCode;
        } else {
            state.currentLanguage = 'en';
        }

        applyLanguage(state.currentLanguage);
        document.documentElement.lang = state.currentLanguage;

        if (state.currentLanguage === 'ar') {
            document.documentElement.dir = 'rtl';
        }

        setTimeout(() => {
            const activeBtn = document.querySelector(`.lang-btn[data-lang="${state.currentLanguage}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        }, 100);
    }

    function setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                if (lang && translations[lang]) {
                    state.currentLanguage = lang;
                    applyLanguage(lang);

                    document.documentElement.lang = lang;
                    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

                    langButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        });
    }

    function applyLanguage(lang) {
        const t = translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        if (t.title) {
            document.title = `${t.title} - ${t.tagline}`;
        }
    }

    // ===== APK CONFIG LOADING =====
    async function loadAPKConfig() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('r');
            state.currentCode = code;

            const response = await fetch(CONFIG.CONFIG_FILE);

            if (!response.ok) {
                throw new Error('Failed to load configuration');
            }

            const config = await response.json();
            state.appData = config;

            if (code && config.apps && config.apps[code]) {
                const app = config.apps[code];
                state.currentAPK = app.filename;
                state.apkName = app.name || 'Vidhub';
            } else {
                state.currentAPK = config.default;
                state.apkName = 'Vidhub';
            }

        } catch (error) {
            console.error('Error loading config:', error);
            state.currentAPK = 'vidhub_default.apk';
            state.apkName = 'Vidhub';
            state.currentCode = null;
        }
    }

    // ===== EVENT LISTENERS =====
    function attachEventListeners() {
        if (elements.navDownloadBtn) {
            elements.navDownloadBtn.addEventListener('click', handleDownload);
        }
        if (elements.heroDownloadBtn) {
            elements.heroDownloadBtn.addEventListener('click', handleDownload);
        }
        if (elements.heroAndroidBtn) {
            elements.heroAndroidBtn.addEventListener('click', handleDownload);
        }
        if (elements.bannerDownloadBtn) {
            elements.bannerDownloadBtn.addEventListener('click', handleDownload);
        }
    }

    function setupDownloadHandlers() {
        [elements.navDownloadBtn, elements.heroDownloadBtn, elements.heroAndroidBtn, elements.bannerDownloadBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', handleDownload);
            }
        });
    }

    // ===== DOWNLOAD HANDLER =====
    async function handleDownload(e) {
        e.preventDefault();

        const t = translations[state.currentLanguage];

        if (!state.currentAPK) {
            showToast(t.loading);
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!state.currentAPK) {
                showToast(t.downloadError);
                return;
            }
        }

        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;
        btn.disabled = true;

        btn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">' + t.loading + '</span>';

        showToast(t.downloading);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const downloadLink = document.createElement('a');
            downloadLink.href = state.currentAPK;
            downloadLink.download = state.currentAPK;
            downloadLink.target = '_blank';

            document.body.appendChild(downloadLink);
            downloadLink.click();

            await new Promise(resolve => setTimeout(resolve, 100));
            document.body.removeChild(downloadLink);

            showToast(t.downloadStarted);
            console.log(`✓ Download initiated: ${state.currentAPK}`);

        } catch (error) {
            console.error('Download failed:', error);
            showToast(t.downloadError);
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }, 2000);
        }
    }

    function showToast(message) {
        const toast = document.getElementById('toastMsg');
        if (!toast) return;

        toast.textContent = message || t.toastDefault;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ===== ANIMATIONS =====
    function addEntranceAnimations() {
        const observerOptions = {
            threshold: CONFIG.animationThreshold,
            rootMargin: CONFIG.animationRootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Animate feature cards
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(card);
        });

        // Animate steps
        document.querySelectorAll('.step').forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
            observer.observe(step);
        });

        // Animate stats
        document.querySelectorAll('.stat').forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            stat.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(stat);
        });
    }

    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function setupParallaxEffect() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const orbs = document.querySelectorAll('.gradient-orb');

                    orbs.forEach((orb, index) => {
                        const speed = 0.1 + (index * 0.05);
                        const yPos = -(scrolled * speed);
                        orb.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    function addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        Object.assign(progressBar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0%',
            height: '3px',
            background: 'linear-gradient(90deg, #f59e0b, #8b5cf6, #ec4899)',
            zIndex: '9999',
            transition: 'width 0.1s ease'
        });

        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ===== STARTUP =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            if (elements.heroDownloadBtn) {
                elements.heroDownloadBtn.click();
            }
        }
        if (e.key === 's' || e.key === 'S') {
            const thumbGrid = document.querySelector('#thumbGrid');
            if (thumbGrid) {
                thumbGrid.scrollIntoView({ behavior: 'smooth' });
            }
        }
        if (e.key === 'h' || e.key === 'H') {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // ===== PERFORMANCE MONITORING =====
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`App showcase loaded in ${loadTime}ms`);
    });

})();
