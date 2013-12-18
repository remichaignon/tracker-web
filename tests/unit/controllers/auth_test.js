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
