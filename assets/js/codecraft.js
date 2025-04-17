const $  = qs => document.querySelector(qs);
const $$ = qs => document.querySelectorAll(qs);

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

const codeCraft = {
    init: async function () {
        setInterval(() => this.clock(), 1000);
        this.setupEventListeners();
        this.startObserver(() => this.removeFontTags());
    },    
    dom: async function (){
        this.addStyles();
        this.createTOC();
        this.readingTime();
        
        window.translate = this.translate;
        js('https://translate.google.com/translate_a/element.js?cb=translate');

        
    },
    setupEventListeners: function () {
        document.addEventListener('DOMContentLoaded', async () => {
            await this.dom();
        });
    },
    addStyles: function () {
        $('#menu').checked = (window.innerWidth < 1280) ? false : true;
        $('.dropbtn').classList.remove('hidden');
        $$("main footer p").forEach(p => {
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
    clock: function () {
        const now = new Date();
        const hours = this.pad(now.getHours());
        const minutes = this.pad(now.getMinutes());
        const separator = now.getSeconds() & 1 ? '\u200A\u2005' : ':';
        document.title = `design﹢code \u203A ${hours}${separator}${minutes}`;
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
    readingTime: function () {
        const readingTime = Math.ceil($('main').innerText.replace(/\s+/g, ' ').trim().split(' ').length / 150);
        const author = $('meta[name="author"]').content;
        const license = $('meta[name="license"]').content;
        const date = $('meta[name="date"]').content;
        $('#reading-time').innerHTML = `<b>${author}</b> | ${date} | ~<b>${readingTime}</b> min read | ${license}`;
    },    
    createTOC: function () {
        const chaptersContainer = $('#chapters');
        if (!chaptersContainer) return;
        const headings = $$('main h2');
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
                    const targetElement = $(`#${targetId}`);
                    targetElement?.scrollIntoView({ behavior: 'smooth' });
                });
            });
        } else {
            chaptersContainer.previousElementSibling?.tagName === 'H3' && chaptersContainer.previousElementSibling.remove();
            chaptersContainer.nextElementSibling?.tagName === 'HR' && chaptersContainer.nextElementSibling.remove();
            chaptersContainer.innerHTML = '';
        };
    },

    removeFontTags: function () {
        $$('font').forEach(fontTag => {
            while (fontTag.firstChild) {
                fontTag.parentNode.insertBefore(fontTag.firstChild, fontTag);
            }
            fontTag.remove();
        });
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
    translate: function () {
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
    },


    
}; codeCraft.init();




window.onpageshow = event => {
    if (event.persisted) {
        event.preventDefault();
        const menuLabel = document.getElementById('menu-label');
        menuLabel.click();
        const input = document.getElementById('search-input');
        const checkbox = document.getElementById('menu');
        const screenWidth = window.innerWidth;
        if (screenWidth < 1024 && checkbox.checked) {
            setTimeout(() => {
                checkbox.checked = false;
            }, 50);
        }
        if (input) {
            input.value = '';
            input.focus();
            input.blur();
        }
    }
};

document.getElementById('menu').addEventListener('change', function () {
    if (!this.checked) {
        const search = document.getElementById('search-input');
        search.value = '';
        search.focus();
        search.blur();
    }
});


/*
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
};

window.translate = translate;
*/



