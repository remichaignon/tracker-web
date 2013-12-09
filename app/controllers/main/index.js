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
        //if (!this.get("issues") || !this.get("buckets")) return;

        //
    }.property("issues", "buckets"),

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


            var labels = [],
                issue = this.get("newIssue");

            // 5. Transform size into label
            labels.push(issue.get("size.name"));

            // 6. Transform team into label
            labels.push(issue.get("team.name"));

            // 7. Set bucket to default (first one)
            labels.push(this.get("buckets.firstObject.name"));

            // 8. Create request
            issue.set("labels", labels);

            this.get("controllers.auth").request("POST", "/repos/" + this.get("userOrOrganization") + "/tracker/issues", { data: issue })
                .then(
                    function () {
                        this.set("newIssue", null);
                    }
                );
        },
        showIssueEditor: function () {},
        editIssue: function () {},
        moveIssueToNextBucket: function () {
            // 1. Get current bucket
            // 2. Get next bucket
            // 3. Swap buckets
        },
        moveIssueToPreviousBucket: function () {
            // 1. Get current bucket
            // 2. Get previous bucket
            // 3. Swap buckets
        },
        closeIssue: function () {}
    }
});
