import Model from "appkit/models/model";

var Label = Model.extend({
    url: null,
    name: null,
    color: null,

    hasKey: function (key) {
        return (this.get("name").substr(-3) === key);
    }
});

Label.reopenClass({
    findAll: function (controller, owner) {
        return controller.request("GET", "/repos/" + owner + "/tracker/labels")
            .then(
                function (labels) {
                    return labels.map(
                        function (label) {
                            return Label.create(label);
                        }
                    );
                }
            );
    },
    createDefaultsRequests: function (controller, owner) {
        var _this = this,
            requests = [];

        this._defaults.forEach(
            function (defaultLabel) {
                requests.push(_this._create(controller, owner, defaultLabel));
            }
        );

        return requests;
    },

    _create: function (controller, owner, label) {
        return controller.request("POST", "/repos/" + owner + "/tracker/labels", { data: label });
    }
});

export default Label;
