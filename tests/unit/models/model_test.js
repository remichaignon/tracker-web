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

test("has asResolvedPromise method", function () {
    ok(Model.asResolvedPromise);
    strictEqual(typeof Model.asResolvedPromise, "function");
});

test("asResolvedPromise returns a promise", function () {
    ok(Model.asResolvedPromise() instanceof Ember.RSVP.Promise);
});

test("has asRejectedPromise method", function () {
    ok(Model.asRejectedPromise);
    strictEqual(typeof Model.asRejectedPromise, "function");
});

test("asRejectedPromise returns a promise", function () {
    ok(Model.asRejectedPromise() instanceof Ember.RSVP.Promise);
});
