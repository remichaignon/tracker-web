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

    repository: null,

    bucket: null,
    size: null,
    team: null,

    asObject: function () {
        if (!this.get("label.length")) this.set("labels", []);

        var labels = this.get("labels");

        labels.push(this.get("size.name"));
        labels.push(this.get("team.name"));
        labels.push(this.get("bucket.name"));

        this.set("labels", labels);

        return this.getProperties(
            "url",
            "html_url",
            "number",
            "state",
            "title",
            "body",
            "user",
            "labels",
            "assignee",
            "milestone",
            "comments",
            "pull_request",
            "closed_at",
            "created_at",
            "updated_at"
        );
    },

    patch: function (controller) {
        return controller.request("PATCH", "/repos/" + this.get("repository.owner.login") + "/tracker/issues/" + this.get("number"), { data: this.asObject() });
    }
});

Issue.reopenClass({
    findAll: function (controller, repository) {
        var _this = this;

        return controller.request("GET", "/repos/" + repository.get("owner.login") + "/tracker/issues")
            .then(
                function (issues) {
                    return issues.map(
                        function (issue) {
                            return _this.parse(issue, repository);
                        }
                    );
                }
            );
    },

    parse: function (issueObject, repository) {
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
    }
});

export default Issue;
