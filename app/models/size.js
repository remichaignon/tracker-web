export default Ember.Object.extend({
    url: null,
    name: null,
    color: null,

    readableName: function () {
        var name = this.get("name");
        return name.substr(0, name.lastIndexOf("."));
    }.property("name")
});
