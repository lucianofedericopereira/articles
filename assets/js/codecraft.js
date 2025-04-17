const codeCraft = {
    init: function () {
          setInterval(() => this.clock(), 1000);
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
};  document.addEventListener('DOMContentLoaded', () => codeCraft.init());
