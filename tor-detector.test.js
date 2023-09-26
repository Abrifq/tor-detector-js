const { describe, it } = require("node:test");
const { strictEqual, rejects } = require("node:assert");
const { EXIT_NODE_IP_LIST_URL } = require("./constants.js");
const { FileBasedChecker } = require("./local-checker.js");
const { DNSBasedChecker } = require("./dns-checker.js");

describe("All Tests", { concurrency: true }, () => {

    describe("File based testing", async () => {
        const fileBasedChecker = new FileBasedChecker();
        const validNode = (await fetch(EXIT_NODE_IP_LIST_URL).then(response => response.text())).split("\n")[0];

        await it("Should pass: valid node address",
            async () => {
                strictEqual(await fileBasedChecker.check(validNode), true, validNode + " somehow wasn't in IP list?? HOW?");
            })
        await it("Should fail: invalid node address",
            async () => {
                strictEqual(await fileBasedChecker.check("127.0.0.1"), false, validNode + " somehow wasn't in IP list?? HOW?");
            })
        await it("Should throw: invalid ipv4 address",
            async () => {
                await rejects(fileBasedChecker.check(validNode.replace(/\d+/, "256")), TypeError, validNode + " somehow wasn't in IP list?? HOW?");
            })
        await it("Should throw: valid ipv6 address",
            async () => {
                await rejects(fileBasedChecker.check("::1"), TypeError, validNode + " somehow wasn't in IP list?? HOW?");
            })
    });

    describe("DNS based testing", async () => {
        const dnsBasedChecker = new DNSBasedChecker();
        const validNode = (await fetch(EXIT_NODE_IP_LIST_URL).then(response => response.text())).split("\n")[0];

        await it("Should pass: valid node address",
            async () => {
                strictEqual(await dnsBasedChecker.check(validNode), true, validNode + " somehow wasn't in IP list?? HOW?");
            })
        await it("Should fail: invalid node address",
            async () => {
                strictEqual(await dnsBasedChecker.check("127.0.0.1"), false, validNode + " somehow wasn't in IP list?? HOW?");
            })
        await it("Should throw: invalid ipv4 address",
            async () => {
                await rejects(dnsBasedChecker.check(validNode.replace(/\d+/, "256")), TypeError, validNode + " somehow wasn't in IP list?? HOW?");
            })
        await it("Should throw: valid ipv6 address",
            async () => {
                await rejects(dnsBasedChecker.check("::1"), TypeError, validNode + " somehow wasn't in IP list?? HOW?");
            })
    });
});