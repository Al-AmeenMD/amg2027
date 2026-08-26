/* ==========================================================================
   BORNO APC 2027 CAMPAIGN - MODALS CONTROLLER
   RSVP Modal, Manifesto Policy Reader & Grassroots Support Flow
   ========================================================================== */

const POLICY_DETAILS = {
  security: {
    title: "1. Sustainable Peace, Resettlement & Social Cohesion",
    content: `
      <p>Building on Governor Babagana Umara Zulum's landmark achievements, the Gubio-Abdullahi administration will reinforce community security architecture across all 27 Local Government Areas.</p>
      <ul>
        <li><strong>Enhanced Logistics:</strong> Strengthening support for the Civilian JTF, Hunters, and Vigilante groups with modern communication and welfare.</li>
        <li><strong>Safe Resettlement:</strong> Accelerating voluntary repatriation and dignified resettlement of internally displaced persons (IDPs) into fortified smart communities.</li>
        <li><strong>Early Warning Systems:</strong> Deploying community-based peace reconciliation councils and youth liaison officers in border border communities.</li>
      </ul>
    `
  },
  agriculture: {
    title: "2. Agricultural Revolution & Food Security",
    content: `
      <p>Borno possesses over 70,000 square kilometers of fertile agricultural land. We will unlock agro-industrial value chains across Northern, Central, and Southern Borno.</p>
      <ul>
        <li><strong>Solar-Powered Irrigation:</strong> Expanding year-round dry-season wheat, rice, sesame, and cowpea farming around Lake Chad and the Alau Dam basin.</li>
        <li><strong>Mechanization Access:</strong> Establishing tractor-leasing and subsidized fertilizer hubs in all 27 LGA headquarters.</li>
        <li><strong>Agro-Processing Zones:</strong> Developing grain silos and modern livestock processing plants to create over 150,000 direct youth jobs.</li>
      </ul>
    `
  },
  education: {
    title: "3. Mega Education & Science-Tech Renaissance",
    content: `
      <p>Every child in Borno deserves world-class education. We will build upon Borno's mega-school model and prioritize digital skills.</p>
      <ul>
        <li><strong>Teacher Professional Development:</strong> Continuous training and salary incentives for basic and secondary education teachers across all wards.</li>
        <li><strong>Free Basic Education & Feeding:</strong> Sustaining free tuition, books, and uniforms for primary and junior secondary students.</li>
        <li><strong>Borno Tech Hubs:</strong> Constructing 3 regional Innovation and Vocational Technology Centers in Maiduguri, Biu, and Monguno.</li>
      </ul>
    `
  },
  healthcare: {
    title: "4. Primary Healthcare & Maternal-Child Wellness",
    content: `
      <p>Ensuring that high-quality, free primary healthcare is accessible within a 15-minute radius for every Borno family.</p>
      <ul>
        <li><strong>Ward Health Center Upgrade:</strong> 24/7 solar-powered primary health centers fully staffed with licensed midwives and medical officers.</li>
        <li><strong>Free Maternal & Child Healthcare:</strong> 100% free prenatal, delivery, and under-5 medical services state-wide.</li>
        <li><strong>Emergency Medical Logistics:</strong> Upgraded ambulance networks connecting rural primary health centers to state specialist hospitals.</li>
      </ul>
    `
  },
  infrastructure: {
    title: "5. Urban Renewal & Inter-LGA Road Connectivity",
    content: `
      <p>As a seasoned civil engineer and former Commissioner for Reconstruction, Rehabilitation & Resettlement (RRR), Engr. Mustapha Gubio brings unmatched technical expertise to physical infrastructure.</p>
      <ul>
        <li><strong>Inter-City Highways:</strong> Upgrading and rehabilitating vital trade corridors connecting Maiduguri to Biu, Bama, Monguno, and Damasak.</li>
        <li><strong>Renewable Solar Grid:</strong> Expanding solar street lighting and mini-grids for urban and rural market centers.</li>
        <li><strong>Drainage & Flood Control:</strong> Engineering comprehensive drainage channels to protect Maiduguri metropolis and riverine communities from seasonal flooding.</li>
      </ul>
    `
  },
  economy: {
    title: "6. Youth Entrepreneurship & Micro-Credit Funds",
    content: `
      <p>Economic resilience begins with our hardworking youth and market women. We will unlock entrepreneurship grants and cooperative credit.</p>
      <ul>
        <li><strong>₦5 Billion Borno Youth SME Fund:</strong> Zero-interest micro-loans and toolkits for certified vocational graduates and digital innovators.</li>
        <li><strong>Market Women Empowerment:</strong> Direct non-repayable grants for traders in Monday Market, Gamboru Market, Tashan Bama, and rural weekly markets.</li>
        <li><strong>Cross-Border Trade Revival:</strong> Reactivating formal trade links with Cameroon, Chad, and Niger Republic to restore Borno's historic mercantile supremacy.</li>
      </ul>
    `
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Modal DOM elements
  const rsvpModal = document.getElementById("rsvpModal");
  const manifestoModal = document.getElementById("manifestoModal");
  const supportModal = document.getElementById("supportModal");

  // Event RSVP Buttons
  document.querySelectorAll("[data-action='rsvp']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute("data-event-name") || "Borno Campaign Event";
      const targetInput = document.getElementById("rsvpEventName");
      if (targetInput) targetInput.value = eventName;
      openModal(rsvpModal);
    });
  });

  // Policy Brief / Read More Buttons
  document.querySelectorAll("[data-policy-key]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.getAttribute("data-policy-key");
      const policy = POLICY_DETAILS[key];
      if (policy && manifestoModal) {
        document.getElementById("manifestoTitle").textContent = policy.title;
        document.getElementById("manifestoBody").innerHTML = policy.content;
        openModal(manifestoModal);
      }
    });
  });

  // Support / Donate Buttons
  document.querySelectorAll("[data-action='support']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(supportModal);
    });
  });

  // Close buttons & Backdrop clicks
  document.querySelectorAll(".modal-close-btn, .modal-cancel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  // Escape key closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Handle RSVP Form Submission
  const rsvpForm = document.getElementById("rsvpForm");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("rsvpName")?.value;
      const event = document.getElementById("rsvpEventName")?.value;
      closeAllModals();
      showToast("Seat Reserved!", `Nagode, ${name}! Your RSVP for "${event}" has been confirmed. You will receive an SMS reminder.`, "success");
      rsvpForm.reset();
    });
  }

  // Handle Support Tiers Selection
  const tierButtons = document.querySelectorAll(".tier-btn");
  tierButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tierButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const amount = btn.getAttribute("data-amount");
      const amountInput = document.getElementById("customSupportAmount");
      if (amountInput && amount !== "custom") {
        amountInput.value = amount;
      }
    });
  });

  // Handle Support Form Submission
  const supportForm = document.getElementById("supportForm");
  if (supportForm) {
    supportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const donorName = document.getElementById("supportName")?.value || "Distinguished Supporter";
      const amount = document.getElementById("customSupportAmount")?.value || "5000";
      closeAllModals();
      showToast(
        "Pledge Acknowledged!",
        `Thank you, ${donorName}! Your grassroots campaign support pledge of ₦${parseInt(amount).toLocaleString()} has been logged with the Borno APC Finance Committee.`,
        "success"
      );
      supportForm.reset();
    });
  }
});

function openModal(modalEl) {
  if (!modalEl) return;
  document.body.style.overflow = "hidden";
  modalEl.classList.add("open");
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
  document.body.style.overflow = "";
}
