import Label from "appkit/models/label";

var Size = Label.extend({});

Size.reopenClass({
    _defaults: [
        { name: "S.sz", color: "ffffff" },
        { name: "M.sz", color: "888888" },
        { name: "L.sz", color: "000000" }
    ]
});

export default Size;
