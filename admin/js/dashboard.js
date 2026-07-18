// API Base URL
const BASE_URL = "https://piyuu-ripg.onrender.com/api";

// State variables
let editingWorkshop = false;
let editingPerformance = false;
let editingAudition = false;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Verify Authentication
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Set admin details
    document.getElementById("adminUsername").innerText = username || "Admin";
    document.getElementById("currentDate").innerText = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Mobile Sidebar Elements
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggleBtn = document.getElementById("sidebarToggleBtn");
    const closeBtn = document.getElementById("sidebarCloseBtn");

    if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.add("active");
            overlay.classList.add("active");
        });
    }

    const closeMobileSidebar = () => {
        if (sidebar && overlay) {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        }
    };

    if (closeBtn) {
        closeBtn.addEventListener("click", closeMobileSidebar);
    }
    if (overlay) {
        overlay.addEventListener("click", closeMobileSidebar);
    }

    // 2. Tab Navigation Setup
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
            closeMobileSidebar();
        });
    });

    // 3. Setup Form Submit Event Listeners
    setupWorkshopForms();
    setupPerformanceForms();
    setupAuditionForms();
    setupGalleryForms();

    // 4. Initial Data Load
    loadDashboardData();

    // Auto-refresh stats and tables every 10 seconds for real-time updates
    setInterval(loadDashboardData, 10000);
});

// Tab Switcher
function switchTab(tabId) {
    // Update active class on sidebar buttons
    document.querySelectorAll(".menu-item").forEach(btn => {
        if (btn.getAttribute("data-tab") === tabId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Update active class on content sections
    document.querySelectorAll(".tab-content").forEach(content => {
        if (content.id === `tab-${tabId}`) {
            content.classList.add("active");
        } else {
            content.classList.remove("active");
        }
    });

    // Update Page Header Title
    const titles = {
        overview: "Dashboard Overview",
        workshops: "Workshops Management",
        performances: "Performances Management",
        auditions: "Auditions Management",
        registrations: "Course Registrations",
        gallery: "Gallery Manager"
    };
    document.getElementById("pageTitle").innerText = titles[tabId] || "Dashboard";
}

// Load workshops, performances, auditions, registrations, and gallery for metrics and tables
async function loadDashboardData() {
    try {
        const workshops = await fetchWorkshops();
        const performances = await fetchPerformances();
        const auditions = await fetchAuditions();
        const registrations = await fetchRegistrations();
        const galleryItems = await fetchGallery();

        // Update Overview Cards
        document.getElementById("statWorkshopsCount").innerText = workshops.length;
        document.getElementById("statPerformancesCount").innerText = performances.length;
        document.getElementById("statAuditionsCount").innerText = auditions.length;
        document.getElementById("statRegistrationsCount").innerText = registrations.length;
        document.getElementById("statGalleryCount").innerText = galleryItems.length;

        // Render lists in tables
        renderWorkshopsTable(workshops);
        renderPerformancesTable(performances);
        renderAuditionsTable(auditions);
        renderRegistrationsTable(registrations);
        renderGalleryTable(galleryItems);

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        showToast("Failed to connect to the backend server.", "error");
    }
}

/* ==========================================================================
   WORKSHOPS MANAGEMENT
   ========================================================================== */

async function fetchWorkshops() {
    const res = await fetch(`${BASE_URL}/workshops`);
    if (!res.ok) throw new Error("Failed to load workshops");
    return await res.json();
}

function renderWorkshopsTable(workshops) {
    const tbody = document.getElementById("workshopTableBody");
    tbody.innerHTML = "";

    if (workshops.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9f9f9f;">No workshops found.</td></tr>`;
        return;
    }

    workshops.forEach(w => {
        const row = document.createElement("tr");
        
        // Image Column
        const imgCell = document.createElement("td");
        if (w.image_url) {
            imgCell.innerHTML = `<img src="${w.image_url}" alt="${w.title}" class="thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                 <div class="fallback-thumbnail" style="display:none;"><i class="fa-solid fa-graduation-cap"></i></div>`;
        } else {
            imgCell.innerHTML = `<div class="fallback-thumbnail"><i class="fa-solid fa-graduation-cap"></i></div>`;
        }
        row.appendChild(imgCell);

        // Title
        const titleCell = document.createElement("td");
        titleCell.className = "table-title";
        titleCell.innerText = w.title;
        row.appendChild(titleCell);

        // Date
        const dateCell = document.createElement("td");
        dateCell.className = "table-date";
        dateCell.innerText = formatDate(w.event_date);
        row.appendChild(dateCell);

        // Description
        const descCell = document.createElement("td");
        descCell.className = "table-desc";
        descCell.innerText = w.description || "-";
        row.appendChild(descCell);

        // Actions
        const actionsCell = document.createElement("td");
        actionsCell.className = "table-actions";
        actionsCell.innerHTML = `
            <button onclick="editWorkshop(${w.id})" class="table-btn edit" title="Edit Workshop">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteWorkshop(${w.id})" class="table-btn delete" title="Delete Workshop">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function setupWorkshopForms() {
    const form = document.getElementById("workshopForm");
    const cancelBtn = document.getElementById("workshopCancelBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        const id = document.getElementById("workshopId").value;
        let imageUrl = document.getElementById("workshopImageUrl").value.trim();

        const submitBtn = document.getElementById("workshopSubmitBtn");
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Saving...";

        try {
            const fileInput = document.getElementById("workshopFile");
            if (fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append("mediaFile", fileInput.files[0]);

                const uploadRes = await fetch(`${BASE_URL}/gallery/upload`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (!uploadRes.ok) {
                    const uploadErr = await uploadRes.json();
                    throw new Error(uploadErr.message || "File upload failed.");
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.fileUrl;
            } else if (!editingWorkshop) {
                throw new Error("Please choose an image file to upload.");
            }

            const workshopData = {
                title: document.getElementById("workshopTitle").value.trim(),
                event_date: document.getElementById("workshopDate").value,
                image_url: imageUrl,
                description: document.getElementById("workshopDescription").value.trim()
            };

            let res;
            if (editingWorkshop) {
                // UPDATE
                res = await fetch(`${BASE_URL}/workshops/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(workshopData)
                });
            } else {
                // CREATE
                res = await fetch(`${BASE_URL}/workshops`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(workshopData)
                });
            }

            if (res.ok) {
                showToast(
                    editingWorkshop ? "Workshop updated successfully!" : "Workshop added successfully!",
                    "success"
                );
                resetWorkshopForm();
                loadDashboardData();
            } else {
                const errData = await res.json();
                if (res.status === 401 || res.status === 403) {
                    showToast("Session expired. Please log in again.", "error");
                    handleLogout();
                } else {
                    showToast(errData.message || "Failed to save workshop.", "error");
                }
            }
        } catch (error) {
            console.error("Error saving workshop:", error);
            showToast(error.message || "Request failed.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    cancelBtn.addEventListener("click", resetWorkshopForm);
}

async function editWorkshop(id) {
    try {
        const res = await fetch(`${BASE_URL}/workshops`);
        if (!res.ok) throw new Error();
        const list = await res.json();
        const item = list.find(w => w.id === id);

        if (!item) {
            showToast("Workshop not found.", "error");
            return;
        }

        // Prefill form
        document.getElementById("workshopId").value = item.id;
        document.getElementById("workshopTitle").value = item.title;
        document.getElementById("workshopDate").value = item.event_date.split("T")[0];
        document.getElementById("workshopImageUrl").value = item.image_url || "";
        document.getElementById("workshopDescription").value = item.description || "";

        // UI Adjustments
        document.getElementById("workshopFormTitle").innerText = "Edit Workshop";
        document.getElementById("workshopSubmitBtn").innerText = "Update Workshop";
        document.getElementById("workshopCancelBtn").classList.remove("hidden");
        editingWorkshop = true;

        // Scroll to form
        document.querySelector(".form-card").scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        showToast("Error retrieving workshop data.", "error");
    }
}

async function deleteWorkshop(id) {
    if (!confirm("Are you sure you want to delete this workshop?")) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/workshops/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            showToast("Workshop deleted successfully!", "success");
            loadDashboardData();
        } else {
            if (res.status === 401 || res.status === 403) {
                showToast("Session expired. Please log in again.", "error");
                handleLogout();
            } else {
                showToast("Failed to delete workshop.", "error");
            }
        }
    } catch (err) {
        showToast("Server error during deletion.", "error");
    }
}

function resetWorkshopForm() {
    document.getElementById("workshopForm").reset();
    document.getElementById("workshopId").value = "";
    document.getElementById("workshopImageUrl").value = "";
    document.getElementById("workshopFormTitle").innerText = "Add Workshop";
    document.getElementById("workshopSubmitBtn").innerText = "Add Workshop";
    document.getElementById("workshopCancelBtn").classList.add("hidden");
    editingWorkshop = false;
}


/* ==========================================================================
   PERFORMANCES MANAGEMENT
   ========================================================================== */

async function fetchPerformances() {
    const res = await fetch(`${BASE_URL}/performances`);
    if (!res.ok) throw new Error("Failed to load performances");
    return await res.json();
}

function renderPerformancesTable(performances) {
    const tbody = document.getElementById("performanceTableBody");
    tbody.innerHTML = "";

    if (performances.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9f9f9f;">No performances found.</td></tr>`;
        return;
    }

    performances.forEach(p => {
        const row = document.createElement("tr");

        // Image Column
        const imgCell = document.createElement("td");
        if (p.image_url) {
            imgCell.innerHTML = `<img src="${p.image_url}" alt="${p.title}" class="thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                 <div class="fallback-thumbnail" style="display:none;"><i class="fa-solid fa-clapperboard"></i></div>`;
        } else {
            imgCell.innerHTML = `<div class="fallback-thumbnail"><i class="fa-solid fa-clapperboard"></i></div>`;
        }
        row.appendChild(imgCell);

        // Title
        const titleCell = document.createElement("td");
        titleCell.className = "table-title";
        titleCell.innerText = p.title;
        row.appendChild(titleCell);

        // Date
        const dateCell = document.createElement("td");
        dateCell.className = "table-date";
        dateCell.innerText = formatDate(p.event_date);
        row.appendChild(dateCell);

        // Description
        const descCell = document.createElement("td");
        descCell.className = "table-desc";
        descCell.innerText = p.description || "-";
        row.appendChild(descCell);

        // Actions
        const actionsCell = document.createElement("td");
        actionsCell.className = "table-actions";
        actionsCell.innerHTML = `
            <button onclick="editPerformance(${p.id})" class="table-btn edit" title="Edit Performance">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deletePerformance(${p.id})" class="table-btn delete" title="Delete Performance">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function setupPerformanceForms() {
    const form = document.getElementById("performanceForm");
    const cancelBtn = document.getElementById("performanceCancelBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        const id = document.getElementById("performanceId").value;
        let imageUrl = document.getElementById("performanceImageUrl").value.trim();

        const submitBtn = document.getElementById("performanceSubmitBtn");
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Saving...";

        try {
            const fileInput = document.getElementById("performanceFile");
            if (fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append("mediaFile", fileInput.files[0]);

                const uploadRes = await fetch(`${BASE_URL}/gallery/upload`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (!uploadRes.ok) {
                    const uploadErr = await uploadRes.json();
                    throw new Error(uploadErr.message || "File upload failed.");
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.fileUrl;
            } else if (!editingPerformance) {
                throw new Error("Please choose an image file to upload.");
            }

            const performanceData = {
                title: document.getElementById("performanceTitle").value.trim(),
                event_date: document.getElementById("performanceDate").value,
                image_url: imageUrl,
                description: document.getElementById("performanceDescription").value.trim()
            };

            let res;
            if (editingPerformance) {
                // UPDATE
                res = await fetch(`${BASE_URL}/performances/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(performanceData)
                });
            } else {
                // CREATE
                res = await fetch(`${BASE_URL}/performances`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(performanceData)
                });
            }

            if (res.ok) {
                showToast(
                    editingPerformance ? "Performance updated successfully!" : "Performance added successfully!",
                    "success"
                );
                resetPerformanceForm();
                loadDashboardData();
            } else {
                const errData = await res.json();
                if (res.status === 401 || res.status === 403) {
                    showToast("Session expired. Please log in again.", "error");
                    handleLogout();
                } else {
                    showToast(errData.message || "Failed to save performance.", "error");
                }
            }
        } catch (error) {
            console.error("Error saving performance:", error);
            showToast(error.message || "Request failed.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    cancelBtn.addEventListener("click", resetPerformanceForm);
}

async function editPerformance(id) {
    try {
        const res = await fetch(`${BASE_URL}/performances`);
        if (!res.ok) throw new Error();
        const list = await res.json();
        const item = list.find(p => p.id === id);

        if (!item) {
            showToast("Performance not found.", "error");
            return;
        }

        // Prefill form
        document.getElementById("performanceId").value = item.id;
        document.getElementById("performanceTitle").value = item.title;
        document.getElementById("performanceDate").value = item.event_date.split("T")[0];
        document.getElementById("performanceImageUrl").value = item.image_url || "";
        document.getElementById("performanceDescription").value = item.description || "";

        // UI Adjustments
        document.getElementById("performanceFormTitle").innerText = "Edit Performance";
        document.getElementById("performanceSubmitBtn").innerText = "Update Performance";
        document.getElementById("performanceCancelBtn").classList.remove("hidden");
        editingPerformance = true;

        // Scroll to form
        document.querySelector("#tab-performances .form-card").scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        showToast("Error retrieving performance data.", "error");
    }
}

async function deletePerformance(id) {
    if (!confirm("Are you sure you want to delete this performance?")) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/performances/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            showToast("Performance deleted successfully!", "success");
            loadDashboardData();
        } else {
            if (res.status === 401 || res.status === 403) {
                showToast("Session expired. Please log in again.", "error");
                handleLogout();
            } else {
                showToast("Failed to delete performance.", "error");
            }
        }
    } catch (err) {
        showToast("Server error during deletion.", "error");
    }
}

function resetPerformanceForm() {
    document.getElementById("performanceForm").reset();
    document.getElementById("performanceId").value = "";
    document.getElementById("performanceImageUrl").value = "";
    document.getElementById("performanceFormTitle").innerText = "Add Performance";
    document.getElementById("performanceSubmitBtn").innerText = "Add Performance";
    document.getElementById("performanceCancelBtn").classList.add("hidden");
    editingPerformance = false;
}


/* ==========================================================================
   AUDITIONS MANAGEMENT
   ========================================================================== */

async function fetchAuditions() {
    const res = await fetch(`${BASE_URL}/auditions`);
    if (!res.ok) throw new Error("Failed to load auditions");
    return await res.json();
}

function renderAuditionsTable(auditions) {
    const tbody = document.getElementById("auditionTableBody");
    tbody.innerHTML = "";

    if (auditions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9f9f9f;">No auditions found.</td></tr>`;
        return;
    }

    auditions.forEach(a => {
        const row = document.createElement("tr");

        // Image Column
        const imgCell = document.createElement("td");
        if (a.image_url) {
            imgCell.innerHTML = `<img src="${a.image_url}" alt="${a.title}" class="thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                 <div class="fallback-thumbnail" style="display:none;"><i class="fa-solid fa-bullhorn"></i></div>`;
        } else {
            imgCell.innerHTML = `<div class="fallback-thumbnail"><i class="fa-solid fa-bullhorn"></i></div>`;
        }
        row.appendChild(imgCell);

        // Title
        const titleCell = document.createElement("td");
        titleCell.className = "table-title";
        titleCell.innerText = a.title;
        row.appendChild(titleCell);

        // Date
        const dateCell = document.createElement("td");
        dateCell.className = "table-date";
        dateCell.innerText = formatDate(a.event_date);
        row.appendChild(dateCell);

        // Location
        const locCell = document.createElement("td");
        locCell.className = "table-desc";
        locCell.innerText = a.location || "-";
        row.appendChild(locCell);

        // Actions
        const actionsCell = document.createElement("td");
        actionsCell.className = "table-actions";
        actionsCell.innerHTML = `
            <button onclick="editAudition(${a.id})" class="table-btn edit" title="Edit Audition">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteAudition(${a.id})" class="table-btn delete" title="Delete Audition">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function setupAuditionForms() {
    const form = document.getElementById("auditionForm");
    const cancelBtn = document.getElementById("auditionCancelBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        const id = document.getElementById("auditionId").value;
        
        const auditionData = {
            title: document.getElementById("auditionTitle").value.trim(),
            event_date: document.getElementById("auditionDate").value,
            location: document.getElementById("auditionLocation").value.trim(),
            image_url: document.getElementById("auditionImageUrl").value.trim(),
            description: document.getElementById("auditionDescription").value.trim()
        };

        const submitBtn = document.getElementById("auditionSubmitBtn");
        submitBtn.disabled = true;

        try {
            let res;
            if (editingAudition) {
                // UPDATE
                res = await fetch(`${BASE_URL}/auditions/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(auditionData)
                });
            } else {
                // CREATE
                res = await fetch(`${BASE_URL}/auditions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(auditionData)
                });
            }

            if (res.ok) {
                showToast(
                    editingAudition ? "Audition updated successfully!" : "Audition added successfully!",
                    "success"
                );
                resetAuditionForm();
                loadDashboardData();
            } else {
                const errData = await res.json();
                if (res.status === 401 || res.status === 403) {
                    showToast("Session expired. Please log in again.", "error");
                    handleLogout();
                } else {
                    showToast(errData.message || "Failed to save audition.", "error");
                }
            }
        } catch (error) {
            console.error("Error saving audition:", error);
            showToast("Server request failed.", "error");
        } finally {
            submitBtn.disabled = false;
        }
    });

    cancelBtn.addEventListener("click", resetAuditionForm);
}

async function editAudition(id) {
    try {
        const res = await fetch(`${BASE_URL}/auditions`);
        if (!res.ok) throw new Error();
        const list = await res.json();
        const item = list.find(a => a.id === id);

        if (!item) {
            showToast("Audition not found.", "error");
            return;
        }

        // Prefill form
        document.getElementById("auditionId").value = item.id;
        document.getElementById("auditionTitle").value = item.title;
        document.getElementById("auditionDate").value = item.event_date.split("T")[0];
        document.getElementById("auditionLocation").value = item.location || "";
        document.getElementById("auditionImageUrl").value = item.image_url || "";
        document.getElementById("auditionDescription").value = item.description || "";

        // UI Adjustments
        document.getElementById("auditionFormTitle").innerText = "Edit Audition Call";
        document.getElementById("auditionSubmitBtn").innerText = "Update Audition";
        document.getElementById("auditionCancelBtn").classList.remove("hidden");
        editingAudition = true;

        // Scroll to form
        document.querySelector("#tab-auditions .form-card").scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        showToast("Error retrieving audition data.", "error");
    }
}

async function deleteAudition(id) {
    if (!confirm("Are you sure you want to delete this audition call?")) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/auditions/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            showToast("Audition call deleted successfully!", "success");
            loadDashboardData();
        } else {
            if (res.status === 401 || res.status === 403) {
                showToast("Session expired. Please log in again.", "error");
                handleLogout();
            } else {
                showToast("Failed to delete audition.", "error");
            }
        }
    } catch (err) {
        showToast("Server error during deletion.", "error");
    }
}

function resetAuditionForm() {
    document.getElementById("auditionForm").reset();
    document.getElementById("auditionId").value = "";
    document.getElementById("auditionFormTitle").innerText = "Add Audition Call";
    document.getElementById("auditionSubmitBtn").innerText = "Add Audition";
    document.getElementById("auditionCancelBtn").classList.add("hidden");
    editingAudition = false;
}


/* ==========================================================================
   REGISTRATIONS MANAGEMENT
   ========================================================================== */

async function fetchRegistrations() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/registrations`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to load registrations");
    return await res.json();
}

function renderRegistrationsTable(registrations) {
    const tbody = document.getElementById("registrationTableBody");
    tbody.innerHTML = "";

    if (registrations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #9f9f9f;">No registrations received yet.</td></tr>`;
        return;
    }

    registrations.forEach(r => {
        const row = document.createElement("tr");

        // Full Name
        const nameCell = document.createElement("td");
        nameCell.className = "table-title";
        nameCell.innerText = r.full_name;
        row.appendChild(nameCell);

        // Age
        const ageCell = document.createElement("td");
        ageCell.innerText = r.age || "-";
        row.appendChild(ageCell);

        // Email
        const emailCell = document.createElement("td");
        emailCell.innerText = r.email || "-";
        row.appendChild(emailCell);

        // Phone
        const phoneCell = document.createElement("td");
        phoneCell.innerText = r.phone;
        row.appendChild(phoneCell);

        // WhatsApp
        const waCell = document.createElement("td");
        if (r.whatsapp) {
            waCell.innerHTML = `<a href="https://wa.me/${r.whatsapp.replace(/\D/g, '')}" target="_blank" style="color: #25d366; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                                    <i class="fa-brands fa-whatsapp"></i> ${r.whatsapp}
                                 </a>`;
        } else {
            waCell.innerText = "-";
        }
        row.appendChild(waCell);

        // Course
        const courseCell = document.createElement("td");
        courseCell.className = "table-date"; // color gold style
        courseCell.innerText = r.course;
        row.appendChild(courseCell);

        // Experience
        const expCell = document.createElement("td");
        expCell.className = "table-desc";
        expCell.innerText = r.experience || "-";
        row.appendChild(expCell);

        // Submitted Date
        const dateCell = document.createElement("td");
        dateCell.innerText = formatDate(r.created_at);
        row.appendChild(dateCell);

        // Actions
        const actionsCell = document.createElement("td");
        actionsCell.className = "table-actions";
        actionsCell.innerHTML = `
            <button onclick="deleteRegistration(${r.id})" class="table-btn delete" title="Delete Registration">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

async function deleteRegistration(id) {
    if (!confirm("Are you sure you want to delete this course registration submission?")) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/registrations/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            showToast("Registration submission deleted successfully!", "success");
            loadDashboardData();
        } else {
            if (res.status === 401 || res.status === 403) {
                showToast("Session expired. Please log in again.", "error");
                handleLogout();
            } else {
                showToast("Failed to delete registration.", "error");
            }
        }
    } catch (err) {
        showToast("Server error during deletion.", "error");
    }
}


/* ==========================================================================
   GALLERY MANAGEMENT
   ========================================================================== */

async function fetchGallery() {
    const res = await fetch(`${BASE_URL}/gallery`);
    if (!res.ok) throw new Error("Failed to load gallery items");
    return await res.json();
}

function renderGalleryTable(items) {
    const tbody = document.getElementById("galleryTableBody");
    tbody.innerHTML = "";

    if (items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9f9f9f;">No media items found in gallery.</td></tr>`;
        return;
    }

    items.forEach(item => {
        const row = document.createElement("tr");

        // Preview Column
        const previewCell = document.createElement("td");
        if (item.media_type === "video") {
            previewCell.innerHTML = `
                <div style="position: relative; width: 45px; height: 45px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-color); background-color: rgba(0,0,0,0.3);">
                    <video src="${item.media_url}" style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <i class="fa-solid fa-circle-play" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-size: 1.1rem; text-shadow: 0 0 5px rgba(0,0,0,0.8); pointer-events: none;"></i>
                </div>
            `;
        } else {
            previewCell.innerHTML = `<img src="${item.media_url}" alt="${item.title || 'Gallery Item'}" class="thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                     <div class="fallback-thumbnail" style="display:none;"><i class="fa-solid fa-image"></i></div>`;
        }
        row.appendChild(previewCell);



        // Album/Folder Column
        const folderCell = document.createElement("td");
        folderCell.className = "table-date"; // styling color gold
        folderCell.innerText = item.folder.charAt(0).toUpperCase() + item.folder.slice(1);
        row.appendChild(folderCell);

        // Type Column
        const typeCell = document.createElement("td");
        typeCell.innerText = item.media_type.charAt(0).toUpperCase() + item.media_type.slice(1);
        row.appendChild(typeCell);

        // Actions Column
        const actionsCell = document.createElement("td");
        actionsCell.className = "table-actions";
        
        if (item.media_type === "image") {
            const starClass = item.is_cover ? "table-btn star active" : "table-btn star";
            const starTitle = item.is_cover ? "Current Album Cover" : "Make Album Cover";
            const starIcon = item.is_cover ? "fa-solid fa-star" : "fa-regular fa-star";
            
            actionsCell.innerHTML = `
                <button onclick="makeGalleryCover(${item.id})" class="${starClass}" title="${starTitle}">
                    <i class="${starIcon}"></i>
                </button>
                <button onclick="deleteGalleryItem(${item.id})" class="table-btn delete" title="Delete Media">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
        } else {
            actionsCell.innerHTML = `
                <button onclick="deleteGalleryItem(${item.id})" class="table-btn delete" title="Delete Media">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
        }
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function setupGalleryForms() {
    const form = document.getElementById("galleryForm");
    const uploadMethodSelect = document.getElementById("galleryUploadMethod");
    const fileGroup = document.getElementById("galleryFileGroup");
    const urlGroup = document.getElementById("galleryUrlGroup");
    
    // Toggle Upload Method
    uploadMethodSelect.addEventListener("change", (e) => {
        if (e.target.value === "file") {
            fileGroup.classList.remove("hidden");
            urlGroup.classList.add("hidden");
            document.getElementById("galleryFile").required = true;
            document.getElementById("galleryUrl").required = false;
        } else {
            fileGroup.classList.add("hidden");
            urlGroup.classList.remove("hidden");
            document.getElementById("galleryFile").required = false;
            document.getElementById("galleryUrl").required = true;
        }
    });

    // Make file required by default since 'file' is default select value
    document.getElementById("galleryFile").required = true;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const folder = document.getElementById("galleryFolder").value;
        const media_type = document.getElementById("galleryMediaType").value;
        const method = uploadMethodSelect.value;

        const submitBtn = document.getElementById("gallerySubmitBtn");
        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";

        try {
            let mediaUrl = "";

            if (method === "file") {
                // 1. Upload file using Multer
                const fileInput = document.getElementById("galleryFile");
                if (fileInput.files.length === 0) {
                    showToast("Please choose a file to upload.", "error");
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Add to Gallery";
                    return;
                }

                const formData = new FormData();
                formData.append("mediaFile", fileInput.files[0]);

                const uploadRes = await fetch(`${BASE_URL}/gallery/upload`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (!uploadRes.ok) {
                    const uploadErr = await uploadRes.json();
                    throw new Error(uploadErr.message || "File upload failed.");
                }

                const uploadData = await uploadRes.json();
                mediaUrl = uploadData.fileUrl;
            } else {
                // Use manual URL input
                mediaUrl = document.getElementById("galleryUrl").value.trim();
            }

            // 2. Submit Gallery database record
            const galleryData = {
                title: "",
                folder: folder,
                media_type: media_type,
                media_url: mediaUrl
            };

            const res = await fetch(`${BASE_URL}/gallery`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(galleryData)
            });

            if (res.ok) {
                showToast("Media added to gallery successfully!", "success");
                form.reset();
                // Reset file / url visibility default
                uploadMethodSelect.value = "file";
                fileGroup.classList.remove("hidden");
                urlGroup.classList.add("hidden");
                document.getElementById("galleryFile").required = true;
                
                loadDashboardData();
            } else {
                const errData = await res.json();
                showToast(errData.message || "Failed to save gallery item.", "error");
            }
        } catch (error) {
            console.error("Error saving gallery item:", error);
            showToast(error.message || "Request failed.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Add to Gallery";
        }
    });
}

async function deleteGalleryItem(id) {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/gallery/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            showToast("Media item deleted successfully!", "success");
            loadDashboardData();
        } else {
            showToast("Failed to delete gallery item.", "error");
        }
    } catch (err) {
        showToast("Server error during deletion.", "error");
    }
}

async function makeGalleryCover(id) {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/gallery/${id}/make-cover`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            showToast("Folder cover photo updated successfully!", "success");
            loadDashboardData();
        } else {
            const errData = await res.json();
            showToast(errData.message || "Failed to update cover photo.", "error");
        }
    } catch (err) {
        console.error("Error setting cover photo:", err);
        showToast("Server request failed.", "error");
    }
}


/* ==========================================================================
   GENERAL SYSTEM UTILITIES
   ========================================================================== */

// Date Formatter: YYYY-MM-DD -> DD MMM YYYY
function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Log Out Trigger
document.getElementById("logoutBtn").addEventListener("click", () => {
    handleLogout();
});

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    showToast("Logged out successfully.", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

// Toast Alert System
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    const iconClass = type === "success" 
        ? "fa-solid fa-circle-check" 
        : type === "error" 
        ? "fa-solid fa-circle-exclamation" 
        : "fa-solid fa-circle-info";

    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}