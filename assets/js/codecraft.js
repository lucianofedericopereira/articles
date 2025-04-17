const $ = qs => document.querySelector(qs);

const codeCraft = {
    init: async function () {
        this.setupEventListeners();
        this.addStyles();
        setInterval(() => this.clock(), 1000);
    },    
    dom: async function (){
        this.prepareMenu();
        this.createTOC();
        this.readingTime();
    },
    setupEventListeners: function () {
        document.addEventListener('DOMContentLoaded', async () => {
            await this.dom();
        });
    },
    prepareMenu: function(){
        $('#menu').checked = (window.innerWidth < 1280) ? false : true;
        $('.dropbtn').classList.remove('hidden');
    },
    addStyles: function () {
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
        const readingTime = Math.ceil(document.querySelector('main').innerText.replace(/\s+/g, ' ').trim().split(' ').length / 150);
        const author = document.querySelector('meta[name="author"]').content;
        const license = document.querySelector('meta[name="license"]').content;
        const date = document.querySelector('meta[name="date"]').content;
        document.querySelector('#reading-time').innerHTML = `<b>${author}</b> | ${date} | ~<b>${readingTime}</b> min read | ${license}`;
    },    
    createTOC: function () {
        const chaptersContainer = document.querySelector('#chapters');
        if (!chaptersContainer) return;
        const headings = document.querySelectorAll('main h2');
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
                    const targetElement = document.querySelector(`#${targetId}`);
                    targetElement?.scrollIntoView({ behavior: 'smooth' });
                });
            });
        } else {
            chaptersContainer.previousElementSibling?.tagName === 'H3' && chaptersContainer.previousElementSibling.remove();
            chaptersContainer.nextElementSibling?.tagName === 'HR' && chaptersContainer.nextElementSibling.remove();
            chaptersContainer.innerHTML = '';
        };
    },
    
}; codeCraft.init();

