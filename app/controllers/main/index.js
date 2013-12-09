export default Ember.Controller.extend({
    buckets: null,
    sizes: null,
    teams: null,

    sortedBuckets: function () {
        if (!this.get("buckets")) return;

        return this.get("buckets").sort(
            function (a, b) {
                return a.get("priority") - b.get("priority");
            }
        );
    }.property("buckets")
});
