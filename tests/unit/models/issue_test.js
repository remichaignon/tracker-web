import Issue from "appkit/models/issue";

var model;
module("Unit - IssueModel", {
    setup: function () {
        var container = isolatedContainer([
            "model:issue"
        ]);

        model = container.lookup("model:issue");
    }
});

test("it exists", function () {
    ok(model);
    ok(model instanceof Issue);
});
