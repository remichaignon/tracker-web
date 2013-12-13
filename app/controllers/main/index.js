import Issue from "appkit/models/issue";

export default Ember.ObjectController.extend({
    needs: ["auth"],

    newIssue: null,

    issuesByBuckets: function () {
        if (!this.get("issues") || !this.get("buckets")) return;

        var issuesByBuckets = this.get("buckets").copy();

        issuesByBuckets.forEach(
            function (bucket) {
                bucket.set("issues", []);
            }
        );

        this.get("issues").forEach(
            function (issue) {
                var bucket = issuesByBuckets.findProperty("name", issue.get("bucket.name"));

                if (bucket) {
                    bucket.issues.push(issue);
                }
            }
        );

        issuesByBuckets.forEach(
            function (bucket) {
                bucket.get("issues").sort(
                    function (a, b) {
                        return b.get("priority") - a.get("priority");
                    }
                );
            }
        );

        return issuesByBuckets;
    }.property("issues", "issues.@each.priority", "issues.@each.bucket", "buckets"),

    actions: {
        showIssueCreator: function () {
            this.set("newIssue", Issue.create());
        },
        createIssue: function () {
            var _this = this;

            // 1. Enforce title
            if (!this.get("newIssue.title")) return;

            // 2. Enforce body
            if (!this.get("newIssue.body")) return;

            // 3. Enforce size
            if (!this.get("newIssue.size")) return;

            // 4. Enfore team
            if (!this.get("newIssue.team")) return;

            // 5. Create request
            var repository = this.get("model");
            this.set("newIssue.bucket", this.get("buckets.firstObject"));

            repository.createIssue(this.get("controllers.auth"), this.get("newIssue.object"))
                .then(
                    function (issueObject) {
                        _this.get("issues").pushObject(Issue.build(issueObject, repository));
                        _this.set("newIssue", null);
                    }
                );
        },
        showIssueEditor: function () {},
        editIssue: function () {},
        increasePriority: function (issue) {
            if (!issue) return;

            issue.set("priority", issue.get("priority") + 1);
            return issue.saveMetadata(this.get("controllers.auth"));
        },
        decreasePriority: function (issue) {
            if (!issue) return;

            issue.set("priority", issue.get("priority") - 1);
            return issue.saveMetadata(this.get("controllers.auth"));
        },
        moveIssueToNextBucket: function (issue) {
            if (!issue) return;

            // 1. Get current bucket
            var currentBucket = issue.get("bucket");

            // 2. Get next bucket
            var nextBucket = this.get("buckets").findProperty("priority", currentBucket.get("priority") + 1);

            if (!nextBucket) return;

            // 3. Swap buckets
            issue.set("bucket", nextBucket);
            issue.patch(this.get("controllers.auth"));
        },
        moveIssueToPreviousBucket: function (issue) {
            if (!issue) return;

            // 1. Get current bucket
            var currentBucket = issue.get("bucket");

            // 2. Get previous bucket
            var previousBucket = this.get("buckets").findProperty("priority", currentBucket.get("priority") - 1);

            if (!previousBucket) return;

            // 3. Swap buckets
            issue.set("bucket", previousBucket);
            issue.patch(this.get("controllers.auth"));
        },
        closeIssue: function () {}
    }
});
