'use strict';

/**
 * Norio color-mode switcher.
 * Adapted from Orisa color-modes.js to use `data-color-scheme`
 * (see layouts/base.njk + abstracts/_css-vars.scss) instead of Bootstrap `data-bs-theme`.
 *
 * Loaded in <head> so the scheme is on <html> before the pre-loader paints.
 */
var ATTR = 'data-color-scheme';
var STORAGE_KEY = 'norio-color-scheme';

function resolveColorScheme() {
    var htmlTheme = document.documentElement.getAttribute(ATTR);
    var savedTheme = localStorage.getItem(STORAGE_KEY);
    var defaultTheme = 'light';
    var siteColorConfig = window.norioThemeConfig || window.idekoTemplateConfig || window.idekoThemeConfig;

    if (siteColorConfig && siteColorConfig.defaultDarkMode) {
        defaultTheme = 'dark';
    }

    if (htmlTheme === 'dark' || htmlTheme === 'light') {
        return htmlTheme;
    }

    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return defaultTheme;
}

function applyHtmlColorScheme(theme) {
    if (document.documentElement.getAttribute(ATTR) !== theme) {
        document.documentElement.setAttribute(ATTR, theme);
    }
}

applyHtmlColorScheme(resolveColorScheme());

document.addEventListener('DOMContentLoaded', function () {
    var switchers = document.querySelectorAll('.dark-light-switcher');

    function getToggle(switcher) {
        return switcher.querySelector('#switch, [data-theme-toggle], .menu-overlay-1__theme-input');
    }

    function updateTheme(isDarkMode) {
        switchers.forEach(function (switcher) {
            var checkbox = getToggle(switcher);

            if (checkbox) {
                checkbox.checked = isDarkMode;
                checkbox.setAttribute('aria-checked', String(isDarkMode));
            }
        });

        applyHtmlColorScheme(isDarkMode ? 'dark' : 'light');
    }

    var currentTheme = resolveColorScheme();
    var isDarkMode = currentTheme === 'dark';

    applyHtmlColorScheme(currentTheme);
    updateTheme(isDarkMode);

    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            document.documentElement.classList.add('is-theme-motion');
        });
    });

    switchers.forEach(function (switcher) {
        var checkbox = getToggle(switcher);

        if (!checkbox) return;

        checkbox.addEventListener('change', function () {
            var nextIsDark = checkbox.checked;
            var newTheme = nextIsDark ? 'dark' : 'light';
            localStorage.setItem(STORAGE_KEY, newTheme);
            updateTheme(nextIsDark);
        });
    });
});
