import Label from "appkit/models/label";

var Bucket = Label.extend({
    priority: function () {
        return parseInt(this.get("name").split(".")[1] || 0, 10) || 0;
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
