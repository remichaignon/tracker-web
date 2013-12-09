export default Ember.Object.extend({
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
    }
});
