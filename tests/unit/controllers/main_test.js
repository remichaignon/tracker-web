import Main from "appkit/controllers/main";

var controller;
module("Unit - MainController", {
    setup: function () {
        var container = isolatedContainer([
            "controller:main"
        ]);

        controller = container.lookup("controller:main");
    }
});

test("it exists", function () {
    ok(controller);
    ok(controller instanceof Main);
});
