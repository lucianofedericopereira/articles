export const codeCraft = {
    init: async function (lunrInstance) {
        console.warn  = function(){};
        console.error = function(){};
        this.addStyles();
        this.mermaidModule();
        this.createTOC();
        this.clipboardHandler();
        this.search(lunrInstance);
        this.loadComments();
        this.startObserver(() => this.removeFontTags());
        window.translate = codeCraft.translate;
        codeCraft.js('https://translate.google.com/translate_a/element.js?cb=translate');
        this.clock();
    },
    translate: function () {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false,
            layout: google.translate.TranslateElement.InlineLayout.VERTICAL
        }, 'translate');
        codeCraft.$('.goog-logo-link')?.setAttribute('rel', 'noopener');
        const googleCombo = codeCraft.$("select.goog-te-combo");
        const translateDropdown = codeCraft.$('#translate-dropdown');
        const mobile = window.innerWidth < 1280;
        const menu = codeCraft.$('#menu');
        function triggerHtmlEvent(element, eventName) {
            const event = document.createEvent
                ? new Event(eventName, { bubbles: true, cancelable: true })
                : document.createEventObject();
            document.createEvent
                ? element.dispatchEvent(event)
                : element.fireEvent('on' + event.eventType, event);
        };
        const debouncedChangeLanguage = codeCraft.debounce(function (lang) {
            googleCombo.value = lang;
            triggerHtmlEvent(googleCombo, 'change');
        }, 1500);
        codeCraft.$$(".lang-select").forEach(link => {
            link.addEventListener('click', function (event) {
                const { target } = event;
                if (!target) return;
                const lang = target.getAttribute('hreflang');
                if (!lang) return;
                codeCraft.$('.lang-select.aside-selected')?.classList.remove('aside-selected');
                target.classList.add('aside-selected');
                debouncedChangeLanguage(lang);
                setTimeout(() => {
                    translateDropdown.checked = false;
                    if (mobile) {
                        menu.checked = false;
                    }
                }, 2000);
                event.preventDefault();
            });
        });
        const checkSelectedLangInterval = setInterval(function () {
            const selectedLang = googleCombo.value;
            if (selectedLang) {
                codeCraft.$('.lang-select.aside-selected')?.classList.remove('aside-selected');
                const initialLang = codeCraft.$(`.lang-select[hreflang="${selectedLang}"]`);
                if (initialLang) {
                    codeCraft.$('.lang-select.aside-selected')?.classList.remove('aside-selected');
                    initialLang.classList.add('aside-selected');
                };
                clearInterval(checkSelectedLangInterval);
            };
        }, 100);
        setTimeout(function () {
            clearInterval(checkSelectedLangInterval);
        }, 5000);        
        (function waitForFunctions(retries = 20, interval = 150) {
            let attempts = 0;
            const checkAndOverride = () => {
                if (typeof _tipoff === 'function' && typeof _tipon === 'function') {
                    _tipoff = function () { };
                    _tipon = function () { };
                    clearInterval(timer);
                } else if (++attempts >= retries) {
                    clearInterval(timer);
                }
            };
            let timer = setInterval(checkAndOverride, interval);
        })();
    },
    search: async function (lunrInstance) {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const metaTag = document.querySelector('meta[name="search"]');
        const menu = document.getElementById('menu');
        if (!searchInput || !searchResults || !metaTag?.content) return;
        let currentInput = '';
        let currentSearchIndex = 0;
        try {
            const response = await fetch(metaTag.content);
            if (!response.ok) throw new Error(`Failed to load search data: ${response.status}`);
            const docs = await response.json();
            lunrInstance.tokenizer.separator = /[\s/]+/;
            const index = lunrInstance(function () {
                this.ref('id');
                this.field('title', { boost: 200 });
                this.field('content', { boost: 2 });
                this.metadataWhitelist = ['position'];
                Object.keys(docs).forEach((key) => {
                    this.add({
                        id: key,
                        title: docs[key].title,
                        content: docs[key].content,
                    });
                });
            });
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    menu.checked = true;
                    searchInput.focus();
                }
            });
            const showSearch = () => document.documentElement.classList.add('search-active');
            const hideSearch = () => {
                document.documentElement.classList.remove('search-active');
                searchInput.value = '';
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
            };
            searchInput.addEventListener('input', () => {
                const input = searchInput.value.trim();
                if (input.length === 0) {
                    hideSearch();
                    return;
                }
                if (input.length < 2) {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                    return;
                }
                if (input === currentInput) return;
                currentInput = input;
                currentSearchIndex++;
                searchResults.innerHTML = '';
                searchResults.style.display = 'block';
                showSearch();
                let results = index.query((query) => {
                    const tokens = lunrInstance.tokenizer(input);
                    query.term(tokens, { boost: 10 });
                    query.term(tokens, { wildcard: lunrInstance.Query.wildcard.TRAILING });
                });
                if (!results.length && input.length > 2) {
                    const tokens = lunrInstance.tokenizer(input).filter((token) => token.str.length < 20);
                    if (tokens.length) {
                        results.push(...index.query((query) => {
                            query.term(tokens, { editDistance: Math.round(Math.sqrt(input.length / 2 - 1)) });
                        }));
                    }
                }
                if (results.length === 0) {
                    searchResults.innerHTML = `<div class="search-no-result">No results found</div>`;
                } else {
                    const resultsList = document.createElement('ul');
                    resultsList.classList.add('search-results-list');
                    searchResults.appendChild(resultsList);
                    addResults(resultsList, results, 0, 10, 100, currentSearchIndex, docs);
                }
            });
            searchInput.addEventListener('blur', (event) => {
                if (!searchResults.contains(event.relatedTarget)) {
                    hideSearch();
                }
            });
            const observer = new MutationObserver(() => {
                if (window.getComputedStyle(searchInput).display === 'none') {
                    hideSearch();
                }
            });
            observer.observe(searchInput, { attributes: true, attributeFilter: ['style'] });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    hideSearch();
                    searchInput.blur();
                    menu.checked = false;
                }
            });
            const addResults = (resultsList, results, start, batchSize, batchMillis, searchIndex, docs) => {
                if (searchIndex !== currentSearchIndex) return;
                for (let i = start; i < Math.min(start + batchSize, results.length); i++) {
                    addResult(resultsList, results[i], docs);
                }
                if (start + batchSize < results.length) {
                    setTimeout(() => addResults(resultsList, results, start + batchSize, batchSize, batchMillis, searchIndex, docs), batchMillis);
                }
            };
            const addResult = (resultsList, result, docs) => {
                const doc = docs[result.ref];
                const resultsListItem = document.createElement('li');
                resultsListItem.classList.add('search-results-list-item');
                resultsList.appendChild(resultsListItem);
                const resultLink = document.createElement('a');
                resultLink.classList.add('search-result');
                resultLink.href = doc.url;
                resultLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    searchInput.value = '';
                    searchResults.remove();
                    setTimeout(() => {
                        window.location.href = resultLink.href;
                    }, 10);
                });
                resultsListItem.appendChild(resultLink);
                const resultTitle = document.createElement('div');
                resultTitle.classList.add('search-result-title');
                resultTitle.textContent = doc.title;
                resultLink.appendChild(resultTitle);
                if (doc.content) {
                    const resultPreviews = document.createElement('div');
                    resultPreviews.classList.add('search-result-previews');
                    resultLink.appendChild(resultPreviews);
                    const previewText = doc.content.slice(0, 100);
                    const resultPreview = document.createElement('div');
                    resultPreview.classList.add('search-result-preview');
                    resultPreview.textContent = `${previewText}…`;
                    resultPreviews.appendChild(resultPreview);
                }
            };
        } catch (error) {
            console.error('Error loading search data:', error);
        }        
    },
    clock: function () {
        const now = new Date();
        const hours = this.pad(now.getHours());
        const minutes = this.pad(now.getMinutes());
        const separator = now.getSeconds() & 1 ? '\u200A\u2005' : ':';
        document.title = `design﹢code \u203A ${hours}${separator}${minutes}`;
    },
    mermaidModule: function () {
        const config = this.parseMetaConfig("mermaid");
        if (!config?.version) return;
        const script = document.createElement("script");
        script.type = "module";
        script.defer = true;
        script.innerHTML = `import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@${config.version}/+esm';
        mermaid.initialize({startOnLoad: true,theme: 'forest'});
        mermaid.run({ querySelector: '.language-mermaid'}).then(() => {
            document.querySelectorAll('.language-mermaid').forEach(el => {
                el.classList.add('mermaid-loaded');
            });
        });`; document.body.appendChild(script);
    },
    createTOC: function () {
        const metaTag = codeCraft.$('meta[name="toc"]');
        if (!metaTag || metaTag.content !== "enabled") {
            return;
        }
        this.readingTime();
        const chaptersContainer = codeCraft.$('#chapters');
        if (!chaptersContainer) return;
        const headings = codeCraft.$$('main h2');
        if (headings.length > 0) {
            let tocHeading = chaptersContainer.previousElementSibling;
            if (!tocHeading || tocHeading.tagName !== 'H3') {
                tocHeading = document.createElement('h3');
                tocHeading.textContent = 'Table of Contents';
                chaptersContainer.insertAdjacentElement('beforebegin', tocHeading);
            }
            let tocSeparator = chaptersContainer.nextElementSibling;
            if (!tocSeparator || tocSeparator.tagName !== 'HR') {
                tocSeparator = document.createElement('hr');
                chaptersContainer.insertAdjacentElement('afterend', tocSeparator);
            };
            chaptersContainer.innerHTML = '';
            headings.forEach((heading, index) => {
                heading.id = `chapter-${index + 1}`;
                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.innerHTML = `<span>${heading.textContent}</span>`;
                chaptersContainer.appendChild(link);
            });
            chaptersContainer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = codeCraft.$(`#${targetId}`);
                    targetElement?.scrollIntoView({ behavior: 'smooth' });
                });
            });
        } else {
            chaptersContainer.previousElementSibling?.tagName === 'H3' && chaptersContainer.previousElementSibling.remove();
            chaptersContainer.nextElementSibling?.tagName === 'HR' && chaptersContainer.nextElementSibling.remove();
            chaptersContainer.innerHTML = '';
        };
    },
    readingTime: function () {
        const readingTime = Math.ceil(codeCraft.$('main').innerText.replace(/\s+/g, ' ').trim().split(' ').length / 150);
        const author = codeCraft.$('meta[name="author"]').content;
        const license = codeCraft.$('meta[name="license"]').content;
        const date = codeCraft.$('meta[name="date"]').content;
        codeCraft.$('#reading-time').innerHTML = `<b>${author}</b> | ${date} | ~<b>${readingTime}</b> min read | ${license}`;
    },
    loadComments: function () {
        const commentsConfig = this.parseMetaConfig("comments-config");
        if (!commentsConfig) {
            return;
        };
        const { theme = "github-light", issue = "title", repo, src } = commentsConfig;
        const commentsDiv = codeCraft.$("#comments-utteranc");
        if (!commentsDiv) return;
        if (!repo || !src) {
            return;
        };
        const script = Object.assign(document.createElement("script"), {
            src,
            async: true,
            crossorigin: "anonymous"
        });
        script.setAttribute("theme", theme);
        script.setAttribute("issue-term", issue);
        script.setAttribute("repo", repo);
        commentsDiv.appendChild(script);
    },
    clipboardHandler: function () {
        if (!navigator.clipboard) {
            console.warn("Clipboard API is not supported or unavailable in this context.");
            return;
        }
        const icons = {
            copy: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>`,
            copied: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z"/>
            </svg>`
        };
        codeCraft.$$("div.highlighter-rouge, div.listingblock > div.content, figure.highlight").forEach(codeBlock => {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("aria-label", "Copy code to clipboard");
            button.innerHTML = icons.copy;
            codeBlock.appendChild(button);
            button.addEventListener("click", () => {
                const codeElement = codeBlock.querySelector("pre:not(.lineno, .highlight)") || codeBlock.querySelector("code");
                const codeText = codeElement?.innerText;
                if (!codeText) {
                    console.warn("No code content found in this block.");
                    return;
                }
                navigator.clipboard.writeText(codeText)
                    .then(() => {
                        button.innerHTML = icons.copied;
                        setTimeout(() => (button.innerHTML = icons.copy), 4000);
                    })
                    .catch((err) => console.error("Failed to copy text:", err));
            });
        });
    },
    addStyles: function () {
        codeCraft.$('#menu').checked = (window.innerWidth < 1280) ? false : true;
        codeCraft.$$("main footer p").forEach(p => {
            p.addEventListener("click", () => {
                const link = p.querySelector("a");
                if (link) {
                    link.click();
                };
            });
        });
        const styles = `
        main footer p:hover {
            cursor: pointer;
            color: var(--c0);
        }
        main footer p:hover::before {
            color: var(--c2);
        }
        .dropbtn {
            cursor: pointer;
        }
        main footer p:hover a {
            text-decoration-style: solid;
            text-decoration-color: var(--c3);
        }
        .entry:hover {
            border-color: var(--c3);
            background-color: var(--c5);
        }
        .entry:hover .title a b {
            color: var(--r0);
        }
        .entry:hover p .collection-tag {
            background-color: var(--r0);
            color: var(--c7);
        }
        .entry:hover .date-tag {
            color: var(--c1);
        }
        `;
        this.css(styles);
        setTimeout(() => {
            this.css(`
            aside {
                transition: all 300ms ease-in-out;
            }
        `);
        }, 10);
    },
    removeFontTags: function () {
        codeCraft.$$('font').forEach(fontTag => {
            while (fontTag.firstChild) {
                fontTag.parentNode.insertBefore(fontTag.firstChild, fontTag);
            }
            fontTag.remove();
        });
    },
    $: function (qs) { return document.querySelector(qs); },
    $$: function (qs) { return document.querySelectorAll(qs); },
    debounce: function (func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    startObserver: function (task) {
        const observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    task();
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        task();
    },
    parseMetaConfig: function (name, delimiter = "|", pairDelimiter = "=") {
        const metaTag = codeCraft.$(`meta[name="${name}"]`);
        if (!metaTag) {
            return null;
        }
        return Object.fromEntries(
            metaTag.content.split(delimiter).map(pair => pair.split(pairDelimiter))
        );
    },
    pad: function (num) {
        return num.toString().padStart(2, '0');
    },
    css: function (content) {
        if (!content) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(content));
        document.head.appendChild(style);
    },
    js: async function (src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    },
};