// Page Loader, Mobile Menu, Carousels, Modals, Lightbox & Tabs

document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initMobileMenu();
    initAccordions();
    initModals();
    initTabs();
    initCarousels();
    initGalleryLightbox();
});

// 1. Page Loader Fade Out
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
        }, 500); // matches CSS variable transition duration
    });
    
    // Fallback if load takes too long
    setTimeout(() => {
        if (loader.parentNode) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }
    }, 3000);
}

// 2. Mobile Navigation Menu Toggle Overlay
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const overlayLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !overlay) return;

    const openMenu = () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    const closeMenu = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    };

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    
    overlayLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// 3. Interactive Accordion Toggle
function initAccordions() {
    const items = document.querySelectorAll('.accordion-item');

    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items
            items.forEach(el => el.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// 4. Modal Triggers & Controls
function initModals() {
    const triggers = document.querySelectorAll('[data-modal-target]');
    const overlays = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close, [data-modal-close]');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            const targetModal = document.querySelector(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            overlays.forEach(o => o.classList.remove('active'));
            document.body.style.overflow = '';
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// 5. Interactive Tabs
function initTabs() {
    const tabsHeaders = document.querySelectorAll('.tabs-header');

    tabsHeaders.forEach(header => {
        const btns = header.querySelectorAll('.tab-btn');
        const parent = header.closest('.tabs-parent') || header.parentNode;
        const contents = parent.querySelectorAll('.tab-content');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                
                // Set active button
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Set active content
                contents.forEach(c => {
                    if (c.getAttribute('id') === target) {
                        c.classList.add('active');
                    } else {
                        c.classList.remove('active');
                    }
                });
            });
        });
    });
}

// 6. Testimonial / Placement Slider Carousel
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        if (!track) return;

        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-btn-next');
        const prevButton = carousel.querySelector('.carousel-btn-prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        let dots = [];

        let currentIdx = 0;
        let autoplayTimer = null;

        // Create navigation dots dynamically
        if (dotsNav) {
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
                dotsNav.appendChild(dot);
                dots.push(dot);

                dot.addEventListener('click', () => {
                    moveToSlide(idx);
                    resetAutoplay();
                });
            });
        }

        const updateDots = (targetIdx) => {
            if (dots.length === 0) return;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[targetIdx].classList.add('active');
        };

        const moveToSlide = (targetIdx) => {
            if (targetIdx < 0) targetIdx = slides.length - 1;
            if (targetIdx >= slides.length) targetIdx = 0;

            track.style.transform = `translateX(-${targetIdx * 100}%)`;
            currentIdx = targetIdx;
            updateDots(currentIdx);
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                moveToSlide(currentIdx + 1);
                resetAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                moveToSlide(currentIdx - 1);
                resetAutoplay();
            });
        }

        // Auto Play configuration
        const startAutoplay = () => {
            autoplayTimer = setInterval(() => {
                moveToSlide(currentIdx + 1);
            }, 5000); // 5 seconds interval
        };

        const resetAutoplay = () => {
            clearInterval(autoplayTimer);
            startAutoplay();
        };

        startAutoplay();
    });
}

// 7. Dynamic Gallery Lightbox
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox || galleryItems.length === 0) return;

    const img = lightbox.querySelector('.lightbox-img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Store image elements for active category
    let activeImages = [];
    let currentIdx = 0;

    // Filter Items functionality (Categories Selectors)
    const categoryBtns = document.querySelectorAll('.gallery-category-btn');
    const itemsToFilter = document.querySelectorAll('.gallery-item');

    const updateFilterList = (cat) => {
        activeImages = [];
        itemsToFilter.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            if (cat === 'all' || itemCat === cat) {
                item.style.display = 'block';
                activeImages.push(item);
            } else {
                item.style.display = 'none';
            }
        });
    };

    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                updateFilterList(filter);
            });
        });
    }

    // Set initial list
    updateFilterList('all');

    const openLightbox = (clickedItem) => {
        // Find index of clicked item in the currently active filtered set
        currentIdx = activeImages.indexOf(clickedItem);
        if (currentIdx === -1) return;

        showImage(currentIdx);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const showImage = (idx) => {
        const item = activeImages[idx];
        const placeholderImg = item.querySelector('.gallery-preview-img');
        const label = item.querySelector('.gallery-item-title')?.textContent || '';

        // If it's an SVG (our placeholder design), clone or extract details
        if (placeholderImg) {
            const src = placeholderImg.getAttribute('src');
            img.setAttribute('src', src);
        } else {
            // Find embedded SVG or similar
            const svg = item.querySelector('svg');
            if (svg) {
                // If it's an inline SVG, we serialize it to a data URL for lightbox display
                const svgString = new XMLSerializer().serializeToString(svg);
                const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
                const URL = window.URL || window.webkitURL || window;
                const blobURL = URL.createObjectURL(svgBlob);
                img.setAttribute('src', blobURL);
            }
        }

        caption.textContent = label;
    };

    itemsToFilter.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIdx = (currentIdx - 1 + activeImages.length) % activeImages.length;
            showImage(currentIdx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIdx = (currentIdx + 1) % activeImages.length;
            showImage(currentIdx);
        });
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
}
