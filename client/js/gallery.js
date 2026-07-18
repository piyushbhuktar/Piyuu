const API_URL = "https://piyuu-ripg.onrender.com?sslmode=require/api/gallery";

let allGalleryItems = [];
let currentFolderItems = [];
let currentViewerIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Load gallery counts
    loadGalleryData();

    // Setup Folder Clicks
    const folderCards = document.querySelectorAll(".folder-card");
    folderCards.forEach(card => {
        card.addEventListener("click", () => {
            const folderName = card.getAttribute("data-folder");
            openGalleryFolder(folderName);
        });
    });

    // Close Modal Event
    const closeBtn = document.getElementById("modalCloseBtn");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeGalleryModal);
    }

    // Close Fullscreen Viewer Event
    const viewerClose = document.getElementById("viewerCloseBtn");
    if (viewerClose) {
        viewerClose.addEventListener("click", closeMediaViewer);
    }

    // Media Viewer Navigation
    const prevBtn = document.getElementById("viewerPrevBtn");
    const nextBtn = document.getElementById("viewerNextBtn");

    if (prevBtn) {
        prevBtn.addEventListener("click", showPrevMedia);
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", showNextMedia);
    }

    // Keypress support inside viewer
    document.addEventListener("keydown", (e) => {
        const viewer = document.getElementById("mediaViewer");
        if (viewer && viewer.classList.contains("active")) {
            if (e.key === "ArrowLeft") showPrevMedia();
            if (e.key === "ArrowRight") showNextMedia();
            if (e.key === "Escape") closeMediaViewer();
        }
    });
});

// Fetch gallery items from Server API
async function loadGalleryData() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();
        allGalleryItems = await res.json();

        // Separate folder lists
        const achievements = allGalleryItems.filter(item => item.folder === "achievements");
        const performances = allGalleryItems.filter(item => item.folder === "performances");



        // Set cover photos from cover flag or latest image fallback
        updateFolderCover("achievements", achievements);
        updateFolderCover("performances", performances);

    } catch (err) {
        console.error("Error loading gallery data:", err);
        document.getElementById("count-achievements").innerText = "0 files";
        document.getElementById("count-performances").innerText = "0 files";
    }
}

function updateFolderCover(folderName, items) {
    const card = document.querySelector(`.folder-card[data-folder="${folderName}"]`);
    if (!card) return;

    // 1. Find item marked explicitly as cover
    let coverItem = items.find(item => item.is_cover === true && item.media_type === "image");

    // 2. Fallback to the latest image if no explicit cover is set
    if (!coverItem) {
        coverItem = items.find(item => item.media_type === "image");
    }

    if (coverItem) {
        card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.8)), url('${coverItem.media_url}')`;
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";
    } else {
        // Reset to default style if empty
        card.style.backgroundImage = "";
    }
}

// Open folder grid list
function openGalleryFolder(folderName) {
    const modal = document.getElementById("galleryModal");
    const modalTitle = document.getElementById("modalTitle");
    const grid = document.getElementById("lightboxGrid");

    if (!modal || !grid) return;

    // Filter items
    currentFolderItems = allGalleryItems.filter(item => item.folder === folderName);

    // Update title
    modalTitle.innerText = folderName === "achievements" ? "🏆 Achievements Album" : "🎭 Performances Album";

    // Clear grid
    grid.innerHTML = "";

    if (currentFolderItems.length === 0) {
        grid.innerHTML = `<div class="empty-gallery">No photos or videos added to this album yet.</div>`;
    } else {
        currentFolderItems.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "lightbox-card";
            card.addEventListener("click", () => openMediaViewer(index));

            if (item.media_type === "video") {
                card.innerHTML = `
                    <div class="media-container">
                        <video src="${item.media_url}" preload="metadata"></video>
                        <div class="play-overlay"><i class="fa-solid fa-play"></i></div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="media-container">
                        <img src="${item.media_url}" alt="Gallery Photo" onerror="this.src='assets/images/logo1.png';">
                    </div>
                `;
            }
            grid.appendChild(card);
        });
    }

    // Open Modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable background scrolling
}

// Close Modal
function closeGalleryModal() {
    const modal = document.getElementById("galleryModal");
    if (modal) {
        modal.classList.remove("active");
    }
    document.body.style.overflow = ""; // Enable scrolling
}

// Open fullscreen media viewer
function openMediaViewer(index) {
    currentViewerIndex = index;
    const viewer = document.getElementById("mediaViewer");
    const content = document.getElementById("viewerContent");

    if (!viewer || !content) return;

    renderViewerMedia();
    viewer.classList.add("active");
}

function renderViewerMedia() {
    const content = document.getElementById("viewerContent");
    const item = currentFolderItems[currentViewerIndex];

    content.innerHTML = "";

    if (item.media_type === "video") {
        content.innerHTML = `
            <video src="${item.media_url}" controls autoplay class="viewer-media-element"></video>
        `;
    } else {
        content.innerHTML = `
            <img src="${item.media_url}" alt="Fullscreen Image" class="viewer-media-element" onerror="this.src='assets/images/logo1.png';">
        `;
    }
}

// Close fullscreen media viewer
function closeMediaViewer() {
    const viewer = document.getElementById("mediaViewer");
    const content = document.getElementById("viewerContent");

    if (viewer) {
        viewer.classList.remove("active");
    }
    if (content) {
        // Pause any video that is playing
        const video = content.querySelector("video");
        if (video) video.pause();
        content.innerHTML = "";
    }
}

// Navigate Viewer Left
function showPrevMedia() {
    if (currentFolderItems.length <= 1) return;
    currentViewerIndex--;
    if (currentViewerIndex < 0) {
        currentViewerIndex = currentFolderItems.length - 1;
    }
    renderViewerMedia();
}

// Navigate Viewer Right
function showNextMedia() {
    if (currentFolderItems.length <= 1) return;
    currentViewerIndex++;
    if (currentViewerIndex >= currentFolderItems.length) {
        currentViewerIndex = 0;
    }
    renderViewerMedia();
}
