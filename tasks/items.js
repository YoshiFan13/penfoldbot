const { Task } = require('klasa');
const fetch = require('node-fetch');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, { name: 'items', enabled: true });
    }

    async run() {
        let res = await fetch('https://fortnite-public-api.theapinetwork.com/prod09/store/get');
        res = await res.json();
        if (this.client.settings.fortniteitems === res.date) return;
        await this.client.settings.update('fortniteitems', res.date);
        this.client.users.forEach(async (u) => {
            if (u.bot) return;
            const settings = await u.settings.get('fortniteitems');
            if (!settings.length) return;
            const items = res.items.map(i => i.name);
            const common = items.filter(i => settings.includes(i.toLowerCase()));
            if (common.length) u.send(`Chief! These items are now available in the item shop. Remember - spend your V-Bucks wisely!\n\`${common.join(', ')}\``);
        });
    }

    async init() {

    }

};