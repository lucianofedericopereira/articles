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
$('#menu').checked = (window.innerWidth < 1280) ? false : true;
*/
/*
const css = async content => {
    const style = document.createElement("style");
    style.textContent = content;
    document.head.appendChild(style);
};
css(`main footer p:hover{cursor:pointer;color:var(--c0)}
     main footer p:hover::before{color: var(--c2)} .dropbtn{cursor:pointer}
     main footer p:hover a{text-decoration-style:solid;text-decoration-color:var(--c3)}    
`);
setTimeout(() => css('aside {transition: all 300ms ease-in-out}'), 10);
*/


//$('.dropbtn').classList.remove('hidden');






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


