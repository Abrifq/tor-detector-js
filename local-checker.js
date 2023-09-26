const { isIPv4 } = require("node:net");
const { DEFAULT_IP_LIST_RECHECK_DELAY_IN_MS, EXIT_NODE_IP_LIST_URL } = require("./constants.js");

class IPListCache {
    #list = new Set();
    #LIST_URL
    #lastFetchTimestamp = 0;
    #cacheTTL;
    constructor(ipListURL = EXIT_NODE_IP_LIST_URL, ttlInMilliseconds = DEFAULT_IP_LIST_RECHECK_DELAY_IN_MS) {
        this.#LIST_URL = ipListURL;
        this.#cacheTTL = ttlInMilliseconds;
    }
    async renew() {
        this.#lastFetchTimestamp = Date.now();
        const blob = await fetch(this.#LIST_URL).then(response => response.text());
        this.#list = new Set(blob.split("\n"));
    }
    shouldRenew() {
        return this.#lastFetchTimestamp + this.#cacheTTL <= Date.now()
    }

    async checkFor(ip) {
        if (this.shouldRenew()) await this.renew();
        return this.#list.has(ip)
    }
}


class FileBasedChecker {
    #cache;
    constructor(customIPListURL = EXIT_NODE_IP_LIST_URL, cacheValidityInMilliseconds = DEFAULT_IP_LIST_RECHECK_DELAY_IN_MS) {
        this.#cache = new IPListCache(customIPListURL, cacheValidityInMilliseconds);
    }

    /**
     * @param {string} ip IPv4 address to check
     * @returns {Promise<boolean>} - True if the ip belonged to a TOR exit node.
     */
    async check(ip) {
        if (!isIPv4(ip)) throw new TypeError("Given IP was a not valid IPv4 address");
        return this.#cache.checkFor(ip);
    }
}

exports.IPListCache = IPListCache;
exports.FileBasedChecker = FileBasedChecker;