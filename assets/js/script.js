/**/

// Function to handle link click
function handleSearchResultClick(event) {
    event.preventDefault(); // Step 1: Prevent default link behavior

    const hrefTarget = event.target.href; // Step 2: Save href in a constant

    // Step 3: Clear the input field
    document.getElementById("search-input").value = "";

    // Step 4: Uncheck the checkbox with id="menu"
    const menuCheckbox = document.getElementById("menu");
    if (menuCheckbox && menuCheckbox.type === "checkbox") {
        menuCheckbox.checked = false;
    }

    // Step 5: Navigate to the saved link
    window.location.href = hrefTarget;
}

// MutationObserver to watch for added nodes
const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            // Check if the added node is an element with class "search-result"
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("search-result")) {
                node.addEventListener("click", handleSearchResultClick);
            }
        });
    });
});

// Start observing the document body for changes
observer.observe(document.body, {
    childList: true, // Watch for added/removed child nodes
    subtree: true    // Watch the entire subtree
});



/**/

document.getElementById('menu').addEventListener('change', function () {
    if (!this.checked) {
        const search = document.getElementById('search-input'); 
        search.value = '';
        search.focus();
        search.blur();
    }
});



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
    const date = $('meta[name="date"]').content;

    $('#reading-time').innerHTML = `<b>${author}</b> | ${date} | ~<b>${readingTime}</b> min read | ${license}`;
    
//    $('#reading-time').innerHTML = `<b>${author}</b> ~<b>${readingTime} minutes</b> - <b>${license}</b>`;
}; readingTime();

/*
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
*/

/*
const createTOC = () => {
    const chaptersContainer = document.querySelector('#chapters');
    if (!chaptersContainer) return;

    const headings = document.querySelectorAll('main h2');

    if (headings.length > 0) {
        // Create <h3> for "Table of Contents" if not already present
        let tocHeading = chaptersContainer.previousElementSibling;
        if (!tocHeading || tocHeading.tagName !== 'H3') {
            tocHeading = document.createElement('h3');
            tocHeading.textContent = 'Table of Contents';
            chaptersContainer.insertAdjacentElement('beforebegin', tocHeading);
        }

        // Create <hr> if not already present
        let tocSeparator = chaptersContainer.nextElementSibling;
        if (!tocSeparator || tocSeparator.tagName !== 'HR') {
            tocSeparator = document.createElement('hr');
            chaptersContainer.insertAdjacentElement('afterend', tocSeparator);
        }

        // Populate the table of contents
        chaptersContainer.innerHTML = '';
        headings.forEach((heading, index) => {
            heading.id = `chapter-${index + 1}`;
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            chaptersContainer.appendChild(link);
        });

        // Smooth scroll for links
        chaptersContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetElement = document.querySelector(link.getAttribute('href'));
                targetElement?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    } else {
        // Remove <h3> and <hr> if no headings
        chaptersContainer.previousElementSibling?.tagName === 'H3' && chaptersContainer.previousElementSibling.remove();
        chaptersContainer.nextElementSibling?.tagName === 'HR' && chaptersContainer.nextElementSibling.remove();
        chaptersContainer.innerHTML = '';
    }
};
createTOC();
*/

const createTOC = () => {
    const chaptersContainer = document.querySelector('#chapters');
    if (!chaptersContainer) return;

    const headings = document.querySelectorAll('main h2');

    if (headings.length > 0) {
        // Ensure <h3> for Table of Contents exists
        let tocHeading = chaptersContainer.previousElementSibling;
        if (!tocHeading || tocHeading.tagName !== 'H3') {
            tocHeading = document.createElement('h3');
            tocHeading.textContent = 'Table of Contents';
            chaptersContainer.insertAdjacentElement('beforebegin', tocHeading);
        }

        // Ensure <hr> exists
        let tocSeparator = chaptersContainer.nextElementSibling;
        if (!tocSeparator || tocSeparator.tagName !== 'HR') {
            tocSeparator = document.createElement('hr');
            chaptersContainer.insertAdjacentElement('afterend', tocSeparator);
        }

        // Populate the TOC
        chaptersContainer.innerHTML = '';
        headings.forEach((heading, index) => {
            heading.id = `chapter-${index + 1}`;
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.innerHTML = `<span>${heading.textContent}</span>`; // Maintain <span>
            chaptersContainer.appendChild(link);
        });

        // Smooth scroll functionality
        chaptersContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.querySelector(`#${targetId}`);
                targetElement?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    } else {
        // Remove <h3> and <hr> if no headings exist
        chaptersContainer.previousElementSibling?.tagName === 'H3' && chaptersContainer.previousElementSibling.remove();
        chaptersContainer.nextElementSibling?.tagName === 'HR' && chaptersContainer.nextElementSibling.remove();
        chaptersContainer.innerHTML = '';
    }
};
createTOC();





const updateTitle = () => {
    const pad = toStr => toStr.toString().padStart(2, '0');
    const now = new Date();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const separator = now.getSeconds() % 2 === 0 ? ':' : '\u200A\u2005';
    document.title = `design﹢code \u203A ${hours}${separator}${minutes}`;
}; setInterval(updateTitle, 1000); updateTitle();


