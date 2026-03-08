// --- Interaction Layer: Peach Tree Clinic ---

// 1. Intersection Observer for smooth, low-sensory fade-ins
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize fade-ins
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Initialize Impact Counters
    initCounters();

    // Initialize Protocol Level Toggle
    initProtocolToggle();

    // Initialize Site-Wide Winding Thread
    initSiteThread();

    // Initialize Mobile Menu
    initMobileMenu();
});

// 1.5 Mobile Menu Toggle
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    const links = document.querySelectorAll('.nav-links a');

    if (!toggle || !nav || !overlay) return;

    const toggleMenu = () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    };

    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// 2. Gentle Number Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const target = +targetElement.getAttribute('data-target');

                const updateCount = () => {
                    const current = +targetElement.innerText;
                    const inc = target / speed;

                    if (current < target) {
                        targetElement.innerText = Math.ceil(current + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        targetElement.innerText = target;
                    }
                };

                updateCount();
                obs.unobserve(targetElement); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// 3. Protocol Level Toggle Logic
function initProtocolToggle() {
    const tabs = document.querySelectorAll('.level-tab');
    const contentBox = document.getElementById('level-description');

    const contentData = {
        "1": "<strong>Gentle Support:</strong> Focused on foundational guidance. Minor adjustments to environment and routine, empowering parents and teachers to support natural development.",
        "2": "<strong>Focused Support:</strong> Direct, targeted intervention across specific disciplines. Building core skills while providing moderate accommodations in the classroom.",
        "3": "<strong>Comprehensive Support:</strong> Intensive, wrap-around care. A fully integrated multidisciplinary approach designed for significant developmental, communication, or learning needs."
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');

            // Update content with gentle fade
            const level = tab.getAttribute('data-level');
            contentBox.style.opacity = '0';

            setTimeout(() => {
                contentBox.innerHTML = contentData[level];
                contentBox.style.opacity = '1';
            }, 300); // Wait for fade out
        });
    });
}

// 4. Smart Intake Logic
window.nextIntakeStep = function (selection) {
    const step1 = document.getElementById('intake-step-1');
    const step2 = document.getElementById('intake-step-2');

    // Gentle transition
    step1.style.opacity = '0';
    setTimeout(() => {
        step1.classList.remove('active');
        step1.classList.add('hidden');

        step2.classList.remove('hidden');
        step2.classList.add('active');
        // small delay to allow display:block to apply before animating opacity
        setTimeout(() => {
            step2.style.opacity = '1';
        }, 50);
    }, 300);
};

window.showCalendly = function () {
    const step2 = document.getElementById('intake-step-2');
    const calendlyBlock = document.getElementById('calendly-block');

    // Gentle transition
    step2.style.opacity = '0';
    setTimeout(() => {
        step2.classList.remove('active');
        step2.classList.add('hidden');

        calendlyBlock.classList.remove('hidden');
        calendlyBlock.classList.add('active');

        setTimeout(() => {
            calendlyBlock.style.opacity = '1';
        }, 50);
    }, 300);
};

// 5. Global Site-Wide Winding Thread (Maze/Snake Effect)
function initSiteThread() {
    const threadPath = document.getElementById('global-thread-path');
    if (!threadPath) return;

    const sections = [
        'home',
        'protocol',
        'services',
        'legacy',
        'reach',
        'bookings',
        'partnerships'
    ];

    const drawThread = () => {
        const fullHeight = document.documentElement.scrollHeight;
        const width = document.documentElement.clientWidth;

        // Ensure container spans the whole page so SVG doesn't cut off
        const container = document.querySelector('.global-thread-container');
        if (container) {
            container.style.height = `${fullHeight}px`;
        }

        // Start point: inside the bottom knot to guarantee overlap
        const balloonEl = document.querySelector('.balloon-container');
        if (!balloonEl) return;

        const bRect = balloonEl.getBoundingClientRect();
        // Start securely inside the bottom knot edge, combining with z-index: 0 to tuck it safely behind
        const startY = bRect.top + window.scrollY + (bRect.height * 0.94);
        const startX = bRect.left + (bRect.width / 2);

        let d = `M ${startX} ${startY}`;

        let prevX = startX;
        let prevY = startY;

        // Custom Path to end exactly at the top of 'How We Grow' section to avoid text overlap
        const protocolSection = document.getElementById('protocol');

        if (protocolSection) {
            const pRect = protocolSection.getBoundingClientRect();
            const endY = pRect.top + window.scrollY + 200; // Extends deeper into the section
            const endX = width * 0.7; // Keep it on the right side where the image is

            // Gentle curve down to the section top
            const cp1X = prevX + 50;
            const cp1Y = prevY + (endY - prevY) * 0.5;

            const cp2X = endX - 50;
            const cp2Y = prevY + (endY - prevY) * 0.5;

            d += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
        }

        threadPath.setAttribute('d', d);
    };

    // Use requestAnimationFrame for a buttery smooth pin to the animating balloon
    const loopThread = () => {
        drawThread();
        requestAnimationFrame(loopThread);
    };

    // Start the animation loop
    loopThread();

    // Redraw on resize (handled continuously by loop but good for full reflow)
    window.addEventListener('resize', drawThread);
}
