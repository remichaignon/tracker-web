import Size from "appkit/models/size";

var model;
module("Unit - SizeModel", {
    setup: function () {
        var container = isolatedContainer([
            "model:size"
        ]);

        model = container.lookup("model:size");
    }
});

test("it exists", function () {
    ok(model);
    ok(model instanceof Size);
});
