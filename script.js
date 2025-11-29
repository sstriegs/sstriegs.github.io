// Cache DOM elements
const lightbox = document.querySelector('.lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');
const counter = document.querySelector('.lightbox-counter');
const title = document.querySelector('.lightbox-title');

// State management
let currentProject = null;
let currentIndex = 0;
let mediaItems = [];

// Project details toggle functionality
function toggleDetails(row) {
    row.classList.toggle('expanded');
    const detailsRow = row.nextElementSibling;
    if (detailsRow?.classList.contains('project-details')) {
        detailsRow.classList.toggle('show');
        // Ensure links are moved on mobile when expanding
        if (window.innerWidth <= 768) {
            setTimeout(() => moveLinksToMobile(), 0);
        }
    }
}

// Expand/collapse all projects
function expandAll() {
    document.querySelectorAll('.project-row').forEach(row => {
        row.classList.add('expanded');
        const detailsRow = row.nextElementSibling;
        if (detailsRow?.classList.contains('project-details')) {
            detailsRow.classList.add('show');
        }
    });
}

function collapseAll() {
    document.querySelectorAll('.project-row').forEach(row => {
        row.classList.remove('expanded');
        const detailsRow = row.nextElementSibling;
        if (detailsRow?.classList.contains('project-details')) {
            detailsRow.classList.remove('show');
        }
    });
}

// Lightbox functionality
function formatNumber(num) {
    return num.toString().padStart(2, '0');
}

function updateCounter() {
    counter.textContent = `${formatNumber(currentIndex + 1)} / ${formatNumber(mediaItems.length)}`;
}

function openLightbox(mediaElement) {
    const thumbnail = mediaElement.closest('.project-thumbnail');
    const projectDetails = thumbnail.closest('.project-details');
    const projectRow = projectDetails.previousElementSibling;
    
    currentProject = projectRow;
    mediaItems = Array.from(projectDetails.querySelectorAll('.project-thumbnail img, .project-thumbnail video'));
    currentIndex = mediaItems.indexOf(mediaElement);
    
    title.textContent = projectRow.querySelector('.project-title').textContent;
    
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxContent() {
    const media = mediaItems[currentIndex];
    const clone = media.cloneNode(true);
    
    if (clone.tagName === 'VIDEO') {
        clone.autoplay = true;
        clone.loop = true;
        clone.muted = true;
        clone.controls = false;
    }
    
    lightboxContent.innerHTML = '';
    
    // Add navigation zones
    const leftZone = document.createElement('div');
    leftZone.className = 'lightbox-navigation-zone left';
    leftZone.addEventListener('click', prevMedia);
    
    const rightZone = document.createElement('div');
    rightZone.className = 'lightbox-navigation-zone right';
    rightZone.addEventListener('click', nextMedia);
    
    lightboxContent.appendChild(leftZone);
    lightboxContent.appendChild(clone);
    lightboxContent.appendChild(rightZone);
    
    updateCounter();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    currentProject = null;
    currentIndex = 0;
    mediaItems = [];
    title.textContent = '';
}

function prevMedia() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
    updateLightboxContent();
}

function nextMedia() {
    currentIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
    updateLightboxContent();
}

// Move links below thumbnails on mobile
function moveLinksToMobile() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.project-row').forEach(row => {
            const linksDiv = row.querySelector('.links');
            const detailsRow = row.nextElementSibling;
            
            if (linksDiv && detailsRow?.classList.contains('project-details')) {
                const projectDetailsContent = detailsRow.querySelector('.project-details-content');
                const thumbnails = projectDetailsContent?.querySelector('.project-thumbnails');
                
                // Remove existing mobile links if any
                const existingMobileLinks = projectDetailsContent?.querySelector('.links-mobile');
                if (existingMobileLinks) {
                    existingMobileLinks.remove();
                }
                
                // Clone and move links after thumbnails (only if links exist and thumbnails exist)
                if (thumbnails && linksDiv.innerHTML.trim()) {
                    const mobileLinks = linksDiv.cloneNode(true);
                    mobileLinks.classList.add('links-mobile');
                    mobileLinks.classList.remove('links');
                    thumbnails.parentNode.insertBefore(mobileLinks, thumbnails.nextSibling);
                }
            }
        });
    } else {
        // Remove mobile links on desktop
        document.querySelectorAll('.links-mobile').forEach(link => link.remove());
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Move links to mobile position
    moveLinksToMobile();
    
    // Handle expanded rows
    document.querySelectorAll('.project-row.expanded').forEach(row => {
        const detailsRow = row.nextElementSibling;
        if (detailsRow?.classList.contains('project-details')) {
            detailsRow.classList.add('show');
        }
    });

    // Media click handlers
    document.querySelectorAll('.project-thumbnail img, .project-thumbnail video').forEach(media => {
        media.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(e.target);
        });
    });

    // Lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevMedia);
    nextBtn.addEventListener('click', nextMedia);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': prevMedia(); break;
            case 'ArrowRight': nextMedia(); break;
        }
    });

    // Close lightbox when clicking outside content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Handle window resize to move links on mobile
    window.addEventListener('resize', moveLinksToMobile);
});

// Update time
function updateTime() {
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }
}

// Update time immediately and then every minute
updateTime();
setInterval(updateTime, 60000);
