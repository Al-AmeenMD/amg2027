const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  LevelFormat
} = require("docx");

// Color Palette Constants
const COLOR_PRIMARY = "0D5C3A";   // APC Green
const COLOR_SECONDARY = "A6192E"; // APC Red
const COLOR_NAVY = "0F172A";      // Slate 900
const COLOR_GOLD = "B45309";      // Amber 700
const COLOR_TEXT = "1E293B";      // Slate 800
const COLOR_MUTED = "64748B";     // Slate 500
const COLOR_BG_LIGHT = "F8FAFC";  // Light Slate BG
const COLOR_BG_GREEN = "F0FDF4";  // Very light green
const COLOR_BG_RED = "FEF2F2";    // Very light red
const COLOR_BG_BLUE = "F0F9FF";   // Very light blue
const COLOR_BORDER = "CBD5E1";    // Slate 300

function createCell(text, isHeader = false, widthPercent = 100, customBg = null, alignment = AlignmentType.LEFT) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: {
      fill: customBg || (isHeader ? COLOR_PRIMARY : "FFFFFF"),
      type: ShadingType.CLEAR,
    },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
    },
    children: [
      new Paragraph({
        alignment: alignment,
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            color: isHeader ? "FFFFFF" : COLOR_TEXT,
            font: "Calibri",
            size: isHeader ? 21 : 20,
          }),
        ],
      }),
    ],
  });
}

function createCallout(title, text, borderColor = COLOR_PRIMARY, bgColor = COLOR_BG_LIGHT) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            borders: {
              top: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title ? `${title}\n` : "",
                    bold: true,
                    color: borderColor,
                    font: "Calibri",
                    size: 22,
                  }),
                  new TextRun({
                    text: text,
                    italic: false,
                    color: COLOR_TEXT,
                    font: "Calibri",
                    size: 21,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
  });
}

function createParagraph(text, isBold = false) {
  return new Paragraph({
    spacing: { after: 140, line: 276 },
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        color: COLOR_TEXT,
        font: "Calibri",
        size: 22,
      }),
    ],
  });
}

function createBullet(text, boldPrefix = "") {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 100, line: 260 },
    children: [
      new TextRun({
        text: boldPrefix ? `${boldPrefix}: ` : "",
        bold: true,
        color: COLOR_NAVY,
        font: "Calibri",
        size: 21,
      }),
      new TextRun({
        text: text,
        color: COLOR_TEXT,
        font: "Calibri",
        size: 21,
      }),
    ],
  });
}

async function buildDocument() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            color: COLOR_TEXT,
            size: 22,
          },
        },
      },
      heading1: {
        run: {
          font: "Calibri",
          size: 32,
          bold: true,
          color: COLOR_PRIMARY,
        },
      },
      heading2: {
        run: {
          font: "Calibri",
          size: 26,
          bold: true,
          color: COLOR_SECONDARY,
        },
      },
      heading3: {
        run: {
          font: "Calibri",
          size: 23,
          bold: true,
          color: COLOR_NAVY,
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "AMG 2027 | Borno APC Gubernatorial Campaign — Strategic Blueprint & Workflow Document",
                    size: 16,
                    color: COLOR_MUTED,
                    font: "Calibri",
                    italic: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.SPACE_BETWEEN,
                children: [
                  new TextRun({
                    text: "Confidential & Authorized by Gubio-Abdullahi 2027 Campaign Council",
                    size: 16,
                    color: COLOR_MUTED,
                    font: "Calibri",
                  }),
                  new TextRun({
                    text: "  |  Page ",
                    size: 16,
                    color: COLOR_MUTED,
                    font: "Calibri",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    bold: true,
                    color: COLOR_PRIMARY,
                  }),
                  new TextRun({
                    text: " of ",
                    size: 16,
                    color: COLOR_MUTED,
                    font: "Calibri",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    bold: true,
                    color: COLOR_PRIMARY,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // -------------------------------------------------------------
          // TITLE / COVER HEADER
          // -------------------------------------------------------------
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: "ALL PROGRESSIVES CONGRESS (APC) • BORNO STATE CHAPTER",
                bold: true,
                size: 22,
                color: COLOR_SECONDARY,
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "AMG 2027 GUBERNATORIAL CAMPAIGN COUNCIL",
                bold: true,
                size: 38,
                color: COLOR_PRIMARY,
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "OFFICIAL STRATEGIC BLUEPRINT, OPERATIONAL WORKFLOW & GOVERNANCE MANIFESTO",
                bold: true,
                size: 24,
                color: COLOR_NAVY,
                font: "Calibri",
              }),
            ],
          }),

          createCallout(
            "OFFICIAL 2027 APC BORNO GUBERNATORIAL TICKET",
            "• Gubernatorial Candidate: Engineer Mustapha Gubio (FNSE) — Former Commissioner for Reconstruction, Rehabilitation and Resettlement (RRR)\n• Deputy Gubernatorial Candidate: Hon. Ali Isa Abdullahi — Former Director-General, Borno State Emergency Management Agency (SEMA)\n• Core Theme: 'Consolidating Peace, Accelerating Transformation — Sustaining the Zulum Legacy across all 27 LGAs'\n• Ratification: Unanimous Consensus Nomination (May 21, 2026) backed by H.E. Vice President Kashim Shettima (GCON) & H.E. Governor Babagana Umara Zulum (CON)",
            COLOR_PRIMARY,
            COLOR_BG_GREEN
          ),

          new Paragraph({ spacing: { after: 240 } }),

          // -------------------------------------------------------------
          // 1. EXECUTIVE SUMMARY & STRATEGIC OVERVIEW
          // -------------------------------------------------------------
          createHeading1("1. Executive Summary & Strategic Overview"),
          createParagraph(
            "The Borno State All Progressives Congress (APC) Gubernatorial Campaign for the 2027 General Elections presents a tested, coherent, and forward-looking operational architecture anchored on the leadership ticket of Engineer Mustapha Gubio and Hon. Ali Isa Abdullahi. This strategic document codifies the governance vision, the 10-point transformation manifesto, the grassroots digital mobilization workflows, voter engagement protocols, and organizational machinery across all 27 Local Government Areas of Borno State."
          ),
          createParagraph(
            "The primary objective of the AMG 2027 movement is to preserve the hard-won peace, institutional discipline, and monumental developmental strides established by the administration of Governor Babagana Umara Zulum, while opening bold new economic corridors in agriculture, modern technology, commerce, and human capital empowerment."
          ),

          // -------------------------------------------------------------
          // 2. CANDIDATE LEADERSHIP PROFILES & PEDIGREE
          // -------------------------------------------------------------
          createHeading1("2. Leadership Profiles & Executive Track Record"),

          createHeading2("2.1 Engineer Mustapha Gubio — Gubernatorial Candidate"),
          createBullet(
            "Consummate civil engineer with over two decades of public infrastructure and developmental stewardship.",
            "Professional Background"
          ),
          createBullet(
            "Served at the forefront of Governor Babagana Umara Zulum's administration as Commissioner for Reconstruction, Rehabilitation & Resettlement (RRR).",
            "Executive Ministry Leadership"
          ),
          createBullet(
            "Personally oversaw the physical design and delivery of over 50,000 resilient housing units, state-of-the-art mega-schools, modern primary health centers, rural solar mini-grids, and fortified community townships across all 27 LGAs.",
            "Reconstruction Footprint"
          ),
          createBullet(
            "Recognized for rigorous engineering discipline, transparency, meticulous site inspection, and steadfast loyalty to Borno's 25-Year Long-Term Development Masterplan.",
            "Core Competence"
          ),

          createHeading2("2.2 Hon. Ali Isa Abdullahi — Deputy Gubernatorial Candidate"),
          createBullet(
            "Former Director-General of the Borno State Emergency Management Agency (SEMA), revered statewide for rapid, compassionate, and transparent humanitarian coordination.",
            "Humanitarian Command"
          ),
          createBullet(
            "Spearheaded life-saving crisis response, dignified aid logistics, and structured rehabilitation programs for hundreds of thousands of returning displaced citizens.",
            "Crisis Management"
          ),
          createBullet(
            "Deep-rooted connection with youth organizations, community elders, frontline vigilantes, and vulnerable demographic groups across Southern, Central, and Northern Borno.",
            "Grassroots Advocacy"
          ),

          // -------------------------------------------------------------
          // 3. THE 4 STRATEGIC PILLARS
          // -------------------------------------------------------------
          createHeading1("3. Strategic Pillars of the AMG 2027 Vision"),
          createParagraph(
            "The campaign is built upon four indestructible foundational pillars that directly address the historical challenges and untapped potentials of Borno State:"
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell("Pillar", true, 25),
                  createCell("Strategic Focus Area", true, 35),
                  createCell("Targeted Outcomes & Deliverables", true, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Pillar 1:\nSustainable Peace & Resettlement", false, 25, COLOR_BG_LIGHT),
                  createCell("Community defense logistics, safe IDP repatriation, fortified smart townships, and civil-military liaison.", false, 35),
                  createCell("100% voluntary resettlement of displaced households; equipped CJTF/Hunters in all 27 LGAs; zero tolerance for rural insecurity.", false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Pillar 2:\nAgricultural Modernization", false, 25, COLOR_BG_LIGHT),
                  createCell("Year-round solar irrigation, Lake Chad Basin agro-revival, subsidized mechanization, and fertilizer hubs.", false, 35),
                  createCell("Empowerment of 200,000+ commercial farmers; reactivation of South Chad Irrigation Project; bumper grain & livestock yields.", false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Pillar 3:\nMega-Schools & Tech Hubs", false, 25, COLOR_BG_LIGHT),
                  createCell("Free basic education sustainability, teacher welfare incentives, and regional ICT/vocational innovation centers.", false, 35),
                  createCell("10,000 certified teachers trained; free WAEC/NECO fees; 3 regional Innovation Hubs in Maiduguri, Biu, and Monguno.", false, 40),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Pillar 4:\nInfrastructure & Trade Corridors", false, 25, COLOR_BG_LIGHT),
                  createCell("Durable inter-LGA asphalt highway networks, commercial solar mini-grids, and flood-proof urban drainage channels.", false, 35),
                  createCell("Rapid transit of farm produce to urban markets; uninterrupted power for major commercial clusters; flood-resilient Maiduguri.", false, 40),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // -------------------------------------------------------------
          // 4. DETAILED 10-POINT GOVERNANCE MANIFESTO
          // -------------------------------------------------------------
          createHeading1("4. Detailed 10-Point Governance & Policy Agenda"),

          createHeading2("Point 1: Security Architecture & Community Defense Welfare"),
          createParagraph(
            "Expanding modern communication, protective kits, enhanced monthly allowances, and comprehensive health/life insurance coverage for members of the Civilian JTF (CJTF), hunters, and local vigilantes protecting farmlands and border towns."
          ),

          createHeading2("Point 2: Solar Irrigation Revolution & 200,000 Farmers Outreach"),
          createParagraph(
            "Reactivating the South Chad Irrigation Project and deploying over 50,000 subsidized solar-powered water pumping units across Lake Chad, Alau Dam, and river basins. Guaranteed distribution of certified hybrid seeds, high-grade fertilizers, and tractor lease centers in all 27 LGA headquarters."
          ),

          createHeading2("Point 3: Mega-Schools Continuity & Digital Education"),
          createParagraph(
            "Maintaining 100% free tuition, books, and school uniforms in public primary and junior secondary schools. Institutionalizing state government payment of WAEC/NECO examination fees and establishing smart computer laboratories in every secondary school."
          ),

          createHeading2("Point 4: 24/7 Primary Healthcare Center in Every Ward"),
          createParagraph(
            "Ensuring every one of the 312 political wards in Borno State possesses a fully functional, solar-powered Primary Healthcare Center (PHC) staffed with certified midwives, essential drug banks, and free maternal and under-5 child healthcare."
          ),

          createHeading2("Point 5: Inter-LGA Asphalt Corridors & Clean Market Grids"),
          createParagraph(
            "Upgrading vital economic corridors connecting Maiduguri to Bama-Banki, Biu-Gwoza, Gubio-Damasak, and Monguno-Kukawa. Powering central markets (Monday Market, Gamboru, Tashan Bama, Biu Main Market) with independent solar mini-grids."
          ),

          createHeading2("Point 6: ₦5 Billion Borno Youth SME & Market Women Micro-Credit Fund"),
          createParagraph(
            "Establishing a revolving zero-interest entrepreneurship capital pool. Non-repayable equipment and capital grants for market women associations, alongside venture starter packs for graduates of state vocational centers."
          ),

          createHeading2("Point 7: Dignified Resettlement & Smart Township Development"),
          createParagraph(
            "Accelerating the safe, voluntary repatriation of IDPs and refugees from neighboring countries into reconstructed, permanent smart communities with piped water, electricity, clinics, schools, and police posts."
          ),

          createHeading2("Point 8: Cross-Border Commerce & Lake Chad Trade Hubs"),
          createParagraph(
            "Reactivating formal international trade corridors with Cameroon, Chad, and Niger Republic; establishing modern customs dry-port facilities and standardized livestock export terminals."
          ),

          createHeading2("Point 9: Civil Service Welfare, Promotions & Pension Regularization"),
          createParagraph(
            "Guaranteeing unbroken on-time payment of monthly civil service salaries, structured implementation of promotions and arrears, continuous administrative digitisation, and systematic clearance of gratuity backlogs."
          ),

          createHeading2("Point 10: Environmental Protection & Green Borno Initiative"),
          createParagraph(
            "Combating desert encroachment through the Great Green Wall shelterbelt expansion, planting 5 million economic gum arabic and date palm trees, and constructing master drainage canals to eliminate urban flood risks."
          ),

          // -------------------------------------------------------------
          // 5. OPERATIONAL WORKFLOW ARCHITECTURE
          // -------------------------------------------------------------
          createHeading1("5. Campaign Digital & Field Operational Workflows"),
          createParagraph(
            "The AMG 2027 campaign employs an integrated six-stage digital-to-field operational workflow designed to coordinate grassroots mobilization, verify voter participation, manage event logistics, and track financial support."
          ),

          createHeading2("Workflow 1: Voter PVC Verification & Polling Unit Routing"),
          createCallout(
            "PROCESS FLOW: VOTER ENROLLMENT & PU VERIFICATION",
            "Step 1: Citizen visits campaign portal alert bar or engages Ward Mobilizer.\nStep 2: System routes citizen to official INEC Voter Verification Portal (cvr.inecnigeria.org).\nStep 3: Citizen inputs State (Borno), LGA, Full Name, and Date of Birth to extract specific Polling Unit (PU) code.\nStep 4: Ward Mobilizer logs verified voter status and assigns voter to local neighborhood canvassing cell.",
            COLOR_PRIMARY,
            COLOR_BG_BLUE
          ),

          new Paragraph({ spacing: { after: 120 } }),

          createHeading2("Workflow 2: Volunteer Registration & 27 LGA Mobilization Engine"),
          createCallout(
            "PROCESS FLOW: VOLUNTEER ONBOARDING & LGA WARD ROUTING",
            "Step 1: Volunteer completes online/offline intake form (Full Name, Phone/WhatsApp, Email, LGA selection from 27 LGAs, Ward Name).\nStep 2: Volunteer selects specialized role (Polling Unit Agent, Door-to-Door Canvasser, Social Media Vanguard, Event Logistics).\nStep 3: Validation engine verifies valid Nigerian phone format (+234/080...) and stores profile in Campaign Council Registry.\nStep 4: Automated dispatch sends confirmation notification to volunteer and assigns contact details to the LGA Campaign Coordinator.\nStep 5: LGA Coordinator invites volunteer to weekly ward-level briefing and supplies verified APC campaign toolkits.",
            COLOR_SECONDARY,
            COLOR_BG_LIGHT
          ),

          new Paragraph({ spacing: { after: 120 } }),

          createHeading2("Workflow 3: Rally & Town Hall Event Lifecycle Management"),
          createCallout(
            "PROCESS FLOW: EVENT RSVP & ENTRY LOGISTICS",
            "Step 1: Campaign Trail publishes upcoming rally (e.g. Maiduguri Central Mega Flag-Off, Biu Agricultural Summit, Monguno Security Forum).\nStep 2: Supporter clicks 'Reserve Your Seat (RSVP)' modal and inputs attendee credentials and LGA.\nStep 3: Secretariat logs attendee data, calculates venue capacity, and issues digital/SMS entry confirmation badge.\nStep 4: Venue Protocol & Security team verifies attendee credentials at designated stadium/pavilion gates.\nStep 5: Post-event follow-up SMS transmits candidate speech highlights and ward canvassing directives.",
            COLOR_GOLD,
            COLOR_BG_LIGHT
          ),

          new Paragraph({ spacing: { after: 120 } }),

          createHeading2("Workflow 4: Grassroots Campaign Pledge & Support Tracking"),
          createCallout(
            "PROCESS FLOW: VOLUNTARY CONTRIBUTION PROCESSING",
            "Step 1: Supporter opens Campaign Support module and chooses donation tier (₦5,000, ₦10,000, ₦25,000, ₦50,000, ₦100,000, or Custom).\nStep 2: Supporter inputs contact information and records mobilization pledge.\nStep 3: Borno APC Campaign Finance Committee issues official receipt acknowledging support for megaphone kits, flyers, and voter education.\nStep 4: Contribution recorded in campaign compliance audit log in line with INEC campaign finance regulations.",
            COLOR_PRIMARY,
            COLOR_BG_GREEN
          ),

          new Paragraph({ spacing: { after: 120 } }),

          createHeading2("Workflow 5: Policy Brief & Manifesto Dissemination"),
          createCallout(
            "PROCESS FLOW: INTERACTIVE POLICY BRIEF MODAL ENGINE",
            "Step 1: Stakeholder selects policy area of interest (Security, Agriculture, Education, Healthcare, Infrastructure, Economy).\nStep 2: System renders detailed, localized policy brief modal outlining specific LGA-level deliverables.\nStep 3: User downloads full manifesto or triggers 'Join This Initiative' action linking directly to specialized volunteer desk.",
            COLOR_NAVY,
            COLOR_BG_LIGHT
          ),

          // -------------------------------------------------------------
          // 6. 27 LOCAL GOVERNMENT AREAS (LGAS) DEPLOYMENT MATRIX
          // -------------------------------------------------------------
          createHeading1("6. 27 Local Government Areas (LGAs) Deployment Matrix"),
          createParagraph(
            "The campaign machinery is distributed across all three Senatorial Districts and 27 LGAs, ensuring 100% grassroots saturation:"
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell("Senatorial District", true, 25),
                  createCell("Local Government Areas (LGAs) Included", true, 45),
                  createCell("Key Campaign Priorities", true, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Borno Central\n(8 LGAs)", false, 25, COLOR_BG_LIGHT),
                  createCell("1. Maiduguri (Metropolitan Council)\n2. Jere\n3. Bama\n4. Konduga\n5. Mafa\n6. Dikwa\n7. Ngala\n8. Kala/Balge", false, 45),
                  createCell("Urban infrastructure, flyovers, drainage, border trade restoration, ICT hubs, modern market solar power.", false, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Borno North\n(10 LGAs)", false, 25, COLOR_BG_LIGHT),
                  createCell("9. Gubio\n10. Magumeri\n11. Mobbar\n12. Abadam\n13. Kukawa\n14. Guzamala\n15. Monguno\n16. Nganzai\n17. Marte\n18. Kaga", false, 45),
                  createCell("Lake Chad agro-basin revival, fishing industry resuscitation, CJTF welfare, border security, solar irrigation.", false, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Borno South\n(9 LGAs)", false, 25, COLOR_BG_LIGHT),
                  createCell("19. Biu\n20. Hawul\n21. Askira/Uba\n22. Bayo\n23. Chibok\n24. Damboa\n25. Gwoza\n26. Kwaya Kusar\n27. Shani", false, 45),
                  createCell("Agrarian value chains, agro-processing plants, feeder roads, secondary schools expansion, rural maternal clinics.", false, 30),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // -------------------------------------------------------------
          // 7. KEY ENDORSEMENTS & COALITION LEADERSHIP
          // -------------------------------------------------------------
          createHeading1("7. Endorsements & Stakeholder Coalitions"),

          createCallout(
            "H.E. SENATOR KASHIM SHETTIMA (GCON) — Vice President of Nigeria",
            "\"Engineer Mustapha Gubio possesses the visionary intellect, technical acumen, and loyalty to Borno's long-term masterplan. He is the right leader to carry our state to greater heights of peace, infrastructure, and national prominence.\"",
            COLOR_PRIMARY,
            COLOR_BG_LIGHT
          ),
          new Paragraph({ spacing: { after: 100 } }),

          createCallout(
            "H.E. PROF. BABAGANA UMARA ZULUM (CON) — Executive Governor of Borno State",
            "\"Having worked directly with Engineer Gubio during our most demanding reconstruction and resettlement missions, I can attest to his unmatched work ethic, humility, engineering precision, and fear of God. Borno will be in safe, capable hands.\"",
            COLOR_PRIMARY,
            COLOR_BG_GREEN
          ),
          new Paragraph({ spacing: { after: 100 } }),

          createCallout(
            "BORNO YOUTH & MARKET TRADERS VANGUARD — 27 LGAs Coalition",
            "\"The Gubio-Abdullahi ticket represents continuity of peace, infrastructure, and human capital development. All 27 LGA youth structures and market associations stand firmly behind this consensus choice.\"",
            COLOR_SECONDARY,
            COLOR_BG_RED
          ),

          // -------------------------------------------------------------
          // 8. CAMPAIGN CALENDAR & KEY MILESTONES (2026 - 2027)
          // -------------------------------------------------------------
          createHeading1("8. Strategic Campaign Roadmap & Timeline"),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell("Timeline / Milestone", true, 30),
                  createCell("Event & Activity Description", true, 40),
                  createCell("Location & Target Stakeholders", true, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("May 21, 2026", false, 30, COLOR_BG_LIGHT),
                  createCell("Consensus Primary Nomination & Ticket Ratification", false, 40),
                  createCell("Maiduguri (Party Delegates, National & State Leaders)", false, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("June - July 2026", false, 30, COLOR_BG_LIGHT),
                  createCell("Unveiling of Deputy Ticket & 10-Point Educational Roadmap", false, 40),
                  createCell("SEMA Stakeholders & Education Summit, Maiduguri", false, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("September 18, 2026", false, 30, COLOR_BG_LIGHT),
                  createCell("Central Borno Mega Flag-Off & Town Hall", false, 40),
                  createCell("El-Kanemi Warriors Stadium, Maiduguri (Central LGAs)", false, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("October 05, 2026", false, 30, COLOR_BG_LIGHT),
                  createCell("Southern Borno Farmers & Youth Stakeholder Forum", false, 40),
                  createCell("Biu Central Pavilion (9 Southern LGAs)", false, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("Nov 2026 - Jan 2027", false, 30, COLOR_BG_LIGHT),
                  createCell("Intensive 27 LGA Ward-by-Ward Town Hall & Canvassing Tours", false, 40),
                  createCell("All 312 Political Wards across Borno State", false, 30),
                ],
              }),
              new TableRow({
                children: [
                  createCell("February 2027", false, 30, COLOR_BG_LIGHT),
                  createCell("Polling Unit Agent Deployment & Election Day Mobilization", false, 40),
                  createCell("All 5,000+ Borno Polling Units (Election Day: Feb 27, 2027)", false, 30),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // -------------------------------------------------------------
          // 9. CAMPAIGN SECRETARIAT & CONTACT DIRECTORY
          // -------------------------------------------------------------
          createHeading1("9. Campaign Secretariat & Communication Directory"),
          createBullet(
            "Sir Kashim Ibrahim Way, Near Government House, Maiduguri, Borno State, Nigeria.",
            "Headquarters Address"
          ),
          createBullet(
            "+234 803 000 2027 / +234 708 000 2027",
            "Campaign Hotlines"
          ),
          createBullet(
            "secretariat@gubioabdullahi2027.ng",
            "Official Email"
          ),
          createBullet(
            "https://cvr.inecnigeria.org (Official INEC Verification)",
            "Voter PVC Portal"
          ),
          createBullet(
            "Paid for and authorized by the Gubio-Abdullahi 2027 Gubernatorial Campaign Council • All Progressives Congress (APC), Borno State.",
            "Official Authorization"
          ),

          new Paragraph({ spacing: { before: 200 } }),
          createCallout(
            "DOCUMENT COMPLIANCE & LEGAL NOTICE",
            "This document is an official publication of the All Progressives Congress (APC) Borno State Chapter Gubernatorial Campaign Organization. All strategies, policy frameworks, and candidate representations comply strictly with the Electoral Act and INEC campaign regulations.",
            COLOR_SECONDARY,
            COLOR_BG_LIGHT
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "AMG_2027_Borno_APC_Campaign_Strategy_and_Workflow.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log("Document successfully generated at:", outputPath);
}

buildDocument().catch(console.error);
