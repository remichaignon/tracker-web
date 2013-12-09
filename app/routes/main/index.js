import Repository from "appkit/models/repository";
import Bucket from "appkit/models/bucket";
import Size from "appkit/models/size";
import Team from "appkit/models/team";

export default Ember.Route.extend({
    userOrOrganization: null,

	beforeModel: function () {
		if (!this.controllerFor("auth").get("token")) {
			this.transitionTo("main.login");
		}
	},
    setupController: function () {
        // Setup everything
        var _this = this,
            userOrOrganization = this.modelFor("main").userOrOrganization;

        if (!userOrOrganization) return;

        this.set("userOrOrganization", userOrOrganization);

        // 1. Get or create tracker repository
        // 1.a Try to get the tracker repository
        this.getTrackerRepository()
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
                                _this.createTrackerRepositoryAsOrganization()
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
        this.getAllLabelsForTrackerRepository()
            .then(
                function (labels) {
                    // 3. Get or create buckets
                    return _this.getOrCreateLabels(labels, ".bk", Bucket, "buckets", "defaultBuckets");
                }
            )
            .then(
                function (labels) {
                    // 4. Get or create sizes
                    return _this.getOrCreateLabels(labels, ".sz", Size, "sizes", "defaultSizes");
                }
            )
            .then(
                function (labels) {
                    // 5. Get or create teams
                    return _this.getOrCreateLabels(labels, ".tm", Team, "teams", "defaultTeams");
                }
            );
        // 6. Get issues
        // 7. Parse issues
        // 8. Done?
    },

    // Tracker repository get or create functions
    getTrackerRepository: function () {
        return this.controllerFor("auth").request("GET", "/repos/" + this.get("userOrOrganization") + "/tracker");
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
    createTrackerRepositoryAsOrganization: function () {
        return this.controllerFor("auth").request("POST", "/orgs/" + this.get("userOrOrganization") + "/repos", { data: this.buildTrackerRepositoryObject() });
    },
    parseTrackerRepository: function (trackerRepositoryObject) {
        return Repository.create(trackerRepositoryObject);
    },

    // Labels get or create functions
    getAllLabelsForTrackerRepository: function () {
        return this.controllerFor("auth").request("GET", "/repos/" + this.get("userOrOrganization") + "/tracker/labels");
    },
    createLabel: function (labelObject) {
        return this.controllerFor("auth").request("POST", "/repos/" + this.get("userOrOrganization") + "/tracker/labels", { data: labelObject });
    },
    addDefaultLabels: function (defaultLabelAttributeName) {
        var _this = this,
            createLabelRequests = [],
            defaultLabels = this.controllerFor("main.settings").get(defaultLabelAttributeName);

        defaultLabels.forEach(
            function (element) {
                createLabelRequests.push(_this.createLabel(element));
            }
        );

        return Ember.RSVP.all(createLabelRequests);

    },
    filterLabels: function (labels, key) {
        return labels.filter(
            function (label) {
                if (label.name.substr(-3) === key) return true;
            }
        );
    },
    parseLabels: function (labels, classLabel) {
        var instances = [];

        labels.forEach(
            function (element) {
                instances.push(classLabel.create(element));
            }
        );

        return instances;
    },
    buildFinishLabelParsingFunction: function (classLabel, attribute, allLabels) {
        var _this = this,
            controller = this.controllerFor("main.index");

        return function (labels) {
            controller.set(attribute, _this.parseLabels(labels, classLabel));
            return allLabels;
        };
    },
    getOrCreateLabels: function (allLabels, key, classLabel, attribute, defaultAttribute) {
        var fromLabels = this.filterLabels(allLabels, key),
            finishParsing = this.buildFinishLabelParsingFunction(classLabel, attribute, allLabels);

        if (!fromLabels.length) {
            return this.addDefaultLabels(defaultAttribute).then(
                function (addedLabels) {
                    return finishParsing(addedLabels);
                }
            );
        }

        return finishParsing(fromLabels);
    },

    getAllIssuesForTrackerRepository: function () {
        return this.controllerFor("auth").request("GET", "/repos/" + this.get("userOrOrganization") + "/tracker/issues");
    },
    parseIssue: function () {}
});
