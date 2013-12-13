import Model from "appkit/models/model";

import Label from "appkit/models/label";

var Issue = Model.extend({
    url: null,
    html_url: null,
    number: null,
    state: null,
    title: null,
    body: null,
    user: null,
    labels: null,
    assignee: null,
    milestone: null,
    comments: null,
    pull_request: null,
    closed_at: null,
    created_at: null,
    updated_at: null,

    priority: 0,

    repository: null,

    bucket: null,
    size: null,
    team: null,

    metaCommentId: null,

    metadata: function () {
        return JSON.stringify(
            {
                priority: this.get("priority")
            }
        );
    }.property("priority"),

    object: function () {
        if (!this.get("labels.length")) this.set("labels", []);

        var labels = this.get("labels");

        labels.push(this.get("bucket.name"));
        labels.push(this.get("size.name"));
        labels.push(this.get("team.name"));

        this.set("labels", labels);

        return this.getProperties(
            "state",
            "title",
            "body",
            "labels",
            "assignee",
            "milestone"
        );
    }.property("states", "title", "body", "labels", "assignee", "milestone", "bucket", "size", "team"),

    patch: function (controller) {
        return controller.request("PATCH", "/repos/" + this.get("repository.owner.login") + "/tracker/issues/" + this.get("number"), { data: this.get("object") });
    },
    saveMetadata: function (controller) {
        return Issue._patchFirstComment(controller, this.get("repository"), this, this.get("metadata"));
    }
});

Issue.reopenClass({
    findAll: function (controller, repository) {
        var _this = this;

        return controller.request("GET", "/repos/" + repository.get("owner.login") + "/tracker/issues")
            .then(
                function (issues) {
                    return issues.map(
                        function (issueObject) {
                            var issue = _this.build(issueObject, repository);
                            _this._getOrCreateFirstComment(controller, repository, issue);
                            return issue;
                        }
                    );
                }
            );
    },

    build: function (issueObject, repository) {
        var issue = Issue.create(issueObject),
            labels = issue.get("labels"),
            buckets = [],
            sizes = [],
            teams = [];

        issue.set("repository", repository);

        labels = labels.map(
            function (label) {
                return Label.create(label);
            }
        );

        // Extract key labels
        for (var i = 0; i < labels.length; i++) {
            var label = labels[i];

            if (label.hasKey(".bk")) {
                buckets.push(label);
                continue;
            }
            if (label.hasKey(".sz")) {
                sizes.push(label);
                continue;
            }
            if (label.hasKey(".tm")) {
                teams.push(label);
                continue;
            }
        }


        // TODO: Handle issues with missing / too many labels
        if (buckets.length !== 1) return;
        if (sizes.length !== 1) return;
        if (teams.length !== 1) return;

        issue.set("bucket", repository.get("buckets").findProperty("name", buckets[0].name));
        issue.set("size", repository.get("sizes").findProperty("name", sizes[0].name));
        issue.set("team", repository.get("teams").findProperty("name", teams[0].name));

        return issue;
    },

    _getOrCreateFirstComment: function (controller, repository, issue) {
        var _this = this;

        return this._getFirstComment(controller, repository, issue)
            .then(
                function (comment) {
                    return issue.setProperties(JSON.parse(comment.body));
                },
                function () {
                    _this._createFirstComment(controller, repository, issue)
                        .then(
                            function (comment) {
                                return issue.setProperties(JSON.parse(comment.body));
                            }
                            // TODO: Handle error
                        );
                }
            );
    },
    _getFirstComment: function (controller, repository, issue) {
        if (issue.get("metaCommentId")) {
            return controller.request("GET", "/repos/" + repository.get("owner.login") + "/tracker/issues/comments/" + issue.get("metaCommentId"));
        }
        else {
            return controller.request("GET", "/repos/" + repository.get("owner.login") + "/tracker/issues/" + issue.get("number") + "/comments")
                .then(
                    function (comments) {
                        if (!comments.length) {
                            // TODO: Handle error
                            return Model.asRejectedPromise();
                        }

                        var firstComment = comments[0];
                        issue.set("metaCommentId", firstComment.id);
                        return firstComment;
                    });
        }
    },
    _createFirstComment: function (controller, repository, issue) {
        return controller.request("POST", "/repos/" + repository.get("owner.login") + "/tracker/issues/" + issue.get("number") + "/comments", { data: { body: "{}" }})
            .then(
                function (comment) {
                    issue.set("metaCommentId", comment.id);
                    return comment;
                });
    },
    _patchFirstComment: function (controller, repository, issue, body) {
        if (!issue.get("metaCommentId")) {
            // TODO: Handle error
            return Model.asRejectedPromise();
        }

        return controller.request("PATCH", "/repos/" + repository.get("owner.login") + "/tracker/issues/comments/" + issue.get("metaCommentId"), { data: { body: body }});
    }
});

export default Issue;
