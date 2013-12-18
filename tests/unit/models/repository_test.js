import Repository from "appkit/models/repository";

var model;
module("Unit - RepositoryModel", {
    setup: function () {
        var container = isolatedContainer([
            "model:repository"
        ]);

        model = container.lookup("model:repository");
    }
});

test("it exists", function () {
    ok(model);
    ok(model instanceof Repository);
});
