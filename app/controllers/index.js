export default Ember.Controller.extend({
	userOrOrganisation: null,

	actions: {
		track: function () {
			var userOrOrganisation = this.get("userOrOrganisation");

			if (!userOrOrganisation) {
				return;
			}

			this.transitionToRoute("main.index", userOrOrganisation);
		}
	}
});
