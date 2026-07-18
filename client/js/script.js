// =====================================
// NATYARANG JALGAON
// Premium Script
// =====================================

// Loader

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 1800);

});

// ==========================
// Mobile Menu
// ==========================

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

menu.onclick = () => {

    nav.classList.toggle("active");

    if(nav.classList.contains("active")){

        menu.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    }

    else{

        menu.innerHTML = '<i class="fa-solid fa-bars"></i>';

    }

}

// ==========================
// Close Menu
// ==========================

document.querySelectorAll("nav a").forEach(link=>{

link.onclick=()=>{

nav.classList.remove("active");

menu.innerHTML='<i class="fa-solid fa-bars"></i>';

}

})

// ==========================
// Sticky Header
// ==========================

window.addEventListener("scroll",()=>{

const header=document.querySelector("header");

header.classList.toggle("sticky",window.scrollY>80);

})

// ==========================
// Scroll Reveal Animation
// ==========================

const reveal=document.querySelectorAll(

".card,.gallery-item,.review,.counter-box,.event-card,.founder,.contact-container"

);

function revealAnimation(){

let windowHeight=window.innerHeight;

reveal.forEach(item=>{

let top=item.getBoundingClientRect().top;

if(top<windowHeight-120){

item.classList.add("show");

}

})

}

window.addEventListener("scroll",revealAnimation);

revealAnimation();

// ==========================
// Counter Animation
// ==========================

const counters=document.querySelectorAll(".counter-box h2");

let started=false;

window.addEventListener("scroll",()=>{

const section=document.querySelector(".counter");

if(!section) return;

let pos=section.offsetTop-350;

if(window.scrollY>pos && !started){

started=true;

counters.forEach(counter=>{

let target=parseInt(counter.innerText);

let count=0;

let speed=target/100;

let update=()=>{

count+=speed;

if(count<target){

counter.innerText=Math.floor(count)+"+";

requestAnimationFrame(update);

}

else{

counter.innerText=target+"+";

}

}

update();

})

}

})

// ==========================
// Smooth Scroll
// ==========================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

// ==========================
// Scroll To Top Button
// ==========================

const topBtn=document.createElement("button");

topBtn.innerHTML="↑";

topBtn.id="topBtn";

document.body.appendChild(topBtn);

topBtn.style.position="fixed";
topBtn.style.right="25px";
topBtn.style.bottom="25px";
topBtn.style.width="50px";
topBtn.style.height="50px";
topBtn.style.borderRadius="50%";
topBtn.style.border="none";
topBtn.style.background="#FFD700";
topBtn.style.color="#000";
topBtn.style.fontSize="22px";
topBtn.style.cursor="pointer";
topBtn.style.display="none";
topBtn.style.zIndex="999";

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

})

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

}

// =====================================
// PREMIUM CURSOR GLOW
// =====================================

const cursor = document.createElement("div");
cursor.className = "cursor-glow";
document.body.appendChild(cursor);

cursor.style.cssText = `
position:fixed;
width:25px;
height:25px;
border-radius:50%;
background:rgba(255,215,0,.35);
pointer-events:none;
transform:translate(-50%,-50%);
z-index:999999;
transition:transform .08s linear;
backdrop-filter:blur(4px);
`;

document.addEventListener("mousemove",(e)=>{

cursor.style.left=e.clientX+"px";
cursor.style.top=e.clientY+"px";

});

// =====================================
// ACTIVE NAV LINK
// =====================================

const sections=document.querySelectorAll("section");
const navLinks=document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(sec=>{

const top=window.scrollY;
const offset=sec.offsetTop-180;
const height=sec.offsetHeight;

if(top>=offset){

current=sec.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")=="#"+current){

link.classList.add("active");

}

});

});

// =====================================
// HERO TEXT ANIMATION
// =====================================

const hero=document.querySelector(".hero-content");

window.addEventListener("load",()=>{

hero.style.opacity="0";

setTimeout(()=>{

hero.style.transition="1.5s";
hero.style.opacity="1";
hero.style.transform="translateY(0px)";

},600);

});

// =====================================
// RANDOM FLOATING LIGHTS
// =====================================

for(let i=0;i<20;i++){

const light=document.createElement("span");

light.className="light";

light.style.position="fixed";
light.style.width="5px";
light.style.height="5px";
light.style.background="#FFD700";
light.style.borderRadius="50%";
light.style.opacity=Math.random();
light.style.left=Math.random()*100+"vw";
light.style.top=Math.random()*100+"vh";
light.style.animationDuration=(5+Math.random()*8)+"s";

document.body.appendChild(light);

}

// =====================================
// LIGHT ANIMATION STYLE
// =====================================

const style=document.createElement("style");

style.innerHTML=`

.light{

animation:floatLight linear infinite;

box-shadow:0 0 10px gold;

}

@keyframes floatLight{

0%{

transform:translateY(0);

opacity:0;

}

50%{

opacity:1;

}

100%{

transform:translateY(-120vh);

opacity:0;

}

}

.active{

color:#FFD700 !important;

}

`;

document.head.appendChild(style);

// =====================================
// GALLERY HOVER EFFECT
// =====================================

document.querySelectorAll(".gallery-item").forEach(item=>{

item.addEventListener("mouseenter",()=>{

item.style.transform="scale(1.03)";

});

item.addEventListener("mouseleave",()=>{

item.style.transform="scale(1)";

});

});

// =====================================
// TESTIMONIAL AUTO ANIMATION
// =====================================

const reviews=document.querySelectorAll(".review");

let currentReview=0;

setInterval(()=>{

reviews.forEach(r=>{

r.style.opacity=".3";

});

reviews[currentReview].style.opacity="1";

currentReview++;

if(currentReview>=reviews.length){

currentReview=0;

}

},3000);

// =====================================
// SIMPLE PARALLAX
// =====================================

window.addEventListener("scroll",()=>{

const media=document.querySelector("#home video, #home .hero-bg-img");

if(media){

media.style.transform=`translateY(${window.scrollY*0.3}px)`;

}

});

// =====================================
// CONSOLE MESSAGE
// =====================================

console.log(
"%c🎭 Welcome to Natyarang Jalgaon",
"color:#FFD700;font-size:20px;font-weight:bold;"
);

console.log(
"%cDesigned with ❤️",
"color:white;font-size:14px;"
);

// =====================================
// DYNAMIC EVENTS LOADING
// =====================================
async function loadDynamicEvents() {
    const eventWrapper = document.querySelector(".event-wrapper");
    if (!eventWrapper) return;

    try {
        // Add a simulated 1.5-second loading delay so the user can see the skeleton loaders shimmering
        await new Promise(resolve => setTimeout(resolve, 1500));

        const [workshopsRes, performancesRes, auditionsRes] = await Promise.all([
            fetch("http://localhost:5000/api/workshops").then(r => r.ok ? r.json() : []),
            fetch("http://localhost:5000/api/performances").then(r => r.ok ? r.json() : []),
            fetch("http://localhost:5000/api/auditions").then(r => r.ok ? r.json() : [])
        ]);

        const workshops = workshopsRes.map(w => ({ ...w, type: 'workshop' }));
        const performances = performancesRes.map(p => ({ ...p, type: 'performance' }));
        const auditions = auditionsRes.map(a => ({ ...a, type: 'audition' }));

        const allEvents = [...workshops, ...performances, ...auditions].sort((a, b) => {
            return new Date(a.event_date) - new Date(b.event_date);
        });

        eventWrapper.innerHTML = "";

        if (allEvents.length === 0) {
            eventWrapper.innerHTML = `
                <div class="no-events-card">
                    <i class="fa-solid fa-calendar-xmark" style="font-size: 2.5rem; color: var(--gold); margin-bottom: 12px; display: block;"></i>
                    <p style="color: var(--text-color); font-size: 1.1rem; font-weight: 500;">No upcoming workshops or performances scheduled.</p>
                    <span style="color: var(--text-muted); font-size: 0.9rem;">Stay tuned for announcements!</span>
                </div>
            `;
            return;
        }

        allEvents.forEach(event => {
            const dateObj = new Date(event.event_date);
            const dateStr = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : event.event_date;

            let tagText = '🎓 Workshop';
            if (event.type === 'performance') tagText = '🎭 Performance';
            if (event.type === 'audition') tagText = '📣 Audition Call';

            let dateLine = dateStr;
            if (event.type === 'audition' && event.location) {
                dateLine += ` <span style="color: #FFD700; font-weight: 400; font-size: 0.85rem; margin-left: 5px;">| 📍 ${event.location}</span>`;
            }

            const card = document.createElement("div");
            card.className = "event-card show";
            card.innerHTML = `
                <span class="event-tag" style="color: #FFD700; font-size: 0.75rem; letter-spacing: 1px; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 8px;">
                    ${tagText}
                </span>
                <h3>${event.title}</h3>
                <p style="color: #fff; margin-bottom: 10px; font-weight: 500;">${dateLine}</p>
                <span style="color: #bbb; line-height: 1.5; display: block;">${event.description || ''}</span>
            `;
            eventWrapper.appendChild(card);
        });
    } catch (err) {
        console.warn("Could not load dynamic events from backend, showing default static events.", err);
        eventWrapper.innerHTML = `
            <div class="event-card show">
                <span class="event-tag" style="color: #FFD700; font-size: 0.75rem; letter-spacing: 1px; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 8px;">🎓 Workshop</span>
                <h3>Acting Workshop</h3>
                <p style="color: #fff; margin-bottom: 10px; font-weight: 500;">15 August 2026</p>
                <span style="color: #bbb; line-height: 1.5; display: block;">Practical Acting Session for Beginners.</span>
            </div>
            <div class="event-card show">
                <span class="event-tag" style="color: #FFD700; font-size: 0.75rem; letter-spacing: 1px; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 8px;">🎭 Performance</span>
                <h3>Theatre Festival</h3>
                <p style="color: #fff; margin-bottom: 10px; font-weight: 500;">10 September 2026</p>
                <span style="color: #bbb; line-height: 1.5; display: block;">Grand Stage Performance by Students.</span>
            </div>
            <div class="event-card show">
                <span class="event-tag" style="color: #FFD700; font-size: 0.75rem; letter-spacing: 1px; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 8px;">🎓 Workshop</span>
                <h3>Kids Drama Camp</h3>
                <p style="color: #fff; margin-bottom: 10px; font-weight: 500;">October 2026</p>
                <span style="color: #bbb; line-height: 1.5; display: block;">Fun & Creative Learning Experience.</span>
            </div>
        `;
    }
}

window.addEventListener("load", loadDynamicEvents);

// =====================================
// REGISTRATION FORM SUBMISSION
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    const regForm = document.getElementById("registrationForm");
    if (!regForm) return;

    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const phone = document.getElementById("regPhone").value.trim();
        const whatsapp = document.getElementById("regWhatsApp").value.trim();
        
        const phoneRegex = /^[6-9]\d{9}$/;
        
        if (!phoneRegex.test(phone)) {
            showNotification("❌ Invalid Phone Number. Must be a valid 10-digit number.", "error");
            return;
        }
        
        if (whatsapp && !phoneRegex.test(whatsapp)) {
            showNotification("❌ Invalid WhatsApp Number. Must be a valid 10-digit number.", "error");
            return;
        }

        const submitBtn = document.getElementById("regSubmitBtn");
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        const registrationData = {
            full_name: document.getElementById("regFullName").value.trim(),
            age: document.getElementById("regAge").value ? parseInt(document.getElementById("regAge").value) : null,
            email: document.getElementById("regEmail").value.trim() || null,
            phone: document.getElementById("regPhone").value.trim(),
            whatsapp: document.getElementById("regWhatsApp").value.trim() || null,
            course: "General Admission",
            experience: document.getElementById("regExperience").value.trim() || null
        };

        try {
            const res = await fetch("http://localhost:5000/api/registrations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registrationData)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                showNotification("🎉 Registration Successful! We will contact you shortly.", "success");
                regForm.reset();
            } else {
                showNotification("❌ Error: " + (data.message || "Failed to submit."), "error");
            }
        } catch (err) {
            console.error("Registration error:", err);
            showNotification("❌ Network Error: Could not connect to the server.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    });

    function showNotification(message, type = "success") {
        const banner = document.createElement("div");
        banner.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${type === 'success' ? '#151515' : '#151515'};
            color: #fff;
            padding: 18px 26px;
            border-radius: 8px;
            font-family: inherit;
            font-size: 0.9rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            z-index: 999999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border-left: 5px solid ${type === 'success' ? '#4caf50' : '#f44336'};
            backdrop-filter: blur(8px);
            border-top: 1px solid rgba(255,215,0,0.05);
            border-right: 1px solid rgba(255,215,0,0.05);
            border-bottom: 1px solid rgba(255,215,0,0.05);
        `;
        banner.innerText = message;
        document.body.appendChild(banner);
        
        setTimeout(() => {
            banner.style.opacity = "1";
            banner.style.transform = "translateY(0)";
        }, 50);

        setTimeout(() => {
            banner.style.opacity = "0";
            banner.style.transform = "translateY(20px)";
            setTimeout(() => banner.remove(), 400);
        }, 4000);
    }

    // IntersectionObserver Scroll Reveal Setup
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Golden Stardust Particles Canvas
    const canvas = document.getElementById("heroStardust");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        
        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.size = Math.random() * 2.2 + 0.6;
                this.speedY = -(Math.random() * 0.7 + 0.15);
                this.speedX = Math.random() * 0.4 - 0.2;
                this.alpha = Math.random() * 0.5 + 0.25;
                this.decay = Math.random() * 0.0018 + 0.0008;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.alpha -= this.decay;
                if (this.alpha <= 0 || this.y < 0 || this.x < 0 || this.x > canvas.width) {
                    this.reset();
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = "#FFD700";
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#FFD700";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        const initParticles = () => {
            particles = [];
            const count = Math.min(50, Math.floor(canvas.width / 24));
            for (let i = 0; i < count; i++) {
                const p = new Particle();
                p.y = Math.random() * canvas.height;
                particles.push(p);
            }
        };
        
        initParticles();
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Stage spotlight mouse tracking
        const stageHero = document.getElementById("home");
        const spotlightEl = document.querySelector(".stage-spotlight");
        if (stageHero && spotlightEl) {
            stageHero.addEventListener("mousemove", (e) => {
                const rect = stageHero.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                spotlightEl.style.setProperty("--spotlight-x", `${x}%`);
                spotlightEl.style.setProperty("--spotlight-y", `${y}%`);
            });
            // Reset to center on mouseleave
            stageHero.addEventListener("mouseleave", () => {
                spotlightEl.style.setProperty("--spotlight-x", `50%`);
                spotlightEl.style.setProperty("--spotlight-y", `35%`);
            });
        }
    }
});