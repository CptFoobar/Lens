(function() {
    $(function() {
        const CATEGORIES = ["city", "computer", "flowers", "food", "home", "landscape", "mountains", "music", "nasa", "nature", "people", "shopping", "sky", "tree", "work"]

        browser.storage.local.get().then(updateUIConfig, null);
        var sendConfigBroadcast = true;

        function updateUIConfig(userData) {
            if (isEmptyObject(userData)) resetStorage();
            sendConfigBroadcast = false;
            //console.log("[Lens] data: ", JSON.stringify(userData));
            $("#showTimeDate").prop('checked', userData["showTimeDate"]);
            var c = userData.categories;
            $(".category-item").each(function() {
                $(this).prop('checked', c[$(this).attr("id")]);
            });
            $("#randomImages").prop('checked', userData["randomImages"]);
            $(".category-item").each(function() {
                if (userData["randomImages"])
                    $(this).attr("disabled", true);
                else
                    $(this).removeAttr("disabled");
            });
            if (userData["randomImages"]) {
                $(".category-table td span").css("color", "#888");
            } else {
                $(".category-table td span").css("color", "#333");
            }
            sendConfigBroadcast = true;
        }

        function resetStorage() {
            var config = {
                "showTimeDate": false,
                "categories": CATEGORIES,
                "randomImages": true
            }
            browser.storage.local.set(config).then(null, null);
            updateUIConfig(config);
        }

        function isEmptyObject(obj) {
            return (Object.keys(obj).length === 0 && obj.constructor === Object);
        }

        $("#showTimeDate").change(function() {
            if (sendConfigBroadcast) {
                browser.storage.local.set({
                    "showTimeDate": $(this).is(":checked")
                }).then(null, null);
            }
        });

        $("#randomImages").change(function() {
            if (sendConfigBroadcast) {
                var random = $(this).is(":checked");
                browser.storage.local.set({
                    "randomImages": random
                }).then(null, null);
                $(".category-item").each(function() {
                    if (random)
                        $(this).attr("disabled", true);
                    else
                        $(this).removeAttr("disabled");
                });
                if (random) {
                    $(".category-table td span").css("color", "#888");
                } else {
                    $(".category-table td span").css("color", "#333");
                }
            }

        });

        $(".category-item").change(function() {
            if (sendConfigBroadcast) {
                var selectedCategories = {};
                $(".category-item").each(function() {
                    selectedCategories[$(this).attr("id")] = $(this).is(":checked");
                });
                browser.storage.local.set({
                    "categories": selectedCategories
                }).then(function() {
                    //console.log("setCategories");
                }, null);
            }
        });
    });
})();
