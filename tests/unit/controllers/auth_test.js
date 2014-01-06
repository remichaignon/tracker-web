import Auth from "appkit/controllers/auth";

var controller;
module("Unit - AuthController", {
    setup: function () {
        var container = isolatedContainer([
            "controller:auth"
        ]);

        controller = container.lookup("controller:auth");
    }
});

test("it exists", function () {
    ok(controller);
    ok(controller instanceof Auth);
});

test("token exists", function () {
    ok(controller.get("token"));
    strictEqual(typeof controller.get("token"), "string");
});

test("request exists", function () {
    ok(controller.request);
    strictEqual(typeof controller.request, "function");
});

test("request returns a promise", function () {
    ok(controller.request() instanceof Ember.RSVP.Promise);
});
