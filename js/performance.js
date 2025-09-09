/* =====================================================
   Performance & Optimization Script - 2024
   ===================================================== */

(function () {
  "use strict";

  // Performance optimizations
  const performance = {
    // Lazy loading images
    lazyLoadImages: function () {
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                img.classList.add("loaded");
                observer.unobserve(img);
              }
            }
          });
        });

        document.querySelectorAll("img[data-src]").forEach((img) => {
          imageObserver.observe(img);
        });
      }
    },

    // Preload critical resources
    preloadCriticalResources: function () {
      const criticalResources = [
        { href: "css/variables.css", as: "style" },
        { href: "css/index.css", as: "style" },
        { href: "css/header.css", as: "style" },
      ];

      criticalResources.forEach((resource) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
      });
    },

    // Optimize animations
    optimizeAnimations: function () {
      // Reduce motion for users who prefer it
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.style.setProperty("--transition-fast", "0ms");
        document.documentElement.style.setProperty(
          "--transition-normal",
          "0ms"
        );
        document.documentElement.style.setProperty("--transition-slow", "0ms");
      }

      // Use requestAnimationFrame for smooth animations
      let animationId;
      function animate() {
        // Animation logic here
        animationId = requestAnimationFrame(animate);
      }
      animate();

      // Cleanup on page unload
      window.addEventListener("beforeunload", () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      });
    },

    // Critical Web Vitals monitoring
    monitorWebVitals: function () {
      // Monitor Largest Contentful Paint (LCP)
      if ("PerformanceObserver" in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
          });
          observer.observe({ entryTypes: ["largest-contentful-paint"] });
        } catch (e) {
          console.warn("Performance monitoring not supported");
        }
      }
    },

    // Font optimization
    optimizeFonts: function () {
      // Font display swap for better loading
      const fontLink = document.createElement("link");
      fontLink.rel = "preconnect";
      fontLink.href = "https://fonts.googleapis.com";
      document.head.appendChild(fontLink);

      const fontLinkCrossorigin = document.createElement("link");
      fontLinkCrossorigin.rel = "preconnect";
      fontLinkCrossorigin.href = "https://fonts.gstatic.com";
      fontLinkCrossorigin.crossOrigin = "anonymous";
      document.head.appendChild(fontLinkCrossorigin);
    },

    // Service Worker registration
    registerServiceWorker: function () {
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker.register("/sw.js");
        });
      }
    },
  };

  // Analytics and tracking
  const analytics = {
    // Track user interactions
    trackInteractions: function () {
      // Track button clicks
      document.addEventListener("click", (e) => {
        if (e.target.matches(".btn, button")) {
          const buttonText = e.target.textContent.trim();
          this.trackEvent("button_click", { button_text: buttonText });
        }
      });

      // Track form submissions
      document.addEventListener("submit", (e) => {
        if (e.target.matches("form")) {
          this.trackEvent("form_submission", { form_id: e.target.id });
        }
      });

      // Track scroll depth
      let maxScroll = 0;
      window.addEventListener(
        "scroll",
        this.throttle(() => {
          const scrollPercent = Math.round(
            (window.scrollY /
              (document.body.scrollHeight - window.innerHeight)) *
              100
          );
          if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) {
              this.trackEvent("scroll_depth", { percent: maxScroll });
            }
          }
        }, 1000)
      );
    },

    // Track custom events
    trackEvent: function (eventName, parameters = {}) {
      // Google Analytics 4 tracking
      if (typeof gtag !== "undefined") {
        gtag("event", eventName, parameters);
      }
    },

    // Throttle function for performance
    throttle: function (func, limit) {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },
  };

  // SEO enhancements
  const seo = {
    // Generate breadcrumbs
    generateBreadcrumbs: function () {
      const path = window.location.pathname;
      const segments = path.split("/").filter((segment) => segment);

      if (segments.length > 0) {
        const breadcrumbContainer = document.createElement("nav");
        breadcrumbContainer.setAttribute("aria-label", "Breadcrumb");
        breadcrumbContainer.className = "breadcrumb";

        let breadcrumbHTML = "<ol>";
        breadcrumbHTML += '<li><a href="/">Início</a></li>';

        let currentPath = "";
        segments.forEach((segment, index) => {
          currentPath += "/" + segment;
          const isLast = index === segments.length - 1;
          const segmentName =
            segment.charAt(0).toUpperCase() + segment.slice(1);

          if (isLast) {
            breadcrumbHTML += `<li aria-current="page">${segmentName}</li>`;
          } else {
            breadcrumbHTML += `<li><a href="${currentPath}">${segmentName}</a></li>`;
          }
        });

        breadcrumbHTML += "</ol>";
        breadcrumbContainer.innerHTML = breadcrumbHTML;

        const main = document.querySelector("main");
        if (main && segments.length > 0) {
          main.insertBefore(breadcrumbContainer, main.firstChild);
        }
      }
    },

    // Add structured data
    addStructuredData: function () {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "LPL Assessoria em Seguros",
        description:
          "Empresa especializada em serviços administrativos, investigações e planos de saúde",
        url: window.location.origin,
        telephone: "+55-41-XXXXX-XXXX",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Av. República Argentina, 1307",
          addressLocality: "Curitiba",
          addressRegion: "PR",
          postalCode: "80620-010",
          addressCountry: "BR",
        },
        openingHours: "Mo-Fr 08:00-18:00",
        priceRange: "$$",
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    },
  };

  // Accessibility enhancements
  const accessibility = {
    // Enhance keyboard navigation
    enhanceKeyboardNavigation: function () {
      // Add visible focus indicators
      document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          document.body.classList.add("keyboard-navigation");
        }
      });

      document.addEventListener("mousedown", () => {
        document.body.classList.remove("keyboard-navigation");
      });
    },

    // Add skip links
    addSkipLinks: function () {
      const skipLink = document.createElement("a");
      skipLink.href = "#main-content";
      skipLink.textContent = "Pular para o conteúdo principal";
      skipLink.className = "skip-link";
      document.body.insertBefore(skipLink, document.body.firstChild);
    },

    // Improve form accessibility
    improveFormAccessibility: function () {
      const forms = document.querySelectorAll("form");
      forms.forEach((form) => {
        const inputs = form.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
          const label = form.querySelector(`label[for="${input.id}"]`);
          if (!label && input.type !== "submit") {
            console.warn("Input without label found:", input);
          }
        });
      });
    },
  };

  // Initialize all optimizations
  function init() {
    // Performance optimizations
    performance.lazyLoadImages();
    performance.optimizeFonts();
    performance.optimizeAnimations();
    performance.monitorWebVitals();

    // Analytics
    analytics.trackInteractions();

    // SEO enhancements
    seo.addStructuredData();

    // Accessibility
    accessibility.enhanceKeyboardNavigation();
    accessibility.improveFormAccessibility();
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Error tracking
  window.addEventListener("error", (e) => {
    console.error("JavaScript error:", e.error);
    analytics.trackEvent("javascript_error", {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
    });
  });

  // Page visibility API for performance
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      analytics.trackEvent("page_hidden");
    } else {
      analytics.trackEvent("page_visible");
    }
  });
})();
