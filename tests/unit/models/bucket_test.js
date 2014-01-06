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

test("priority", function () {
    model.set("name", "");
    strictEqual(typeof model.get("priority"), "number");
    strictEqual(model.get("priority"), 0);
    model.set("name", "bucket");
    strictEqual(typeof model.get("priority"), "number");
    strictEqual(model.get("priority"), 0);
    model.set("name", "bucket.key");
    strictEqual(typeof model.get("priority"), "number");
    equal(model.get("priority"), 0);
    model.set("name", "bucket.123.key");
    strictEqual(typeof model.get("priority"), "number");
    strictEqual(model.get("priority"), 123);
    model.set("name", "backlog.2.bk");
    strictEqual(typeof model.get("priority"), "number");
    strictEqual(model.get("priority"), 2);
});