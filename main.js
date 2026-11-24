const body = document.body;

const hourHand = document.querySelector(".hour");
const minuteHand = document.querySelector(".minute");
const secondHand = document.querySelector(".second");

const modeSwitch = document.querySelector(".mode-switch");

const digitalTimeEl = document.querySelector("#digital-time");
const digitalDateEl = document.querySelector("#digital-date");
const themeButtons = document.querySelectorAll(".theme-btn");

/* =========================
   Theme (Saved in Storage)
========================= */
const setTheme = (theme) => {
  body.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  themeButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.theme === theme);
  });
};

// Load saved theme
setTheme(localStorage.getItem("theme") || "ocean");

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setTheme(btn.dataset.theme);
  });
});

/* =========================
   Dark Mode (Saved)
========================= */
if (localStorage.getItem("mode") === "Dark Mode") {
  body.classList.add("dark");
  modeSwitch.textContent = "Light Mode";
}

const toggleDarkMode = () => {
  const isDarkMode = body.classList.toggle("dark");

  modeSwitch.textContent = isDarkMode
    ? "Light Mode"
    : "Dark Mode";

  localStorage.setItem(
    "mode",
    isDarkMode ? "Dark Mode" : "Light Mode"
  );
};

modeSwitch.addEventListener("click", toggleDarkMode);

// Keyboard Support
modeSwitch.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleDarkMode();
  }
});

/* =========================
   Analog + Digital Clock
========================= */
const updateTime = () => {
  const date = new Date();

  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours() % 12;

  const secToDeg = (seconds / 60) * 360;
  const minToDeg = ((minutes + seconds / 60) / 60) * 360;
  const hrToDeg = ((hours + minutes / 60) / 12) * 360;

  if (secondHand) {
    secondHand.style.transform = `rotate(${secToDeg}deg)`;
  }

  if (minuteHand) {
    minuteHand.style.transform = `rotate(${minToDeg}deg)`;
  }

  if (hourHand) {
    hourHand.style.transform = `rotate(${hrToDeg}deg)`;
  }

  // Digital Time
  if (digitalTimeEl) {
    digitalTimeEl.textContent = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  }

  // Digital Date
  if (digitalDateEl) {
    digitalDateEl.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  }
};

/* =========================
   Start Clock
========================= */
setInterval(updateTime, 1000);
updateTime();


/* =========================
   PWA Install Prompt
========================= */
let deferredPrompt = null;

const installBanner = document.getElementById("install-banner");
const installBtn = document.getElementById("install-btn");
const installDismiss = document.getElementById("install-dismiss");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Only show if the user hasn't dismissed it this session
  if (!sessionStorage.getItem("install-dismissed")) {
    installBanner.hidden = false;
  }
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      installBanner.hidden = true;
    }
    deferredPrompt = null;
  });
}

if (installDismiss) {
  installDismiss.addEventListener("click", () => {
    installBanner.hidden = true;
    sessionStorage.setItem("install-dismissed", "1");
  });
}

// Hide the banner if already installed
window.addEventListener("appinstalled", () => {
  installBanner.hidden = true;
  deferredPrompt = null;
});
