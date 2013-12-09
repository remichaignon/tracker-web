import Issue from "appkit/models/issue";

export default Ember.Controller.extend({
    needs: ["auth"],

    repository: null,

    buckets: null,
    sizes: null,
    teams: null,

    issues: null,

    newIssue: null,
    userOrOrganization: null,

    sortedBuckets: function () {
        if (!this.get("buckets")) return;

        return this.get("buckets").sort(
            function (a, b) {
                return a.get("priority") - b.get("priority");
            }
        );
    }.property("buckets"),
    issuesByBuckets: function () {
        if (!this.get("issues") || !this.get("sortedBuckets")) return;

        var issuesByBuckets = this.get("sortedBuckets").copy();

        issuesByBuckets.forEach(
            function (element) {
                element.set("issues", []);
            }
        );

        this.get("issues").forEach(
            function (element) {
                var bucket = issuesByBuckets.findProperty("name", element.get("bucket.name"));

                if (bucket) {
                    bucket.issues.push(element);
                }
            }
        );

        return issuesByBuckets;
    }.property("issues.@each.bucket", "sortedBuckets"),

    actions: {
        showIssueCreator: function () {
            this.set("newIssue", Issue.create());
        },
        createIssue: function () {
            // 1. Enforce title
            if (!this.get("newIssue.title")) return;

            // 2. Enforce body
            if (!this.get("newIssue.body")) return;

            // 3. Enforce size
            if (!this.get("newIssue.size")) return;

            // 4. Enfore team
            if (!this.get("newIssue.team")) return;

            // 5. Create request
            this.set("newIssue.bucket", this.get("buckets.firstObject"));

            this.get("controllers.auth").request("POST", "/repos/" + this.get("userOrOrganization") + "/tracker/issues", { data: this.get("newIssue").asObject() })
                .then(
                    function (githubIssue) {
                        // TODO: Parse the issue right away
                        this.set("newIssue", null);
                    }
                );
        },
        showIssueEditor: function () {},
        editIssue: function () {},
        moveIssueToNextBucket: function (issue) {
            if (!issue) return;

            // 1. Get current bucket
            var currentBucket = issue.get("bucket");

            // 2. Get next bucket
            var nextBucket = this.get("buckets").findProperty("priority", currentBucket.get("priority") + 1);

            if (!nextBucket) return;

            issue.set("bucket", nextBucket);

            // 3. Swap buckets
            this.get("controllers.auth").request("PATCH", "/repos/" + this.get("userOrOrganization") + "/tracker/issues/" + issue.get("number"), { data: issue.asObject() })
                .then(
                    function () {
                        // TODO: Parse issue right away
                    }
                );
        },
        moveIssueToPreviousBucket: function (issue) {
            if (!issue) return;

            // 1. Get current bucket
            var currentBucket = issue.get("bucket");

            // 2. Get previous bucket
            var previousBucket = this.get("buckets").findProperty("priority", currentBucket.get("priority") - 1);

            if (!previousBucket) return;

            issue.set("bucket", previousBucket);

            // 3. Swap buckets
            this.get("controllers.auth").request("PATCH", "/repos/" + this.get("userOrOrganization") + "/tracker/issues/" + issue.get("number"), { data: issue.asObject() })
                .then(
                    function () {
                        // TODO: Parse issue right away
                    }
                );
        },
        closeIssue: function () {}
    }
});
