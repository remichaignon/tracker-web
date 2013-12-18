import Index from "appkit/controllers/index";

var controller;
module("Unit - IndexController", {
    setup: function () {
        var container = isolatedContainer([
            "controller:index"
        ]);

        controller = container.lookup("controller:index");
    }
});

test("it exists", function () {
    ok(controller);
    ok(controller instanceof Index);
});
