import Label from "appkit/models/label";

var Size = Label.extend({
    readableName: function () {
        var name = this.get("name");
        return name.substr(0, name.lastIndexOf("."));
    }.property("name")
});

Size.reopenClass({
    _defaults: [
        { name: "S.sz", color: "ffffff" },
        { name: "M.sz", color: "888888" },
        { name: "L.sz", color: "000000" }
    ]
});

export default Size;
