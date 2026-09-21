import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ritesh Patel — Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.45;
      font-size: 9.8pt;
      padding: 38px 45px;
    }

    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }

    .name {
      font-size: 22pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
      text-transform: uppercase;
    }

    .role {
      font-size: 11pt;
      font-weight: 600;
      color: #475569;
      margin-top: 2px;
      margin-bottom: 6px;
    }

    .contact-info {
      font-size: 8.8pt;
      color: #64748b;
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .contact-info a {
      color: #0f172a;
      text-decoration: none;
      font-weight: 600;
    }

    .section-title {
      font-size: 10.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
    }

    .item {
      margin-bottom: 10px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      color: #0f172a;
      font-size: 9.8pt;
    }

    .item-company {
      font-weight: 700;
      color: #0f172a;
    }

    .item-role {
      font-weight: 600;
      color: #334155;
    }

    .item-sub {
      display: flex;
      justify-content: space-between;
      font-size: 8.8pt;
      color: #64748b;
      font-style: italic;
      margin-bottom: 3px;
    }

    ul {
      margin-left: 16px;
      margin-top: 3px;
      margin-bottom: 6px;
    }

    li {
      margin-bottom: 3px;
      font-size: 9.2pt;
      color: #334155;
      line-height: 1.38;
    }

    li strong {
      color: #0f172a;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4px;
      font-size: 9.2pt;
    }

    .skill-category {
      margin-bottom: 3px;
    }

    .skill-category strong {
      color: #0f172a;
      font-weight: 700;
    }

    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="name">Ritesh Patel</div>
    <div class="role">Aspiring Digital Marketer</div>
    <div class="contact-info">
      <span>riteshkr90patel@gmail.com</span>
      <span>•</span>
      <span>+91 88772 47266</span>
      <span>•</span>
      <a href="https://www.linkedin.com/in/ritesh-patel1/">LinkedIn</a>
      <span>•</span>
      <a href="https://ritesh-patel.vercel.app/">Portfolio</a>
      <span>•</span>
      <span>Jaipur, Rajasthan, India, 303905</span>
    </div>
  </div>

  <!-- Objective -->
  <div class="section-title">Objective</div>
  <p style="font-size: 9.2pt; color: #334155; line-height: 1.42;">
    BBA (Digital Marketing) student eager to apply hands-on experience in paid Meta Ad campaigns, SEO, social media growth, and Google Business Profile management to drive measurable brand growth. Grew a client social page's reach from 7K to 110K+ and delivered 33K impressions on a INR 400 Meta Ads test budget.
  </p>

  <!-- Experience -->
  <div class="section-title">Experience</div>

  <div class="item">
    <div class="item-header">
      <span>Digital Marketing Intern — <span class="item-company">First Attempt</span></span>
      <span>May 2026 – Present</span>
    </div>
    <div class="item-sub">
      <span>Jaipur, India</span>
    </div>
    <ul>
      <li>Ran a Meta Ads campaign that delivered 33,000 impressions on a INR 400 test budget, demonstrating efficient low-budget audience targeting.</li>
      <li>Increased a client's social media page reach from 7K to 110K+ (15x growth) through content and posting strategy.</li>
      <li>Performed on-page SEO and keyword/hashtag research for client First Job Hub to improve organic search visibility.</li>
      <li>Created and optimized a Google Business Profile that generated 100+ views within 10 days of running ads, improving local search visibility.</li>
      <li>Handled quality testing of marketing assets and campaign pages before launch.</li>
    </ul>
  </div>

  <div class="item">
    <div class="item-header">
      <span>Operations Intern — <span class="item-company">Findtern</span></span>
      <span>Nov 2025 – Jan 2026</span>
    </div>
    <div class="item-sub">
      <span>Jaipur, India</span>
    </div>
    <ul>
      <li>Conducted bug testing, digital marketing content creation, and data research in a fast-paced operations role spanning technical and creative work.</li>
      <li>Identified and reported 100+ bugs through quality assurance testing, collaborating with cross-functional teams on operational activities.</li>
    </ul>
  </div>

  <div class="item">
    <div class="item-header">
      <span>Business Development Intern — <span class="item-company">Drone Rangers</span></span>
      <span>Aug 2025 – Oct 2025</span>
    </div>
    <div class="item-sub">
      <span>Jaipur, India</span>
    </div>
    <ul>
      <li>Led client outreach and campaign planning/execution for close to 300 prospective clients, supporting business development activities.</li>
      <li>Built target audience research and reach plans, generating 25 sales leads from target markets to support the company's growth strategy.</li>
    </ul>
  </div>

  <!-- Projects -->
  <div class="section-title">Projects</div>

  <div class="item">
    <div class="item-header">
      <span>YouTube Content Channel — <span class="item-company">Independent Creator</span></span>
      <span>Feb 2024 – Mar 2024</span>
    </div>
    <ul>
      <li>Established and grew a YouTube channel producing daily short-form videos from trending topics, reaching an average of ~65K monthly views.</li>
      <li>Edited all video content end-to-end and incorporated AI tools to increase production speed and output consistency.</li>
    </ul>
  </div>

  <div class="item">
    <div class="item-header">
      <span>Website SEO &amp; Audit Tool</span>
      <span style="font-weight: 600; font-size: 8.8pt; color: #64748b;">Directed AI-Assisted Development, Node.js/Playwright</span>
    </div>
    <ul>
      <li>Conceptualized and specified a full-site crawler (sitemap parsing, recursive/BFS crawling, URL normalization and deduplication) to automatically discover all pages on a website, directing AI tools to build it.</li>
      <li>Planned and tested automated SEO, accessibility, performance, and security audit modules covering 25+ checks, including meta tags, heading structure, alt text, broken links, page speed metrics, and security headers.</li>
      <li>Defined the reporting structure for a JSON-based reporting engine generating separate module-wise audit reports (SEO, performance, accessibility, security, broken links) for every crawl.</li>
      <li>Directed AI-assisted development of an interactive CLI workflow with full-audit mode, individual module testing, and reusable crawl data for faster re-runs.</li>
    </ul>
  </div>

  <div class="item">
    <div class="item-header">
      <span>Personal AI Browser QA Agent</span>
      <span style="font-weight: 600; font-size: 8.8pt; color: #64748b;">Playwright, MCP (Directed AI-Assisted Development)</span>
    </div>
    <ul>
      <li>Directed AI-assisted development of a Playwright/MCP-based browser automation and QA testing agent with self-healing element recovery and a smart assertion engine covering 13 assertion types.</li>
      <li>Specified a multi-provider AI orchestration layer (OpenAI, Claude, Gemini) with automatic failover and cost/latency-based routing across providers.</li>
      <li>Defined requirements for a test evidence engine capturing screenshots, DOM snapshots, and failure logs, validated across 29 automated regression test suites.</li>
    </ul>
  </div>

  <div class="item">
    <div class="item-header">
      <span>Post Link Collector CLI</span>
      <span style="font-weight: 600; font-size: 8.8pt; color: #64748b;">Python (Directed AI-Assisted Development)</span>
    </div>
    <ul>
      <li>Conceptualized a Python CLI tool to collect post and video links from YouTube, LinkedIn, Instagram, and Facebook via direct web scraping, requiring no API keys.</li>
      <li>Directed AI-assisted development of deduplication logic and multi-format export (TXT, CSV, JSON), validated with an automated test suite.</li>
    </ul>
  </div>

  <!-- Qualification -->
  <div class="section-title">Qualification</div>
  <div class="item">
    <div class="item-header">
      <span>Bachelor of Business Administration (BBA) — Digital Marketing</span>
      <span>Aug 2023 – Expected 2026</span>
    </div>
    <div class="item-sub">
      <span>Poornima University, Jaipur, Rajasthan</span>
    </div>
    <ul>
      <li>Thesis: "Innovation in Digital Marketing Practices"</li>
    </ul>
  </div>

  <!-- Certifications -->
  <div class="section-title">Certifications</div>
  <ul>
    <li><strong>Digital Marketing</strong> — Illinois Institute of Technology (Coursera)</li>
    <li><strong>Search Engine Optimization (SEO)</strong> — Squarespace (Coursera)</li>
    <li><strong>Google Analytics for Beginners</strong> — Google</li>
  </ul>

  <!-- Skills -->
  <div class="section-title">Skills</div>
  <div class="skills-grid">
    <div class="skill-category">
      <strong>Marketing &amp; Technical Skills:</strong> Meta Ads Manager, Google Ads &amp; Analytics, Google Business Profile, SEO (on-page/off-page), Canva &amp; Adobe Express, AI Tools (Prompting)
    </div>
    <div class="skill-category">
      <strong>Core Strengths:</strong> Audience Analysis &amp; Campaign Execution, Creative Thinking &amp; Lead Generation, Leadership &amp; Adaptability
    </div>
  </div>

  <!-- Volunteering -->
  <div class="section-title">Volunteering</div>
  <div class="item">
    <div class="item-header">
      <span>Raising Rajasthan, Jaipur Jewellery Show (JECC), Jaipur Fashion Expo</span>
      <span>Dec 2024 – Jan 2025</span>
    </div>
    <ul>
      <li>Oversaw daily on-ground operations for events with 1,000–1,500+ attendees, coordinating logistics and teams.</li>
    </ul>
  </div>

</body>
</html>`;

async function generatePdf() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: "networkidle" });
  
  const outputPath = path.resolve("./public/Ritesh_Patel_Resume.pdf");
  const cvPath = path.resolve("./public/Ritesh_Patel_CV.pdf");

  await page.pdf({
    path: outputPath,
    format: "A4",
    margin: {
      top: "12mm",
      bottom: "12mm",
      left: "14mm",
      right: "14mm"
    },
    printBackground: true
  });

  fs.copyFileSync(outputPath, cvPath);

  console.log("Successfully generated PDF to:", outputPath);
  console.log("Successfully copied to:", cvPath);

  await browser.close();
}

generatePdf().catch(console.error);
