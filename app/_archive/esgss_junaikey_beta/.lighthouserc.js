// Lighthouse CI 配置
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:.*:4173',
      url: ['http://localhost:4173'],
      settings: {
        preset: 'desktop',
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        // 效能斷言
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': 'off', // ESG儀表板不是PWA

        // 具體指標
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2500 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // 無障礙性檢查
        'aria-allowed-attr': 'error',
        'aria-hidden-body': 'error',
        'aria-hidden-focus': 'error',
        'aria-input-field-name': 'error',
        'aria-required-attr': 'error',
        'aria-required-children': 'error',
        'aria-required-parent': 'error',
        'aria-roles': 'error',
        'aria-toggle-field-name': 'error',
        'aria-valid-attr-value': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'color-contrast': 'error',
        'definition-list': 'error',
        dlitem: 'error',
        'document-title': 'error',
        'duplicate-id-active': 'error',
        'duplicate-id-aria': 'error',
        'form-field-multiple-labels': 'error',
        'frame-title': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        'input-image-alt': 'error',
        label: 'error',
        'link-name': 'error',
        list: 'error',
        listitem: 'error',
        'meta-viewport': 'error',
        'object-alt': 'error',
        tabindex: 'error',
        'td-headers-attr': 'error',
        'th-has-data-cells': 'error',
        'valid-lang': 'error',
        'video-caption': 'error',
        'video-description': 'error',

        // 最佳實踐
        doctype: 'error',
        charset: 'error',
        'font-size': 'error',
        viewport: 'error',
        'tap-targets': 'error',
        'geolocation-on-start': 'off', // ESG儀表板不需要地理位置
        'notification-on-start': 'off', // ESG儀表板不需要通知
        deprecations: 'warn',
        'inspector-issues': 'warn',
        'uses-http2': 'warn',
        'uses-long-cache-ttl': 'warn',
        'uses-passive-event-listeners': 'warn',
        'no-unload-listeners': 'warn',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        'duplicated-javascript': 'warn',
        'legacy-javascript': 'warn',
        'total-byte-weight': ['warn', { maxNumericValue: 2048000 }], // 2MB

        // SEO檢查
        'document-title': 'error',
        'meta-description': 'error',
        'http-status-code': 'error',
        'link-text': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'error',
        'tap-targets': 'error',
        'font-size': 'error',
        plugins: 'error',
        viewport: 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
