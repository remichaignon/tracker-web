import Label from "appkit/models/label";

var Bucket = Label.extend({
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

Bucket.reopenClass({
    _defaults: [
        { name: "icebox.1.bk", color: "d4f0ff" },
        { name: "backlog.2.bk", color: "0000ff" },
        { name: "in progress.3.bk", color: "ffff00" },
        { name: "code review.4.bk", color: "ffa500" },
        { name: "qa.5.bk", color: "ff0000" },
        { name: "done.6.bk", color: "00ff00" }
    ]
});

export default Bucket;
