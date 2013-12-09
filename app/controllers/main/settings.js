export default Ember.Controller.extend({
    defaultBuckets: [
        { name: "icebox.1.bk", color: "d4f0ff" },
        { name: "backlog.2.bk", color: "0000ff" },
        { name: "in progress.3.bk", color: "ffff00" },
        { name: "code review.4.bk", color: "ffa500" },
        { name: "qa.5.bk", color: "ff0000" },
        { name: "done.6.bk", color: "00ff00" }
    ],
    defaultSizes: [
        { name: "S.sz", color: "ffffff" },
        { name: "M.sz", color: "888888" },
        { name: "L.sz", color: "000000" }
    ],
    defaultTeams: [
        { name: "app.tm", color: "ff69b4" },
        { name: "ops.tm", color: "964b00" },
        { name: "data.tm", color: "663399" }
    ]
});
