import Label from "appkit/models/label";

var model,
    defaultLabel = {
        url: "url",
        name: "a label",
        color: "abcdef"
    };
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

test("has parameters", function () {
    var label = Label.create(defaultLabel);
    strictEqual(label.get("url"), defaultLabel.url);
    strictEqual(label.get("name"), defaultLabel.name);
    strictEqual(label.get("color"), defaultLabel.color);
});

test("readable name", function () {
    model.set("name", "");
    strictEqual(typeof model.get("readableName"), "string");
    strictEqual(model.get("readableName"), "");
    model.set("name", "bucket");
    strictEqual(typeof model.get("readableName"), "string");
    strictEqual(model.get("readableName"), "bucket");
    model.set("name", "bucket.key");
    strictEqual(typeof model.get("readableName"), "string");
    strictEqual(model.get("readableName"), "bucket");
    model.set("name", "bucket.priority.key");
    strictEqual(typeof model.get("readableName"), "string");
    strictEqual(model.get("readableName"), "bucket");
    model.set("name", "backlog.0.bk");
    strictEqual(typeof model.get("readableName"), "string");
    strictEqual(model.get("readableName"), "backlog");
});

test("key", function () {
    model.set("name", "");
    strictEqual(typeof model.get("key"), "string");
    strictEqual(model.get("key"), "");
    model.set("name", "name");
    strictEqual(typeof model.get("key"), "string");
    strictEqual(model.get("key"), "name");
    model.set("name", "name.key");
    strictEqual(typeof model.get("key"), "string");
    strictEqual(model.get("key"), "key");
    model.set("name", "name.priority.key");
    strictEqual(typeof model.get("key"), "string");
    strictEqual(model.get("key"), "key");
    model.set("name", "backlog.0.bk");
    strictEqual(typeof model.get("key"), "string");
    strictEqual(model.get("key"), "bk");
    model.set("name", "M.sz");
    strictEqual(typeof model.get("key"), "string");
    strictEqual(model.get("key"), "sz");
    model.set("name", "ops.tm");
    strictEqual(typeof model.get("key"), "string");
    strictEqual(model.get("key"), "tm");
});

test("has not matching key", function () {
    model.set("name", "");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(!model.hasKey("ab"));
    model.set("name", "abcd");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(!model.hasKey("ab"));
    model.set("name", "ab.cd");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(!model.hasKey("ab"));
    model.set("name", "ab.cd.ef");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(!model.hasKey("ab"));
});

test("has matching key", function () {
    model.set("name", "ab");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(model.hasKey("ab"));
    model.set("name", "abcd");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(model.hasKey("abcd"));
    model.set("name", "ab.cd");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(model.hasKey("cd"));
    model.set("name", "ab.cd.ef");
    strictEqual(typeof model.hasKey("ab"), "boolean");
    ok(model.hasKey("ef"));
});
