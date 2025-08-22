class SlidePresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 7;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.navDots = document.querySelector('.nav-dots');
        this.exportPdfBtn = document.getElementById('exportPdfBtn');
        
        this.init();
    }
    
    init() {
        this.createNavDots();
        this.updateDisplay();
        this.bindEvents();
        this.addKeyboardNavigation();
        this.addUtilityFeatures();
        this.setupPDFExport();
    }
    
    createNavDots() {
        for (let i = 1; i <= this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('nav-dot');
            if (i === 1) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.navDots.appendChild(dot);
        }
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
        
        // Mouse wheel support
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }, 50);
        }, { passive: true });
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'p':
                case 'P':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.exportToPDF();
                    }
                    break;
                case 'f':
                case 'F':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
            }
        });
    }
    
    addUtilityFeatures() {
        // Add progress bar
        this.createProgressBar();
        
        // Add ripple effects to buttons
        this.addRippleEffects();
        
        // Add hover effects to cards
        this.addHoverEffects();
        
        // Add additional styles
        this.addPresentationModeStyles();
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        this.updateProgress();
    }
    
    updateProgress() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
    }
    
    addRippleEffects() {
        const buttons = document.querySelectorAll('.nav-btn, .export-btn, .cta-primary, .cta-secondary');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    addHoverEffects() {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.problem-item, .feature-card, .metric-card')) {
                e.target.style.transform = 'translateY(-5px) scale(1.02)';
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('.problem-item, .feature-card, .metric-card')) {
                e.target.style.transform = 'translateY(0) scale(1)';
            }
        }, true);
    }
    
    addPresentationModeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                z-index: 9999;
            }
            
            .progress-bar .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.6s ease;
            }
            
            .export-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .export-modal-content {
                background: white;
                padding: 40px;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            }
            
            .export-header h3 {
                margin-bottom: 30px;
                color: #2d3748;
            }
            
            .export-progress {
                margin-bottom: 30px;
            }
            
            .export-progress .progress-bar {
                position: static;
                width: 100%;
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 15px;
            }
            
            .export-progress .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.3s ease;
                border-radius: 4px;
            }
            
            .progress-text {
                color: #666;
                font-size: 14px;
            }
            
            .export-tip {
                background: #f8f9ff;
                padding: 15px;
                border-radius: 8px;
                color: #666;
                font-size: 14px;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10001;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            
            .notification.success {
                background: #10b981;
            }
            
            .notification.error {
                background: #ef4444;
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupPDFExport() {
        this.exportPdfBtn.addEventListener('click', () => this.exportToPDF());
    }
    
    async exportToPDF() {
        if (this.isExporting) return;
        
        try {
            this.isExporting = true;
            this.showExportProgress();
            
            // Load libraries
            await this.loadLibraries();
            
            const pdf = new window.jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'A4'
            });
            
            for (let i = 0; i < this.totalSlides; i++) {
                this.updateExportProgress((i + 1) / this.totalSlides * 100, `Exportiere Slide ${i + 1}/${this.totalSlides}`);
                
                await this.addSlideToPDF(pdf, this.slides[i], i > 0);
            }
            
            pdf.save('byght-ai-presentation.pdf');
            
            this.hideExportProgress();
            this.showNotification('✅ PDF erfolgreich erstellt!', 'success');
            
        } catch (error) {
            console.error('PDF Export failed:', error);
            this.hideExportProgress();
            this.showNotification('❌ Fehler beim PDF-Export', 'error');
        } finally {
            this.isExporting = false;
        }
    }
    
    async exportCurrentSlide() {
        try {
            this.showExportProgress();
            this.updateExportProgress(50, 'Aktuelle Slide wird exportiert...');
            
            await this.loadLibraries();
            
            const pdf = new window.jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'A4'
            });
            
            await this.addSlideToPDF(pdf, this.slides[this.currentSlide - 1], false);
            
            this.updateExportProgress(100, 'Fertig!');
            
            pdf.save(`byght-ai-slide-${this.currentSlide}.pdf`);
            
            this.hideExportProgress();
            this.showNotification('✅ Slide als PDF exportiert!', 'success');
            
        } catch (error) {
            console.error('Single slide export failed:', error);
            this.hideExportProgress();
            this.showNotification('❌ Fehler beim Export', 'error');
        }
    }
    
    async loadLibraries() {
        // Load html2canvas
        if (!window.html2canvas) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load html2canvas'));
                document.head.appendChild(script);
            });
        }
        
        // Load jsPDF
        if (!window.jspdf) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load jsPDF'));
                document.head.appendChild(script);
            });
        }
    }
    
    async addSlideToPDF(pdf, slide, addNewPage) {
        const wasActive = slide.classList.contains('active');
        const originalTransform = slide.style.transform;
        const originalOpacity = slide.style.opacity;
        
        // Prepare slide for PDF capture
        this.prepareSlidePDF(slide);
        
        // Make slide visible for capture
        slide.style.transform = 'translateX(0)';
        slide.style.opacity = '1';
        slide.classList.add('active');
        
        // Wait for animations and rendering
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            const canvas = await window.html2canvas(slide, {
                scale: 2.5, // Higher resolution for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: slide.offsetWidth,
                height: slide.offsetHeight,
                letterRendering: true,
                logging: false,
                imageTimeout: 15000,
                removeContainer: false,
                foreignObjectRendering: false,
                onclone: (clonedDoc) => {
                    // Optimize cloned document for PDF
                    this.optimizeClonedDocument(clonedDoc, slide);
                }
            });
            
            if (addNewPage) {
                pdf.addPage();
            }
            
            // Better sizing calculation - less margin for larger content
            const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Reduced margin
            const pdfHeight = pdf.internal.pageSize.getHeight() - 20;
            
            const canvasAspectRatio = canvas.width / canvas.height;
            const pdfAspectRatio = pdfWidth / pdfHeight;
            
            let imgWidth, imgHeight;
            
            if (canvasAspectRatio > pdfAspectRatio) {
                imgWidth = pdfWidth;
                imgHeight = pdfWidth / canvasAspectRatio;
            } else {
                imgHeight = pdfHeight;
                imgWidth = pdfHeight * canvasAspectRatio;
            }
            
            const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
            const y = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;
            
            // Use higher quality JPEG for better compression
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
            
        } finally {
            // Restore original state
            this.restoreSlidePDF(slide);
            if (!wasActive) {
                slide.classList.remove('active');
            }
            slide.style.transform = originalTransform;
            slide.style.opacity = originalOpacity;
        }
    }
    
    prepareSlidePDF(slide) {
        // Add PDF optimization class
        slide.classList.add('pdf-optimized');
        document.body.classList.add('pdf-export-mode');
        
        // Stop all animations for PDF
        const animatedElements = slide.querySelectorAll('*');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            el.style.transitionDuration = '0s';
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
        
        // Fix specific elements for PDF
        const rotatingPill = slide.querySelector('#rotating-pill');
        if (rotatingPill) {
            rotatingPill.style.animation = 'none';
            rotatingPill.style.transform = 'scale(1)';
            // Set to a static standard for PDF
            const pillText = rotatingPill.querySelector('.pill-text');
            if (pillText) {
                pillText.textContent = 'ISO 27001';
                pillText.style.opacity = '1';
            }
        }
        
        // Hide floating elements
        const floatingElements = slide.querySelectorAll('.floating-icon, .floating-elements');
        floatingElements.forEach(el => {
            el.style.display = 'none';
        });
        
        // Ensure all images are loaded
        const images = slide.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.loading = 'eager';
            }
        });
        
        // Fix backdrop filters and gradients
        const elementsWithBackdrop = slide.querySelectorAll('[style*="backdrop-filter"]');
        elementsWithBackdrop.forEach(el => {
            el.style.backdropFilter = 'none';
        });
        
        // Ensure proper contrast for PDF
        const slideContent = slide.querySelector('.slide-content');
        if (slideContent && !slide.classList.contains('title-slide')) {
            slideContent.style.background = 'rgba(255, 255, 255, 0.98)';
        }
    }
    
    optimizeClonedDocument(clonedDoc, originalSlide) {
        const clonedSlide = clonedDoc.querySelector(`[data-slide="${originalSlide.dataset.slide}"]`);
        if (!clonedSlide) return;
        
        // Ensure proper visibility
        clonedSlide.style.transform = 'translateX(0)';
        clonedSlide.style.opacity = '1';
        clonedSlide.classList.add('active');
        
        // Fix fonts
        const textElements = clonedSlide.querySelectorAll('*');
        textElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.fontFamily.includes('Inter')) {
                el.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            }
        });
        
        // Fix gradients for PDF - use solid color instead
        const gradientElements = clonedSlide.querySelectorAll('.gradient-text, .brand-highlight');
        gradientElements.forEach(el => {
            el.style.color = '#667eea';
            el.style.background = 'none';
            el.style.webkitBackgroundClip = 'unset';
            el.style.webkitTextFillColor = 'unset';
            el.style.backgroundClip = 'unset';
        });
        
        // Fix SVG icons
        const svgs = clonedSlide.querySelectorAll('svg');
        svgs.forEach(svg => {
            svg.style.display = 'block';
            svg.setAttribute('width', svg.style.width || '24');
            svg.setAttribute('height', svg.style.height || '24');
        });
        
        // Remove problematic animations
        const animatedElements = clonedSlide.querySelectorAll('*');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
    
    restoreSlidePDF(slide) {
        // Remove PDF optimization classes
        slide.classList.remove('pdf-optimized');
        document.body.classList.remove('pdf-export-mode');
        
        // Restore animations
        const animatedElements = slide.querySelectorAll('*');
        animatedElements.forEach(el => {
            el.style.animationPlayState = '';
            el.style.transitionDuration = '';
            el.style.animation = '';
            el.style.transition = '';
        });
        
        // Restore backdrop filters
        const elementsWithBackdrop = slide.querySelectorAll('[style*="backdrop-filter: none"]');
        elementsWithBackdrop.forEach(el => {
            el.style.backdropFilter = '';
        });
        
        // Restore floating elements
        const floatingElements = slide.querySelectorAll('.floating-icon, .floating-elements');
        floatingElements.forEach(el => {
            el.style.display = '';
        });
        
        // Restore slide content background
        const slideContent = slide.querySelector('.slide-content');
        if (slideContent && !slide.classList.contains('title-slide')) {
            slideContent.style.background = '';
        }
        
        // Restart rotating pill if it exists
        const rotatingPill = slide.querySelector('#rotating-pill');
        if (rotatingPill && slide.dataset.slide === '3') {
            setTimeout(() => {
                if (this.currentSlide === 3) {
                    this.startStandardRotation();
                }
            }, 100);
        }
    }
    
    showExportProgress() {
        const modal = document.createElement('div');
        modal.id = 'export-modal';
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="export-modal-content">
                <div class="export-header">
                    <h3>PDF wird erstellt...</h3>
                </div>
                <div class="export-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="export-progress-fill"></div>
                    </div>
                    <div class="progress-text" id="export-progress-text">Vorbereitung...</div>
                </div>
                <div class="export-tip">
                    <p>💡 Tipp: Der Export kann einige Sekunden dauern.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    updateExportProgress(percentage, text) {
        const progressFill = document.getElementById('export-progress-fill');
        const progressText = document.getElementById('export-progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = text;
        }
    }
    
    hideExportProgress() {
        const modal = document.getElementById('export-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        // Stop any running animations from previous slide
        this.stopStandardRotation();
        
        this.slides[this.currentSlide - 1].classList.remove('active');
        
        if (slideNumber < this.currentSlide) {
            this.slides[this.currentSlide - 1].classList.add('prev');
            setTimeout(() => {
                this.slides[this.currentSlide - 1].classList.remove('prev');
            }, 600);
        }
        
        this.currentSlide = slideNumber;
        this.slides[this.currentSlide - 1].classList.add('active');
        
        this.updateDisplay();
        this.updateProgress();
        this.animateSlideContent();
        
        window.location.hash = `slide-${this.currentSlide}`;
    }
    
    updateDisplay() {
        this.currentSlideSpan.textContent = this.currentSlide;
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide - 1);
        });
        
    }
    
    animateSlideContent() {
        const currentSlideElement = this.slides[this.currentSlide - 1];
        
        // No special animations for title slide anymore
        
        // Special animation for compliance flow slide
        if (this.currentSlide === 3) {
            this.animateComplianceFlow();
            return;
        }
        
        const animatableElements = currentSlideElement.querySelectorAll(
            '.problem-item, .flow-step, .feature-card, .metric-card, .benefit-item'
        );
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }
    
    animateTitleSlide() {
        const titleSlide = this.slides[0];
        const typewriterElement = document.getElementById('typewriter-text');
        
        // Check if slide was already animated to prevent re-animation chaos
        if (titleSlide.dataset.animated === 'true') {
            // Just ensure typewriter text is complete and visible
            if (typewriterElement) {
                typewriterElement.textContent = "Seamlessly manage, implement, and prove compliance through AI-driven automation";
                typewriterElement.style.opacity = '1';
                typewriterElement.style.borderRight = 'none';
            }
            return;
        }
        
        // Mark as animated for future visits
        titleSlide.dataset.animated = 'true';
        
        // Clear any existing typewriter interval
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        // Reset animations only on first visit
        const animatedElements = titleSlide.querySelectorAll('.goodbye-text, .hello-text, .brand-highlight, .animated-subtitle, .tagline-section');
        
        animatedElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = '';
        });
        
        // Reset floating icons with reduced opacity
        const floatingIcons = titleSlide.querySelectorAll('.floating-icon');
        floatingIcons.forEach(icon => {
            icon.style.animation = 'none';
            icon.style.opacity = '0.4'; // More subtle
            icon.offsetHeight; // Trigger reflow
            icon.style.animation = '';
        });
        
        // Reset tagline underline
        const underline = titleSlide.querySelector('.tagline-underline');
        if (underline) {
            underline.style.animation = 'none';
            underline.offsetHeight; // Trigger reflow
            underline.style.animation = '';
        }
        
        // Start typewriter effect with shorter delay
        setTimeout(() => {
            this.startTypewriter();
        }, 2500); // Reduced from 3800ms
    }
    
    startTypewriter() {
        const typewriterElement = document.getElementById('typewriter-text');
        if (!typewriterElement) return;
        
        // Clear any existing interval
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        const text = "Seamlessly manage, implement, and prove compliance through AI-driven automation";
        typewriterElement.textContent = '';
        typewriterElement.style.opacity = '1';
        
        let i = 0;
        const typeSpeed = 35; // Slightly faster for smoother feel
        
        this.typewriterInterval = setInterval(() => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                
                // Remove blinking cursor after typing is complete
                setTimeout(() => {
                    typewriterElement.style.borderRight = 'none';
                }, 800);
            }
        }, typeSpeed);
    }
    
    animateComplianceFlow() {
        const flowSteps = document.querySelectorAll('.flow-step');
        const flowArrows = document.querySelectorAll('.flow-arrow');
        
        // Reset and animate flow steps
        flowSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                step.style.transition = 'all 0.8s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, index * 300 + 200);
        });
        
        // Animate arrows
        flowArrows.forEach((arrow, index) => {
            arrow.style.opacity = '0';
            arrow.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                arrow.style.transition = 'all 0.6s ease';
                arrow.style.opacity = '0.7';
                arrow.style.transform = 'scale(1)';
            }, index * 300 + 500);
        });
        
        // Start rotating standards after initial animation
        setTimeout(() => {
            this.startStandardRotation();
        }, 1500);
    }
    
    startStandardRotation() {
        // Stop any existing rotation first
        this.stopStandardRotation();
        
        const rotatingPill = document.getElementById('rotating-pill');
        if (!rotatingPill) return;
        
        const standards = [
            { name: 'ISO 27001', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: 'rgba(102, 126, 234, 0.4)' },
            { name: 'BSI C5', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.4)' },
            { name: 'DORA', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.4)' },
            { name: 'NIS-2', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.4)' },
            { name: 'GDPR', color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.4)' },
            { name: 'SOC 2', color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', shadow: 'rgba(6, 182, 212, 0.4)' },
            { name: 'PCI DSS', color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', shadow: 'rgba(249, 115, 22, 0.4)' }
        ];
        
        let currentIndex = 0;
        
        const rotateStandard = () => {
            // Check if pill still exists (slide might have changed)
            if (!document.getElementById('rotating-pill')) {
                this.stopStandardRotation();
                return;
            }
            
            const pillText = rotatingPill.querySelector('.pill-text');
            if (!pillText) return;
            
            const nextStandard = standards[currentIndex];
            
            // Add smooth transition effects with better timing
            rotatingPill.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            pillText.style.transition = 'opacity 0.3s ease';
            
            rotatingPill.style.transform = 'scale(0.95)';
            pillText.style.opacity = '0';
            
            setTimeout(() => {
                // Double-check element still exists
                if (!document.getElementById('rotating-pill')) return;
                
                // Change text, color and shadow
                pillText.textContent = nextStandard.name;
                rotatingPill.style.background = nextStandard.color;
                rotatingPill.style.boxShadow = `0 4px 15px ${nextStandard.shadow}`;
                
                // Scale back and fade in
                rotatingPill.style.transform = 'scale(1)';
                pillText.style.opacity = '1';
                
                currentIndex = (currentIndex + 1) % standards.length;
            }, 300); // Increased timing for smoother transition
        };
        
        // Initialize with first standard
        const pillText = rotatingPill.querySelector('.pill-text');
        if (pillText) {
            pillText.textContent = standards[0].name;
            rotatingPill.style.background = standards[0].color;
            rotatingPill.style.boxShadow = `0 4px 15px ${standards[0].shadow}`;
        }
        
        // Start with a subtle glow animation
        rotatingPill.style.animation = 'pillGlow 4s ease-in-out infinite';
        
        // Start rotation cycle with more consistent timing
        this.standardRotationInterval = setInterval(rotateStandard, 3000); // Increased from 2500ms to 3000ms
    }
    
    stopStandardRotation() {
        if (this.standardRotationInterval) {
            clearInterval(this.standardRotationInterval);
            this.standardRotationInterval = null;
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    handleHashChange() {
        const hash = window.location.hash;
        if (hash.startsWith('#slide-')) {
            const slideNumber = parseInt(hash.replace('#slide-', ''));
            if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
                this.goToSlide(slideNumber);
            }
        }
    }
    
    forceLayoutRecalculation() {
        // Force browser to recalculate layout and centering
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            // Trigger reflow by reading offsetHeight
            slide.offsetHeight;
            
            // Force re-centering by temporarily changing display
            const slideContent = slide.querySelector('.slide-content');
            if (slideContent) {
                const originalDisplay = slideContent.style.display;
                slideContent.style.display = 'none';
                slideContent.offsetHeight; // Force reflow
                slideContent.style.display = originalDisplay || '';
            }
        });
        
        // Also trigger a resize event to ensure responsive calculations
        window.dispatchEvent(new Event('resize'));
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const presentation = new SlidePresentation();
    
    // Force layout recalculation after a short delay
    setTimeout(() => {
        presentation.forceLayoutRecalculation();
        // Title slide now works without special animations
    }, 100);
    
    // Handle browser navigation
    window.addEventListener('hashchange', () => {
        presentation.handleHashChange();
    });
    
    // Check if there's a hash on page load
    if (window.location.hash) {
        presentation.handleHashChange();
    }
    
    // Also recalculate on window load (when all resources are loaded)
    window.addEventListener('load', () => {
        setTimeout(() => {
            presentation.forceLayoutRecalculation();
        }, 50);
    });
    
    // Handle window resize to maintain centering
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            presentation.forceLayoutRecalculation();
        }, 150);
    });
    
    // Add CTA button functionality
    const scheduleDemo = document.getElementById('schedule-demo');
    const learnMore = document.getElementById('learn-more');
    
    if (scheduleDemo) {
        scheduleDemo.addEventListener('click', () => {
            window.open('https://byght.ai', '_blank');
        });
    }
    
    if (learnMore) {
        learnMore.addEventListener('click', () => {
            window.open('https://byght.ai', '_blank');
        });
    }
    
    console.log('🎯 byght.ai Presentation loaded successfully!');
    console.log('Navigation: Arrow keys, Space, Mouse wheel, Touch swipe');
    console.log('Shortcuts: Home, End, Ctrl+F (fullscreen), Ctrl+P (PDF export)');
});