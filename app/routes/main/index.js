import Repository from "appkit/models/repository";
import Bucket from "appkit/models/bucket";
import Size from "appkit/models/size";
import Team from "appkit/models/team";

export default Ember.Route.extend({
	beforeModel: function () {
		if (!this.controllerFor("auth").get("token")) {
			this.transitionTo("main.login");
		}
	},
    setupController: function () {
        // Setup everything
        var _this = this,
            userOrOrganization = this.modelFor("main").userOrOrganization;

        // 1. Get or create tracker repository
        // 1.a Try to get the tracker repository
        this.getTrackerRepository(userOrOrganization)
            .then(
                function (trackerRepository) {
                    _this.setupWithTrackerRepository(trackerRepository);
                },
                function () {
                    // 1.b Try to create the tracker repository as an user
                    _this.createTrackerRepositoryAsUser()
                        .then(
                            function (trackerRepository) {
                                _this.setupWithTrackerRepository(trackerRepository);
                            },
                            function () {
                                // 1.c Try to create the tracker repository as an organization
                                _this.createTrackerRepositoryAsOrganization(userOrOrganization)
                                    .then(
                                        function (trackerRepository) {
                                            _this.setupWithTrackerRepository(trackerRepository);
                                        }
                                    );

                            }
                        );
                }
            );
    },
    setupWithTrackerRepository: function (trackerRepository) {
        var _this = this,
            controller = this.controllerFor("main.index");

        // 2. Get labels
        this.getAllLabelsForTrackerRepository(trackerRepository.owner.login)
            .then(
                function (labels) {
                    // 3. Get or create buckets
                    var bucketsFromLabels = labels.filter(
                        function (item) {
                            if (item.name.substr(-3) === ".bk") return true;
                        }
                    );

                    var finishBucketParsing = function (bucketLabels) {
                        controller.set("buckets", _this.parseBucketsFromLabels(bucketLabels));
                        return labels;
                    };

                    if (!bucketsFromLabels.length) {
                        return _this.addDefaultBucketLabels(trackerRepository.owner.login).then(
                            function (addedBucketLabels) {
                                return finishBucketParsing(addedBucketLabels);
                            }
                        );
                    }

                    return finishBucketParsing(bucketsFromLabels);
                }
            )
            .then(
                function (labels) {
                    // 4. Get or create sizes
                    var sizesFromLabels = labels.filter(
                        function (item) {
                            if (item.name.substr(-3) === ".sz") return true;
                        }
                    );

                    var finishSizeParsing = function (sizeLabels) {
                        controller.set("sizes", _this.parseSizesFromLabels(sizeLabels));
                        return labels;
                    };

                    if (!sizesFromLabels.length) {
                        return _this.addDefaultSizeLabels(trackerRepository.owner.login).then(
                            function (addedSizeLabels) {
                                return finishSizeParsing(addedSizeLabels);
                            }
                        );
                    }

                    return finishSizeParsing(sizesFromLabels);
                }
            )
            .then(
                function (labels) {
                    // 5. Get or create teams
                    var teamsFromLabels = labels.filter(
                        function (item) {
                            if (item.name.substr(-3) === ".tm") return true;
                        }
                    );

                    var finishTeamParsing = function (teamLabels) {
                        controller.set("teams", _this.parseTeamsFromLabels(teamLabels));
                        return labels;
                    };

                    if (!teamsFromLabels.length) {
                        return _this.addDefaultTeamLabels(trackerRepository.owner.login).then(
                            function (addedTeamLabels) {
                                return finishTeamParsing(addedTeamLabels);
                            }
                        );
                    }

                    return finishTeamParsing(teamsFromLabels);
                }
            );
        // 6. Get issues
        // 7. Parse issues
        // 8. Done?
    },

    // Tracker get or create functions
    getTrackerRepository: function (userOrOrganization) {
        return this.controllerFor("auth").request("GET", "/repos/" + userOrOrganization + "/tracker");
    },
    buildTrackerRepositoryObject: function () {
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
        return this.controllerFor("auth").request("POST", "/user/repos", { data: this.buildTrackerRepositoryObject() });
    },
    createTrackerRepositoryAsOrganization: function (userOrOrganization) {
        return this.controllerFor("auth").request("POST", "/orgs/" + userOrOrganization + "/repos", { data: this.buildTrackerRepositoryObject() });
    },
    parseTrackerRepository: function (trackerRepositoryObject) {
        return Repository.create(trackerRepositoryObject);
    },

    // Labels get or create functions
    getAllLabelsForTrackerRepository: function (userOrOrganization) {
        return this.controllerFor("auth").request("GET", "/repos/" + userOrOrganization + "/tracker/labels");
    },
    parseBucketsFromLabels: function (bucketLabels) {
        var buckets = [];

        bucketLabels.forEach(
            function (element) {
                buckets.push(Bucket.create(element));
            }
        );

        return buckets;
    },
    addDefaultBucketLabels: function (userOrOrganization) {
        var createBucketLabelRequests = [],
            auth = this.controllerFor("auth"),
            defaultBuckets = this.controllerFor("main.settings").get("defaultBuckets");

        defaultBuckets.forEach(
            function (element) {
                createBucketLabelRequests.push(auth.request("POST", "/repos/" + userOrOrganization + "/tracker/labels", { data: element }));
            }
        );

        return Ember.RSVP.all(createBucketLabelRequests);
    },
    parseSizesFromLabels: function (sizeLabels) {
        var sizes = [];

        sizeLabels.forEach(
            function (element) {
                sizes.push(Size.create(element));
            }
        );

        return sizes;
    },
    addDefaultSizeLabels: function (userOrOrganization) {
        var createSizeLabelRequests = [],
            auth = this.controllerFor("auth"),
            defaultSizes = this.controllerFor("main.settings").get("defaultSizes");

        defaultSizes.forEach(
            function (element) {
                createSizeLabelRequests.push(auth.request("POST", "/repos/" + userOrOrganization + "/tracker/labels", { data: element }));
            }
        );

        return Ember.RSVP.all(createSizeLabelRequests);
    },
    parseTeamsFromLabels: function (teamLabels) {
        var teams = [];

        teamLabels.forEach(
            function (element) {
                teams.push(Team.create(element));
            }
        );

        return teams;
    },
    addDefaultTeamLabels: function (userOrOrganization) {
        var createTeamLabelRequests = [],
            auth = this.controllerFor("auth"),
            defaultTeams = this.controllerFor("main.settings").get("defaultTeams");

        defaultTeams.forEach(
            function (element) {
                createTeamLabelRequests.push(auth.request("POST", "/repos/" + userOrOrganization + "/tracker/labels", { data: element }));
            }
        );

        return Ember.RSVP.all(createTeamLabelRequests);
    },

    getAllIssuesForTrackerRepository: function () {},
    parseIssue: function () {}
});
