import Model from "appkit/models/model";

import Label from "appkit/models/label";
import Bucket from "appkit/models/bucket";
import Size from "appkit/models/size";
import Team from "appkit/models/team";

import Issue from "appkit/models/issue";

var Repository = Model.extend({
    owner: null,
    name: null,
    full_name: null,
    description: null,
    private: null,
    fork: null,
    url: null,
    html_url: null,
    clone_url: null,
    git_url: null,
    ssh_url: null,
    svn_url: null,
    mirror_url: null,
    homepage: null,
    language: null,
    forks_count: null,
    stargazers_count: null,
    watchers_count: null,
    size: null,
    master_branch: null,
    open_issues_count: null,
    pushed_at: null,
    created_at: null,
    updated_at: null,
    subscribers_count: null,
    organization: null,
    parent: null,
    source: null,
    has_issues: null,
    has_wiki: null,
    has_downloads: null,

    labels: null,
    buckets: null,
    sizes: null,
    teams: null,

    issues: null,

    findAllLabels: function (controller) {
        var _this = this;

        return Label.findAll(controller, this.get("owner.login"))
            .then(
                function (labels) {
                    var buckets = [],
                        sizes = [],
                        teams = [];

                    // Extract key labels
                    for (var i = 0; i < labels.length; i++) {
                        var label = labels[i];

                        if (label.hasKey("bk")) {
                            buckets.push(Model.asResolvedPromise(label));
                            continue;
                        }
                        if (label.hasKey("sz")) {
                            sizes.push(Model.asResolvedPromise(label));
                            continue;
                        }
                        if (label.hasKey("tm")) {
                            teams.push(Model.asResolvedPromise(label));
                            continue;
                        }
                    }

                    // Fill array with create promises if empty
                    if (!buckets.length) buckets = Bucket.createDefaultsRequests();
                    if (!sizes.length) sizes = Size.createDefaultsRequests();
                    if (!teams.length) teams = Team.createDefaultsRequests();

                    // Resolve buckets requests
                    return Ember.RSVP.all(buckets).then(
                        function (buckets) {
                            _this.set(
                                "buckets", buckets.map(
                                    function (bucket) {
                                        return Bucket.create(bucket);
                                    }
                                ).sort(
                                    function (a, b) {
                                        return a.get("priority") - b.get("priority");
                                    }
                                )
                            );

                            // Resolve sizes requests
                            return Ember.RSVP.all(sizes).then(
                                function (sizes) {
                                    _this.set(
                                        "sizes", sizes.map(
                                            function (size) {
                                                return Size.create(size);
                                            }
                                        )
                                    );

                                    // Resolve teams requests
                                    return Ember.RSVP.all(teams).then(
                                        function (teams) {
                                            _this.set(
                                                "teams", teams.map(
                                                    function (team) {
                                                        return Team.create(team);
                                                    }
                                                )
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
    },

    createIssue: function (controller, issueObject) {
        return controller.request("POST", "/repos/" + this.get("owner.login") + "/tracker/issues", { data: issueObject });
    },
    findAllIssues: function (controller) {
        var _this = this;

        return Issue.findAll(controller, this)
            .then(
                function (issues) {
                    _this.set("issues", issues);
                }
            );
    }
});

Repository.reopenClass({
    getOrCreate: function (requestController, targetController, owner, callback) {
        var _this = this;

        // 1. Try to get the repository
        return this._get(requestController, owner)
            .then(
                function (repositoryObject) {
                    var repository = _this._parse(repositoryObject);
                    targetController.set("model", repository);
                    callback(requestController, repository);
                },
                function () {
                    // 2. Try to create the repository as an user
                    _this._createAsUser(requestController)
                        .then(
                            function (repositoryObject) {
                                var repository = _this._parse(repositoryObject);
                                targetController.set("model", repository);
                                callback(requestController, repository);
                            },
                            function () {
                                // 3. Try to create the repository as an organization
                                _this._createAsOrganization(requestController, owner)
                                    .then(
                                        function (repositoryObject) {
                                            var repository = _this._parse(repositoryObject);
                                            targetController.set("model", repository);
                                            callback(requestController, repository);
                                        }
                                        // TODO: Handle error
                                    );

                            }
                        );
                }
            );
    },

    _default: {
        name: "tracker",
        description: "Central task tracker.",
        homepage: "0.0.0.0:8000",
        privated: true,
        has_issues: true,
        // team_id number: ?,
        auto_init: true
    },
    _get: function (controller, owner) {
        return controller.request("GET", "/repos/" + owner + "/tracker");
    },
    _createAsUser: function (controller) {
        return controller.request("POST", "/user/repos", { data: this._default });
    },
    _createAsOrganization: function (controller, owner) {
        return controller.request("POST", "/orgs/" + owner + "/repos", { data: this._default });
    },
    _parse: function (repositoryObject) {
        return Repository.create(repositoryObject);
    }
});

export default Repository;
