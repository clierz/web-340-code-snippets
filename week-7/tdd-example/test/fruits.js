var assert = require("assert");

describe("String#split", function() {
    it("should return an array of fruits", function() {
        assert(Array.isArray('Apple,Orange,Mango'.split(',')));
    });
});