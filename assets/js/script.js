
/*jdd*/

(function (jtd, undefined) {

    jtd.addEvent = function (el, type, handler) {
        if (el.attachEvent) el.attachEvent('on' + type, handler); else el.addEventListener(type, handler);
    }

    jtd.removeEvent = function (el, type, handler) {
        if (el.detachEvent) el.detachEvent('on' + type, handler); else el.removeEventListener(type, handler);
    }

    jtd.onReady = function (ready) {
        if (document.readyState != 'loading') ready();
        else if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready);
        else document.attachEvent('onreadystatechange', function () {
            if (document.readyState == 'complete') ready();
        });
    }

    // Show/hide mobile menu

    function initNav() {
        jtd.addEvent(document, 'click', function (e) {
            var target = e.target;

            while (target && !(target.classList && target.classList.contains('nav-list-expander'))) {
                target = target.parentNode;
            }

            if (target) {
                e.preventDefault();
                target.ariaPressed = target.parentNode.classList.toggle('active');
            }
        });

        const siteNav = document.getElementById('site-nav');
        const mainHeader = document.getElementById('main-header');
        const menuButton = document.getElementById('menu-button');

        disableHeadStyleSheets();

        jtd.addEvent(menuButton, 'click', function (e) {
            e.preventDefault();

            if (menuButton.classList.toggle('nav-open')) {
                siteNav.classList.add('nav-open');
                mainHeader.classList.add('nav-open');
                menuButton.ariaPressed = true;
            }

            else {
                siteNav.classList.remove('nav-open');
                mainHeader.classList.remove('nav-open');
                menuButton.ariaPressed = false;
            }
        });
    }

    // The <head> element is assumed to include the following stylesheets:
    // - a <link> to /assets/css/just-the-docs-head-nav.css,
    //             with id 'jtd-head-nav-stylesheet'
    // - a <style> containing the result of _includes/css/activation.scss.liquid.
    // To avoid relying on the order of stylesheets (which can change with HTML
    // compression, user-added JavaScript, and other side effects), stylesheets
    // are only interacted with via ID

    function disableHeadStyleSheets() {
        const headNav = document.getElementById('jtd-head-nav-stylesheet');

        if (headNav) {
            headNav.disabled = true;
        }

        const activation = document.getElementById('jtd-nav-activation');

        if (activation) {
            activation.disabled = true;
        }
    }

    // Site search

    function initSearch() {
        var request = new XMLHttpRequest();
        request.open('GET', '/articles/assets/js/search-data.json', true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var docs = JSON.parse(request.responseText);

                lunr.tokenizer.separator = /[\s/]+/ var index = lunr(function () {
                    this.ref('id');

                    this.field('title', {
                        boost: 200
                    });

                    this.field('content', {
                        boost: 2
                    });
                    this.field('relUrl');

                    this.metadataWhitelist = ['position'] for (var i in docs) {

                        this.add({
                            id: i,
                            title: docs[i].title,
                            content: docs[i].content,
                            relUrl: docs[i].relUrl
                        });
                    }
                });

                searchLoaded(index, docs);
            }

            else {
                console.log('Error loading ajax request. Request status:' + request.status);
            }
        }

            ;

        request.onerror = function () {
            console.log('There was a connection error');
        }

            ;

        request.send();
    }

    function searchLoaded(index, docs) {
        var index = index;
        var docs = docs;
        var searchInput = document.getElementById('search-input');
        var searchResults = document.getElementById('search-results');
        var mainHeader = document.getElementById('main-header');
        var currentInput;
        var currentSearchIndex = 0;

        // add event listener on ctrl + <focus_shortcut_key> for showing the search input
        jtd.addEvent(document, 'keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();

                mainHeader.classList.add('nav-open');
                searchInput.focus();
            }
        });

        function showSearch() {
            document.documentElement.classList.add('search-active');
        }

        function hideSearch() {
            document.documentElement.classList.remove('search-active');
        }

        function update() {
            currentSearchIndex++;

            var input = searchInput.value;

            if (input === '') {
                hideSearch();
            }

            else {
                showSearch();
                // scroll search input into view, workaround for iOS Safari
                window.scroll(0, -1);

                setTimeout(function () {
                    window.scroll(0, 0);
                }

                    , 0);
            }

            if (input === currentInput) {
                return;
            }

            currentInput = input;
            searchResults.innerHTML = '';

            if (input === '') {
                return;
            }

            var results = index.query(function (query) {
                var tokens = lunr.tokenizer(input) query.term(tokens, {
                    boost: 10
                });

                query.term(tokens, {
                    wildcard: lunr.Query.wildcard.TRAILING
                });
            });

            if ((results.length == 0) && (input.length > 2)) {
                var tokens = lunr.tokenizer(input).filter(function (token, i) {
                    return token.str.length < 20;

                }) if (tokens.length > 0) {
                    results = index.query(function (query) {
                        query.term(tokens, {
                            editDistance: Math.round(Math.sqrt(input.length / 2 - 1))
                        });
                    });
                }
            }

            if (results.length == 0) {
                var noResultsDiv = document.createElement('div');
                noResultsDiv.classList.add('search-no-result');
                noResultsDiv.innerText = 'No results found';
                searchResults.appendChild(noResultsDiv);

            }

            else {
                var resultsList = document.createElement('ul');
                resultsList.classList.add('search-results-list');
                searchResults.appendChild(resultsList);

                addResults(resultsList, results, 0, 10, 100, currentSearchIndex);
            }

            function addResults(resultsList, results, start, batchSize, batchMillis, searchIndex) {
                if (searchIndex != currentSearchIndex) {
                    return;
                }

                for (var i = start; i < (start + batchSize); i++) {
                    if (i == results.length) {
                        return;
                    }

                    addResult(resultsList, results[i]);
                }

                setTimeout(function () {
                    addResults(resultsList, results, start + batchSize, batchSize, batchMillis, searchIndex);
                }

                    , batchMillis);
            }

            function addResult(resultsList, result) {
                var doc = docs[result.ref];

                var resultsListItem = document.createElement('li');
                resultsListItem.classList.add('search-results-list-item');
                resultsList.appendChild(resultsListItem);

                var resultLink = document.createElement('a');
                resultLink.classList.add('search-result');
                resultLink.setAttribute('href', doc.url);
                resultsListItem.appendChild(resultLink);

                var resultTitle = document.createElement('div');
                resultTitle.classList.add('search-result-title');
                resultLink.appendChild(resultTitle);

                // note: the SVG svg-doc is only loaded as a Jekyll include if site.search_enabled is true; see _includes/icons/icons.html
                var resultDoc = document.createElement('div');
                resultDoc.classList.add('search-result-doc');
                resultDoc.innerHTML = '<svg viewBox="0 0 24 24" class="search-result-icon"><use xlink:href="#svg-doc"></use></svg>';
                resultTitle.appendChild(resultDoc);

                var resultDocTitle = document.createElement('div');
                resultDocTitle.classList.add('search-result-doc-title');
                resultDocTitle.innerHTML = doc.doc;
                resultDoc.appendChild(resultDocTitle);
                var resultDocOrSection = resultDocTitle;

                if (doc.doc != doc.title) {
                    resultDoc.classList.add('search-result-doc-parent');
                    var resultSection = document.createElement('div');
                    resultSection.classList.add('search-result-section');
                    resultSection.innerHTML = doc.title;
                    resultTitle.appendChild(resultSection);
                    resultDocOrSection = resultSection;
                }

                var metadata = result.matchData.metadata;
                var titlePositions = [];
                var contentPositions = [];

                for (var j in metadata) {
                    var meta = metadata[j];

                    if (meta.title) {
                        var positions = meta.title.position;

                        for (var k in positions) {
                            titlePositions.push(positions[k]);
                        }
                    }

                    if (meta.content) {
                        var positions = meta.content.position;

                        for (var k in positions) {
                            var position = positions[k];
                            var previewStart = position[0];
                            var previewEnd = position[0] + position[1];
                            var ellipsesBefore = true;
                            var ellipsesAfter = true;

                            for (var k = 0; k < 5; k++) {
                                var nextSpace = doc.content.lastIndexOf(' ', previewStart - 2);
                                var nextDot = doc.content.lastIndexOf('. ', previewStart - 2);

                                if ((nextDot >= 0) && (nextDot > nextSpace)) {
                                    previewStart = nextDot + 1;
                                    ellipsesBefore = false;
                                    break;
                                }

                                if (nextSpace < 0) {
                                    previewStart = 0;
                                    ellipsesBefore = false;
                                    break;
                                }

                                previewStart = nextSpace + 1;
                            }

                            for (var k = 0; k < 10; k++) {
                                var nextSpace = doc.content.indexOf(' ', previewEnd + 1);
                                var nextDot = doc.content.indexOf('. ', previewEnd + 1);

                                if ((nextDot >= 0) && (nextDot < nextSpace)) {
                                    previewEnd = nextDot;
                                    ellipsesAfter = false;
                                    break;
                                }

                                if (nextSpace < 0) {
                                    previewEnd = doc.content.length;
                                    ellipsesAfter = false;
                                    break;
                                }

                                previewEnd = nextSpace;
                            }

                            contentPositions.push({
                                highlight: position,
                                previewStart: previewStart, previewEnd: previewEnd,
                                ellipsesBefore: ellipsesBefore, ellipsesAfter: ellipsesAfter
                            });
                        }
                    }
                }

                if (titlePositions.length > 0) {
                    titlePositions.sort(function (p1, p2) {
                        return p1[0] - p2[0]
                    });
                    resultDocOrSection.innerHTML = '';
                    addHighlightedText(resultDocOrSection, doc.title, 0, doc.title.length, titlePositions);
                }

                if (contentPositions.length > 0) {
                    contentPositions.sort(function (p1, p2) {
                        return p1.highlight[0] - p2.highlight[0]
                    });
                    var contentPosition = contentPositions[0];

                    var previewPosition = {
                        highlight: [contentPosition.highlight],
                        previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
                        ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
                    }

                        ;
                    var previewPositions = [previewPosition];

                    for (var j = 1; j < contentPositions.length; j++) {
                        contentPosition = contentPositions[j];

                        if (previewPosition.previewEnd < contentPosition.previewStart) {
                            previewPosition = {
                                highlight: [contentPosition.highlight],
                                previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
                                ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
                            }

                            previewPositions.push(previewPosition);
                        }

                        else {
                            previewPosition.highlight.push(contentPosition.highlight);
                            previewPosition.previewEnd = contentPosition.previewEnd;
                            previewPosition.ellipsesAfter = contentPosition.ellipsesAfter;
                        }
                    }

                    var resultPreviews = document.createElement('div');
                    resultPreviews.classList.add('search-result-previews');
                    resultLink.appendChild(resultPreviews);

                    var content = doc.content;

                    for (var j = 0; j < Math.min(previewPositions.length, 3); j++) {
                        var position = previewPositions[j];

                        var resultPreview = document.createElement('div');
                        resultPreview.classList.add('search-result-preview');
                        resultPreviews.appendChild(resultPreview);

                        if (position.ellipsesBefore) {
                            resultPreview.appendChild(document.createTextNode('... '));
                        }

                        addHighlightedText(resultPreview, content, position.previewStart, position.previewEnd, position.highlight);

                        if (position.ellipsesAfter) {
                            resultPreview.appendChild(document.createTextNode(' ...'));
                        }
                    }
                }

                var resultRelUrl = document.createElement('span');
                resultRelUrl.classList.add('search-result-rel-url');
                resultRelUrl.innerText = doc.relUrl;
                resultTitle.appendChild(resultRelUrl);
            }

            function addHighlightedText(parent, text, start, end, positions) {
                var index = start;

                for (var i in positions) {
                    var position = positions[i];
                    var span = document.createElement('span');
                    span.innerHTML = text.substring(index, position[0]);
                    parent.appendChild(span);
                    index = position[0] + position[1];
                    var highlight = document.createElement('span');
                    highlight.classList.add('search-result-highlight');
                    highlight.innerHTML = text.substring(position[0], index);
                    parent.appendChild(highlight);
                }

                var span = document.createElement('span');
                span.innerHTML = text.substring(index, end);
                parent.appendChild(span);
            }
        }

        jtd.addEvent(searchInput, 'focus', function () {
            setTimeout(update, 0);
        });

        jtd.addEvent(searchInput, 'keyup', function (e) {
            switch (e.keyCode) {
                case 27: // When esc key is pressed, hide the results and clear the field
                    searchInput.value = '';
                    break;
                case 38: // arrow up
                case 40: // arrow down
                case 13: // enter
                    e.preventDefault();
                    return;
            }

            update();
        });

        jtd.addEvent(searchInput, 'keydown', function (e) {
            switch (e.keyCode) {
                case 38: // arrow up
                    e.preventDefault();
                    var active = document.querySelector('.search-result.active');

                    if (active) {
                        active.classList.remove('active');

                        if (active.parentElement.previousSibling) {
                            var previous = active.parentElement.previousSibling.querySelector('.search-result');
                            previous.classList.add('active');
                        }
                    }

                    return;
                case 40: // arrow down
                    e.preventDefault();
                    var active = document.querySelector('.search-result.active');

                    if (active) {
                        if (active.parentElement.nextSibling) {
                            var next = active.parentElement.nextSibling.querySelector('.search-result');
                            active.classList.remove('active');
                            next.classList.add('active');
                        }
                    }

                    else {
                        var next = document.querySelector('.search-result');

                        if (next) {
                            next.classList.add('active');
                        }
                    }

                    return;
                case 13: // enter
                    e.preventDefault();
                    var active = document.querySelector('.search-result.active');

                    if (active) {
                        active.click();
                    }

                    else {
                        var first = document.querySelector('.search-result');

                        if (first) {
                            first.click();
                        }
                    }

                    return;
            }
        });

        jtd.addEvent(document, 'click', function (e) {
            if (e.target != searchInput) {
                hideSearch();
            }
        });
    }

    // Switch theme

    jtd.getTheme = function () {
        var cssFileHref = document.querySelector('[rel="stylesheet"]').getAttribute('href');
        return cssFileHref.substring(cssFileHref.lastIndexOf('-') + 1, cssFileHref.length - 4);
    }

    jtd.setTheme = function (theme) {
        var cssFile = document.querySelector('[rel="stylesheet"]');
        cssFile.setAttribute('href', '/articles/assets/css/just-the-docs-' + theme + '.css');
    }

    // Note: pathname can have a trailing slash on a local jekyll server
    // and not have the slash on GitHub Pages

    function navLink() {
        var pathname = document.location.pathname;

        var navLink = document.getElementById('site-nav').querySelector('a[href="' + pathname + '"]');

        if (navLink) {
            return navLink;
        }

        // The `permalink` setting may produce navigation links whose `href` ends with `/` or `.html`.
        // To find these links when `/` is omitted from or added to pathname, or `.html` is omitted:

        if (pathname.endsWith('/') && pathname != '/') {
            pathname = pathname.slice(0, -1);
        }

        if (pathname != '/') {
            navLink = document.getElementById('site-nav').querySelector('a[href="' + pathname + '"], a[href="' + pathname + '/"], a[href="' + pathname + '.html"]');

            if (navLink) {
                return navLink;
            }
        }

        return null; // avoids `undefined`
    }

    // Scroll site-nav to ensure the link to the current page is visible

    function scrollNav() {
        const targetLink = navLink();

        if (targetLink) {
            targetLink.scrollIntoView({
                block: "center"
            });
            targetLink.removeAttribute('href');
        }
    }

    // Find the nav-list-link that refers to the current page
    // then make it and all enclosing nav-list-item elements active.

    function activateNav() {
        var target = navLink();

        if (target) {
            target.classList.toggle('active', true);
        }

        while (target) {
            while (target && !(target.classList && target.classList.contains('nav-list-item'))) {
                target = target.parentNode;
            }

            if (target) {
                target.classList.toggle('active', true);
                target = target.parentNode;
            }
        }
    }

    // Document ready

    jtd.onReady(function () {
        if (document.getElementById('site-nav')) {
            initNav();
            activateNav();
            scrollNav();
        }

        initSearch();
    });

    // Copy button on code

    jtd.onReady(function () {

        if (!window.isSecureContext) {
            console.log('Window does not have a secure context, therefore code clipboard copy functionality will not be available. For more details see https://web.dev/async-clipboard/#security-and-permissions');
            return;
        }

        var codeBlocks = document.querySelectorAll('div.highlighter-rouge, div.listingblock > div.content, figure.highlight');

        // note: the SVG svg-copied and svg-copy is only loaded as a Jekyll include if site.enable_copy_code_button is true; see _includes/icons/icons.html
        var svgCopied = '<svg viewBox="0 0 24 24" class="copy-icon"><use xlink:href="#svg-copied"></use></svg>';
        var svgCopy = '<svg viewBox="0 0 24 24" class="copy-icon"><use xlink:href="#svg-copy"></use></svg>';

        codeBlocks.forEach(codeBlock => {
            var copyButton = document.createElement('button');
            var timeout = null;
            copyButton.type = 'button';
            copyButton.ariaLabel = 'Copy code to clipboard';
            copyButton.innerHTML = svgCopy;
            codeBlock.append(copyButton);

            copyButton.addEventListener('click', function () {
                if (timeout === null) {
                    var code = (codeBlock.querySelector('pre:not(.lineno, .highlight)') || codeBlock.querySelector('code')).innerText;
                    window.navigator.clipboard.writeText(code);

                    copyButton.innerHTML = svgCopied;

                    var timeoutSetting = 4000;

                    timeout = setTimeout(function () {
                        copyButton.innerHTML = svgCopy;
                        timeout = null;
                    }

                        , timeoutSetting);
                }
            });
        });

    });

})(window.jtd = window.jtd || {});


/**/
























const $ = qs => document.querySelector(qs);
$('#menu').checked = (window.innerWidth < 1280) ? false : true;

const css = async content => {
    const style = document.createElement("style");
    style.textContent = content;
    document.head.appendChild(style);
};

css(`main footer p:hover{cursor:pointer;color:var(--c0)}
     main footer p:hover::before{color: var(--c2)} .dropbtn{cursor:pointer}
     main footer p:hover a{text-decoration-style:solid;text-decoration-color:var(--c3)}    
`); setTimeout(() => css('aside {transition: all 300ms ease-in-out}'), 10);

$('.dropbtn').classList.remove('hidden');

const js = async src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
};

const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

document.querySelectorAll("main footer p").forEach(p => {
    p.addEventListener("click", () => {
        const link = p.querySelector("a");
        if (link) {
            link.click();
        };
    });
});

const translate = () => {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.VERTICAL
    }, 'translate');
    
    
    
    
    
    $('.goog-logo-link')?.setAttribute('rel', 'noopener');
    const googleCombo = $("select.goog-te-combo");
    const langSelect = $('.dropdown-lang');
    const dropdownContainer = $('.dropdown');
    const dropbtn = $('.dropbtn');
    const mobile = window.innerWidth < 1280;
    const menu = $('#menu');
    function restoreLang() {
        const iframe = $('.goog-te-banner-frame');
        if (!iframe) return;
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        const restoreButtons = innerDoc.getElementsByTagName("button");
        Array.from(restoreButtons).forEach(button => {
            if (button.id.includes("restore")) {
                button.click();
                const closeButton = innerDoc.querySelector(".goog-close-link");
                closeButton?.click();
            };
        });
    };
    function triggerHtmlEvent(element, eventName) {
        const event = document.createEvent
            ? new Event(eventName, { bubbles: true, cancelable: true })
            : document.createEventObject();
        document.createEvent
            ? element.dispatchEvent(event)
            : element.fireEvent('on' + event.eventType, event);
    };
    const debouncedChangeLanguage = debounce(function (lang) {
        googleCombo.value = lang;
        triggerHtmlEvent(googleCombo, 'change');
    }, 1500);

    langSelect?.addEventListener('click', function (event) {
        const { target } = event;
        if (!target) return;
        $('.lang-select.aside-selected')?.classList.remove('aside-selected');
        const lang = target.getAttribute('hreflang');
        if (!lang) return;
        target.classList.add('aside-selected');
        langSelect.style.display = 'none';
        dropbtn.disabled = true;
        dropbtn.classList.add('disabled');
        debouncedChangeLanguage(lang);
        setTimeout(() => {
            dropbtn.disabled = false;
            dropbtn.classList.remove('disabled');
            if (mobile) {
                menu.checked = false;
            }
        }, 2000);
        event.preventDefault();
    });
    const checkSelectedLangInterval = setInterval(function () {
        const selectedLang = googleCombo.value;
        if (selectedLang) {
            $('.lang-select.aside-selected')?.classList.remove('aside-selected');
            const initialLang = $(`.lang-select[hreflang="${selectedLang}"]`);
            if (initialLang) {
                $('.lang-select.aside-selected')?.classList.remove('aside-selected');
                initialLang.classList.add('aside-selected');
            };
            clearInterval(checkSelectedLangInterval);
        };
    }, 100);
    setTimeout(function () {
        clearInterval(checkSelectedLangInterval);
    }, 5000);
    dropdownContainer?.addEventListener('mouseover', function () {
        langSelect.style.display = 'block';
    });
    dropdownContainer?.addEventListener('mouseout', function () {
        langSelect.style.display = 'none';
    });
    dropbtn?.addEventListener('click', function (event) {
        if (langSelect.style.display === 'block') {
            langSelect.style.display = 'none';
        } else {
            langSelect.style.display = 'block';
        }
        event.preventDefault();
    });
    _tipon = function () { };
    _tipoff = function () { };
}; window.translate = translate;

const removeFontTags = () => {
    document.querySelectorAll('font').forEach(fontTag => {
        while (fontTag.firstChild) {
            fontTag.parentNode.insertBefore(fontTag.firstChild, fontTag);
        };
        fontTag.remove();
    });
}; removeFontTags();

const observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
        if (mutation.addedNodes.length) {
            removeFontTags();
        };
    });
}); observer.observe(document.body, { childList: true, subtree: true });

js('https://translate.google.com/translate_a/element.js?cb=translate');


const readingTime = () => {
    const readingTime = Math.ceil($('main').innerText.replace(/\s+/g, ' ').trim().split(' ').length / 150);
    const author = $('meta[name="author"]').content;
    const license = $('meta[name="license"]').content;
    $('#reading-time').innerHTML = `<b>${author}</b> ~ <b>${readingTime} minutes</b> - <b>${license}</b>`;
}; readingTime();

const createTOC = () => {
    const chaptersContainer = $('#chapters');
    if (!chaptersContainer) return;
    const headings = document.querySelectorAll('main h2');
    chaptersContainer.innerHTML = '';
    headings.forEach((heading, index) => {
        heading.id = `chapter-${index + 1}`;
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.innerHTML = `<span>${heading.textContent}</span>`;
        chaptersContainer.appendChild(link);
    });
    $('#chapters a')?.addEventListener('click', event => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = $(`#${targetId}`);
        targetElement?.scrollIntoView({ behavior: 'smooth' });
    });
}; createTOC();

const updateTitle = () => {
    const pad = toStr => toStr.toString().padStart(2, '0');
    const now = new Date();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const separator = now.getSeconds() % 2 === 0 ? ':' : '\u200A\u2005';
    document.title = `design﹢code \u203A ${hours}${separator}${minutes}`;
}; setInterval(updateTitle, 1000); updateTitle();


