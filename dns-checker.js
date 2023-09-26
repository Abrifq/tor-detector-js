//implementing behaviour from
//https://lists.torproject.org/pipermail/tor-project/2020-March/002759.html#DNS-Exit-List

const { resolve4 } = require("node:dns/promises");
const { isIPv4 } = require("node:net");
const constants = require("./constants.js");

//This functions will always throw an error when on NXDOMAIN, always resolve to a value on answer.
const asyncResolve = hostname => resolve4(hostname).then(() => true).catch(() => false);

/** @param {string} ip */
const reverseIP = ip => ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$4.$3.$2.$1");

/**@type {(ip:string)=>string} */
const defaultDNSQueryGenerator = (ip) => reverseIP(ip) + constants.DNS_LOOKUP_SUFFIX

class DNSBasedChecker {
    /**@type {(ip:string)=>string} */
    #dnsQueryGenerator;
    constructor(customQueryGenerator = defaultDNSQueryGenerator) {
        this.#dnsQueryGenerator = customQueryGenerator
    }
    /**
     * @param {string} ip IPv4 address to check
     * @returns {Promise<boolean>} - True if the ip belonged to a TOR exit node.
     */
    async check(ip) {
        if (!isIPv4(ip)) throw new TypeError("Given IP was a not valid IPv4 address");
        const hostname = this.#dnsQueryGenerator(ip);
        return asyncResolve(hostname);
    }
}

exports.DNSBasedChecker = DNSBasedChecker;
exports.reverseIP = reverseIP;