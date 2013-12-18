import Model from "appkit/models/model";

var model;
module("Unit - ModelModel", {
    setup: function () {
        var container = isolatedContainer([
            "model:model"
        ]);

        model = container.lookup("model:model");
    }
});

test("it exists", function () {
    ok(model);
    ok(model instanceof Model);
});
