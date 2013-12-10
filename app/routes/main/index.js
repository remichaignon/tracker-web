import Repository from "appkit/models/repository";
import Bucket from "appkit/models/bucket";
import Size from "appkit/models/size";
import Team from "appkit/models/team";
import Issue from "appkit/models/issue";

export default Ember.Route.extend({
	beforeModel: function () {
		if (!this.controllerFor("auth").get("token")) {
			this.transitionTo("main.login");
		}
	},
    setupController: function () {
        // Setup everything
        var userOrOrganization = this.modelFor("main").userOrOrganization;

        // TODO: Show error
        if (!userOrOrganization) return;

        Repository.getOrCreate(
            this.controllerFor("auth"),
            this.controllerFor("main.index"),
            userOrOrganization,
            function (controller, repository) {
                repository.findAllLabels(controller)
                    .then(
                        function () {
                            repository.findAllIssues(controller);
                        }
                    );
            }
        );
    }
});
