
class Blabber {
    constructor () {
        this.id = null;
        this.username = null;
        this.realName = null;
        this.BlabName = null;
        this.createdDate = null;
        this.numberListeners = null;
        this.numberListenings = null;

        this.date_format = "%b %d %Y";
    }

    async getId() {
        return this.id;
    }
    async setID(newID) {
        this.id = newID;
    }
    async getUsername() {
        return this.username;
    }
    async setUsername(newUsername) {
        this.username = newUsername;
    }
    async getRealName() {
        return this.realName;
    }
    async setRealName(newRealName) {
        this.realName = newRealName;
    }
    async getBlabName() {
        return this.BlabName;
    }
    async setBlabName(newBlabName) {
        this.BlabName = newBlabName;
    }
    async getCreatedDate() {
        return this.createdDate;
    }
    async setCreatedDate(newCreatedDate) {
        this.createdDate = newCreatedDate;
    }
    async getNumberListeners() {
        return this.numberListeners;
    }
    async setNumberListeners(newNumberListeners) {
        this.numberListeners = newNumberListeners;
    }
    async getNumberListenings() {
        return this.numberListenings;
    }
    async setNumberListenings(newNumberListenings) {
        this.numberListenings = newNumberListenings;
    }
}

module.exports = Blabber;