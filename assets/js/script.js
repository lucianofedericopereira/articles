function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const $ = qs => document.querySelector(qs);

function translate() {
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
            }
        });
    }

    function triggerHtmlEvent(element, eventName) {
        const event = document.createEvent
            ? new Event(eventName, { bubbles: true, cancelable: true })
            : document.createEventObject();
        document.createEvent
            ? element.dispatchEvent(event)
            : element.fireEvent('on' + event.eventType, event);
    }

    const debouncedChangeLanguage = debounce(function (lang) {
        googleCombo.value = lang;
        triggerHtmlEvent(googleCombo, 'change');
    }, 1500);

    langSelect?.addEventListener('click', function (event) {
        const { target } = event;
        if (!target) return;
        $('.lang-select.selected')?.classList.remove('selected');
        const lang = target.getAttribute('data-lang');
        if (!lang) return;
        target.classList.add('selected');
        langSelect.style.display = 'none';
        dropbtn.disabled = true;
        dropbtn.classList.add('disabled'); // Add disabled class
        debouncedChangeLanguage(lang);
        setTimeout(() => {
            dropbtn.disabled = false;
            dropbtn.classList.remove('disabled'); // Remove disabled class
        }, 2000); // 1500ms (debounce time) + 500ms
        event.preventDefault();
    });

    const checkSelectedLangInterval = setInterval(function () {
        const selectedLang = googleCombo.value;
        if (selectedLang) {
            $('.lang-select.selected')?.classList.remove('selected');
            const initialLang = $(`.lang-select[data-lang="${selectedLang}"]`);
            if (initialLang) {
                $('.lang-select.selected')?.classList.remove('selected');
                initialLang.classList.add('selected');
            }
            clearInterval(checkSelectedLangInterval);
        }
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

}

window.translate = translate;

document.addEventListener('DOMContentLoaded', () => {
    const wrapElement = (element) => {
        const containerDiv = document.createElement('div');
        containerDiv.className = 'overlay-container';
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'overlay';
        element?.parentNode?.insertBefore(containerDiv, element);
        containerDiv.appendChild(element);
        containerDiv.appendChild(overlayDiv);
    };
    $('main')?.querySelectorAll('p, h1, h2, h3, h4, h5, h6')?.forEach(wrapElement);
    
});