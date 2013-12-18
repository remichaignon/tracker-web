import Label from "appkit/models/label";

var model;
module("Unit - LabelModel", {
    setup: function () {
        var container = isolatedContainer([
            "model:label"
        ]);

        model = container.lookup("model:label");
    }
});

test("it exists", function () {
    ok(model);
    ok(model instanceof Label);
});
