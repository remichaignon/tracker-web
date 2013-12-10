import Label from "appkit/models/label";

var Team = Label.extend({
    readableName: function () {
        var name = this.get("name");
        return name.substr(0, name.lastIndexOf("."));
    }.property("name")
});

Team.reopenClass({
    _defaults: [
        { name: "app.tm", color: "ff69b4" },
        { name: "ops.tm", color: "964b00" },
        { name: "data.tm", color: "663399" }
    ]
});

export default Team;
