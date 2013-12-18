import Team from "appkit/models/team";

var model;
module("Unit - TeamModel", {
    setup: function () {
        var container = isolatedContainer([
            "model:team"
        ]);

        model = container.lookup("model:team");
    }
});

test("it exists", function () {
    ok(model);
    ok(model instanceof Team);
});
