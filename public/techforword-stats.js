/**
 * TechForWord Statistics Counter
 * Automatically counts and displays courses, students, webinars, and insiders
 *
 * Usage: Include this script in your page and ensure you have elements with IDs:
 * - courses
 * - students
 * - webinars
 * - insiders
 */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    // API endpoints
    urls: [
      "https://techforword-courses.vercel.app/courses",
      "https://techforword-courses.vercel.app/enrollments",
      "https://techforword-courses.vercel.app/course",
      "https://techforword-courses.vercel.app/users",
    ],

    // CountUp animation options
    countUpOptions: {
      duration: 3,
      enableScrollSpy: false,
      scrollSpyDelay: 1,
      scrollSpyOnce: true,
    },

    // Debug mode (set to false in production)
    debug: false,
  };

  // Utility functions
  function log(message, type = "info") {
    if (CONFIG.debug) {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] ${message}`);

      // Also log to debug info div
      const debugInfo = document.getElementById("debug-info");
      if (debugInfo) {
        debugInfo.textContent += `[${timestamp}] ${message}\n`;
      }
    }
  }

  // Show debug status
  function showDebugStatus() {
    const debugInfo = document.getElementById("debug-info");
    if (debugInfo) {
      if (CONFIG.debug) {
        debugInfo.textContent = "Debug mode: ENABLED\n";
      } else {
        debugInfo.textContent =
          "Debug mode: DISABLED\nTo enable debug, set CONFIG.debug = true in techforword-stats.js";
      }
    }
  }

  function validateElements() {
    const elements = {
      courses: document.getElementById("courses"),
      students: document.getElementById("students"),
      webinars: document.getElementById("webinars"),
      insiders: document.getElementById("insiders"),
    };

    const missing = [];
    for (const [name, element] of Object.entries(elements)) {
      if (!element) {
        missing.push(name);
      }
    }

    if (missing.length > 0) {
      log(`Missing DOM elements: ${missing.join(", ")}`, "error");
      return false;
    }

    return elements;
  }

  function safeCountUp(element, value, label) {
    if (!element) {
      log(`${label}: Element not found`, "error");
      return false;
    }

    if (typeof value !== "number" || isNaN(value)) {
      log(`${label}: Invalid value ${value}`, "error");
      return false;
    }

    try {
      new CountUp(element, value, CONFIG.countUpOptions).start();
      log(`${label}: Started with value ${value}`, "success");
      return true;
    } catch (error) {
      log(`${label}: CountUp error - ${error.message}`, "error");
      return false;
    }
  }

  function extractData(result, fallback = 0) {
    if (result.status === "fulfilled" && result.value) {
      log(`API success, data: ${JSON.stringify(result.value)}`);
      return result.value;
    }
    log(`API failed, using fallback: ${JSON.stringify(fallback)}`, "error");
    return fallback;
  }

  function calculateWebinarsCount(webinars) {
    // Define non-webinar section keywords
    const nonWebinarKeywords = [
      "welcome",
      "intro",
      "getting started",
      "overview",
      "archived",
      "challenges",
      "guest expert sessions",
      "quick wins",
      "roundtables",
      "growth paths",
    ];

    // Include all sections with lectures, except non-webinar sections
    const webinarSections = webinars.filter((section) => {
      const name = section.name?.toLowerCase() || "";
      const hasLectures = section.lectures && section.lectures.length > 0;

      // Check if section contains any non-webinar keywords
      const isNonWebinarSection = nonWebinarKeywords.some((keyword) =>
        name.includes(keyword)
      );

      return hasLectures && !isNonWebinarSection;
    });

    const totalCount = webinarSections.reduce((total, section) => {
      return total + (section.lectures?.length || 0);
    }, 0);

    log(
      `Found ${webinarSections.length} webinar sections (filtered from ${webinars.length} total sections)`
    );

    // Log all sections for debugging
    log("=== ALL SECTIONS ===");
    webinars.forEach((section, index) => {
      const name = section.name?.toLowerCase() || "";
      const hasLectures = section.lectures && section.lectures.length > 0;
      const isNonWebinarSection = nonWebinarKeywords.some((keyword) =>
        name.includes(keyword)
      );
      const isIncluded = hasLectures && !isNonWebinarSection;

      log(
        `  ${index + 1}. id=${section.id}, name="${section.name}", lectures=${
          section.lectures?.length || 0
        }, included=${isIncluded}`
      );
    });

    log("=== FILTERED SECTIONS ===");
    webinarSections.forEach((section, index) => {
      log(
        `  ${index + 1}. id=${section.id}, name="${section.name}", lectures=${
          section.lectures?.length || 0
        }`
      );
    });
    log(`Total webinars count: ${totalCount}`);

    return totalCount;
  }

  // Main function
  async function initStats() {
    try {
      // Show debug status first
      showDebugStatus();

      log("Starting TechForWord stats initialization...");

      // Load CountUp library
      const { CountUp } = await import("./countUp.min.js");

      // Make CountUp available globally
      window.CountUp = CountUp;

      log("CountUp loaded successfully");

      // Validate DOM elements
      const elements = validateElements();
      if (!elements) {
        log("Cannot proceed without required DOM elements", "error");
        return;
      }

      // Make API calls
      log("Making API calls...");
      const apiPromises = CONFIG.urls.map((url) =>
        fetch(url)
          .then((res) => res.json())
          .catch((error) => {
            log(`API call failed for ${url}: ${error.message}`, "error");
            return { data: null };
          })
      );

      const results = await Promise.allSettled(apiPromises);

      // Extract data
      const coursesData = extractData(results[0], {
        data: { meta: { total: 0 } },
      });
      const enrollmentsData = extractData(results[1], {
        data: { meta: { total: 0 } },
      });
      const courseData = extractData(results[2], {
        data: { course: { lecture_sections: [] } },
      });
      const usersData = extractData(results[3], {
        data: { meta: { total: 0 } },
      });

      const coursesCount = coursesData?.data?.meta?.total || 0;
      const insidersCount = enrollmentsData?.data?.meta?.total || 0;
      const webinars = courseData?.data?.course?.lecture_sections || [];
      const studentsCount = usersData?.data?.meta?.total || 0;

      log(`Courses count: ${coursesCount}`);
      log(`Insiders count: ${insidersCount}`);
      log(`Students count: ${studentsCount}`);

      // Calculate webinars count
      const webinarsCount = calculateWebinarsCount(webinars);

      // Start CountUp animations
      const results_animations = {
        courses: safeCountUp(elements.courses, coursesCount, "Courses"),
        students: safeCountUp(elements.students, studentsCount, "Students"),
        webinars: safeCountUp(elements.webinars, webinarsCount, "Webinars"),
        insiders: safeCountUp(elements.insiders, insidersCount, "Insiders"),
      };

      const successCount =
        Object.values(results_animations).filter(Boolean).length;
      log(
        `CountUp animations: ${successCount}/4 successful`,
        successCount === 4 ? "success" : "error"
      );
    } catch (error) {
      log(`Initialization error: ${error.message}`, "error");
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStats);
  } else {
    initStats();
  }

  // Expose for manual initialization if needed
  window.TechForWordStats = {
    init: initStats,
    config: CONFIG,
  };
})();
