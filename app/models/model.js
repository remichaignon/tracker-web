var Model = Ember.Object.extend({});

Model.reopenClass({
    asResolvedPromise: function (objectToWrap) {
        return new Ember.RSVP.Promise(
            function(resolve) {
                resolve(objectToWrap);
            }
        );
    },
    asRejectedPromise: function (objectToWrap) {
        return new Ember.RSVP.Promise(
            function(resolve, reject) {
                reject(objectToWrap);
            }
        );
    }
});

export default Model;
