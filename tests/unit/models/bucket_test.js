import Bucket from "appkit/models/bucket";

var model;
module("Unit - BucketModel", {
    setup: function () {
        var container = isolatedContainer([
            "model:bucket"
        ]);

        model = container.lookup("model:bucket");
    }
});

test("it exists", function () {
    ok(model);
    ok(model instanceof Bucket);
});
