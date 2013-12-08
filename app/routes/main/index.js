export default Ember.Route.extend({
	beforeModel: function () {
		if (!this.controllerFor("auth").get("token")) {
			this.transitionTo("main.login");
		}
	},
    setupController: function () {
        // Setup everything
        var _this = this,
            auth = this.controllerFor("auth"),
            settings = this.controllerFor("main.settings"),
            userOrOrganization = this.modelFor("main").userOrOrganization;

        // 1. Get or create tracker repository
        // 1.a Try to get the tracker repository
        this.getTrackerRepository(userOrOrganization)
            .then(
                function (response) {
                    console.log(response);
                },
                function () {
                    // 1.b Try to create the tracker repository as an user
                    _this.createTrackerRepositoryAsUser()
                        .then(
                            null,
                            function () {
                                // 1.c Try to create the tracker repository as an organization
                                _this.createTrackerRepositoryAsOrganization(userOrOrganization)
                                    .then(
                                        function () {
                                        }
                                    );

                            }
                        );
                }
            );

        // 2. Get labels
        // 3. Get or create buckets
        // 4. Get or create sizes
        // 5. Get or create teams
        // 6. Get issues
        // 7. Parse issues
        // 8. Done?
    },

    getTrackerRepository: function (userOrOrganization) {
        return this.controllerFor("auth").request("GET", "/repos/" + userOrOrganization + "/tracker");
    },
    buildTrackerRepository: function () {
        return {
            name: "tracker",
            description: "Central task tracker.",
            homepage: "0.0.0.0:8000",
            privated: true,
            has_issues: true,
            // team_id number: ?,
            auto_init: true
        };
    },
    createTrackerRepositoryAsUser: function () {
        return this.controllerFor("auth").request("POST", "/user/repos", { data: this.buildTrackerRepository() });
    },
    createTrackerRepositoryAsOrganization: function (userOrOrganization) {
        return this.controllerFor("auth").request("POST", "/orgs/" + userOrOrganization + "/repos", { data: this.buildTrackerRepository() });
    },
    getAllLabelsForTrackerRepository: function (userOrOrganization) {
        return this.controllerFor("auth").request("GET", "/repos/" + userOrOrganization + "/tracker/labels");
    },
    parseBucketsFromLabels: function () {},
    addDefaultBuckets: function () {},
    parseSizesFromLabels: function () {},
    addDefaultSizes: function () {},
    parseTeamsFromLabels: function () {},
    addDefaultTeams: function () {},
    getAllIssuesForTrackerRepository: function () {},
    parseIssue: function () {}
});
