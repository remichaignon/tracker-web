export default Ember.Controller.extend({
    token: "APPLICATION_TOKEN_CREATED_ON_GITHUB_WEBSITE",

    request: function (type, url, args) {
        var _this = this;

        args = args || {};

        return new Ember.RSVP.Promise(
            function(resolve, reject) {
                args.type = type;
                args.url = "https://api.github.com" + url;
                args.dataType = "json";
                args.contentType = "application/json; charset=utf-8";
                args.accept = "application/vnd.github.v3+json";

                if (args.data && type !== "GET") {
                    args.data = JSON.stringify(args.data);
                }

                args.beforeSend = function (xhr) {
                    xhr.setRequestHeader("Authorization", "token " + _this.get("token"));
                };

                args.success = function(xhr) {
                    xhr.then = null;
                    Ember.run(null, resolve, xhr);
                };

                args.error = function(xhr) {
                    xhr.then = null;
                    Ember.run(null, reject, xhr);
                };

                Ember.$.ajax(args);
            }
        );
    }
});
