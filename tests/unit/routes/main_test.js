import Main from "appkit/routes/main";

var route;
module("Unit - MainRoute", {
    setup: function(){
        var container = isolatedContainer([
            "route:main"
        ]);

        route = container.lookup("route:main");
    }
});

test("it exists", function () {
    ok(route);
    ok(route instanceof Main);
});
