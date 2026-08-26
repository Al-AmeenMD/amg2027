/* ==========================================================================
   BORNO APC 2027 CAMPAIGN - VOLUNTEER & WARD MOBILIZATION FORM
   Handles all 27 Borno LGAs, Validation, LocalStorage & Toast Feedback
   ========================================================================== */

const BORNO_LGAS = [
  "Maiduguri (Metropolitan Council)",
  "Jere",
  "Bama",
  "Biu",
  "Gubio",
  "Gwoza",
  "Hawul",
  "Damboa",
  "Konduga",
  "Monguno",
  "Kukawa",
  "Askira/Uba",
  "Abadam",
  "Bayo",
  "Chibok",
  "Dikwa",
  "Guzamala",
  "Kaga",
  "Kala/Balge",
  "Kwaya Kusar",
  "Mafa",
  "Magumeri",
  "Marte",
  "Mobbar",
  "Ngala",
  "Nganzai",
  "Shani"
];

document.addEventListener("DOMContentLoaded", () => {
  const lgaSelect = document.getElementById("volunteerLga");
  const volunteerForm = document.getElementById("volunteerForm");

  // Populate LGA dropdown if present
  if (lgaSelect) {
    BORNO_LGAS.forEach(lga => {
      const option = document.createElement("option");
      option.value = lga;
      option.textContent = lga;
      lgaSelect.appendChild(option);
    });
  }

  // Handle volunteer form submission
  if (volunteerForm) {
    volunteerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName")?.value.trim();
      const phone = document.getElementById("phoneNumber")?.value.trim();
      const email = document.getElementById("emailAddress")?.value.trim();
      const lga = document.getElementById("volunteerLga")?.value;
      const ward = document.getElementById("wardName")?.value.trim();

      // Collect selected roles
      const selectedRoles = [];
      document.querySelectorAll('input[name="volunteerRole"]:checked').forEach(cb => {
        selectedRoles.push(cb.value);
      });

      // Basic Validation
      if (!fullName || !phone || !lga || !ward) {
        showToast("Incomplete Form", "Please fill in all required fields marked with *", "error");
        return;
      }

      // Validate Nigerian phone format
      const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
      const cleanedPhone = phone.replace(/[\s-]/g, "");
      if (!phoneRegex.test(cleanedPhone)) {
        showToast("Invalid Phone Number", "Please enter a valid Nigerian mobile or WhatsApp number (e.g. 08031234567).", "error");
        return;
      }

      // Build submission payload
      const volunteerData = {
        fullName,
        phone: cleanedPhone,
        email: email || "N/A",
        lga,
        ward,
        roles: selectedRoles.length > 0 ? selectedRoles : ["General Mobilizer"],
        submittedAt: new Date().toISOString()
      };

      // Save locally
      try {
        const existing = JSON.parse(localStorage.getItem("borno_apc_volunteers") || "[]");
        existing.push(volunteerData);
        localStorage.setItem("borno_apc_volunteers", JSON.stringify(existing));
      } catch (err) {
        console.warn("Storage error", err);
      }

      // Success Feedback
      showToast(
        "Welcome to the Movement!",
        `Nagode, ${fullName}! Your mobilization profile for ${ward} Ward (${lga}) has been registered with the Gubio-Abdullahi Campaign Council.`,
        "success"
      );

      volunteerForm.reset();
    });
  }
});

// Global Toast Notification Helper
function showToast(title, message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconText = type === "error" ? "✕" : (type === "info" ? "ℹ" : "✓");

  toast.innerHTML = `
    <div class="toast-icon">${iconText}</div>
    <div class="toast-body">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 5500);
}
