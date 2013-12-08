var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function() {
    this.resource(
        "main",
        { path: "/:userOrOrganization" },
        function () {
            this.route("login");
            this.route("settings");
        }
    );

    this.route("notFound", { path: "*" });
});

export default Router;
