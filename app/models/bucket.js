export default Ember.Object.extend({
    name: null,
    color: null,

    readableName: function () {
        var name = this.get("name");
        name = name.substr(0, name.lastIndexOf("."));
        return name.substr(0, name.lastIndexOf("."));
    }.property("name"),
    priority: function () {
        var name = this.get("name");
        name = name.substr(0, name.lastIndexOf("."));
        return parseInt(name.substr(name.lastIndexOf(".") + 1), 10);
    }.property("name")
});
