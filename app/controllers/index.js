export default Ember.Controller.extend({
	userOrOrganization: null,

	actions: {
		track: function () {
			var userOrOrganization = this.get("userOrOrganization");

			if (!userOrOrganization) {
				return;
			}

			this.transitionToRoute("main.index", userOrOrganization);
		}
	}
});
