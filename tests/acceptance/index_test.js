var App;

module("Acceptances - Index", {
    setup: function () {
        App = startApp();
    },
    teardown: function () {
        Ember.run(App, "destroy");
    }
});

test("index renders", function () {
    expect(6);

    visit("/").then(function () {
        ok(exists("h2#title"));
        ok(exists("form"));
        ok(exists("input"));
        ok(exists("button"));

        var title = find("h2#title"),
            button = find("button");

        equal(title.text(), "Welcome to Tracker");
        equal(button.text(), "Get tracking");
    });
});
