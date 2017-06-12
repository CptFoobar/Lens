(function() {
	// KKJj8Hz6_kA

    const API_RANDOM_URL = "https://api.unsplash.com/photos/random";
    const API_CATEGORY_URL = "https://api.unsplash.com/search/photos";
    const APP_ID = "835e33b21c0823a941974ec513f1779b56145387feb224b49ed18e20829481fe";
    const IMAGE_PARAMETERS = "?ixlib=rb-0.3.5&q=80&w=1080&fm=jpg&crop=entropy&cs=tinysrgb&fit=max&s=3e37bb826257d28dc8b0b39ca58e4a7c";
	const CATEGORIES = ["city", "computer", "flowers", "food", "home", "landscape", "mountains", "music", "nasa", "nature", "people", "shopping", "sky", "tree", "work"]
	const PLACEHOLDERS = [
		{
			url: "https://unsplash.com/photos/h3jarbNzlOg",
			name: "https://unsplash.com/@jansenderek"

		},
		{
			url: "https://unsplash.com/photos/qk3x9BDXG4Y",
			name: "https://unsplash.com/@gecko81de"

		},
		{
			url: "https://unsplash.com/photos/_hpk_92Crhs",
			name: "https://unsplash.com/@brady_bellini"
		}
	]

	browser.storage.local.get().then(updateCategories, null);

	function updateCategories(data) {
		if (data.randomImages) {
			//console.log("getting random image...");
			getRandomImage();
		} else {
			var userCategories = [];
			// pick a random category and get image for it
			$.each(data.categories, function(category) {
				//console.log("pushing", category);
				if (data.categories[category]) {
					userCategories.push(category);
				}
			});
			userCategories = userCategories.length > 0 ? userCategories : CATEGORIES;
			//console.log(userCategories);
			var r = parseInt(Math.random() * userCategories.length);
			var category = userCategories[r];
			//console.log("gettings image for category", category);
			getImageForCategory(category, setImageBackground);
		}
	}

	function getImageForCategory(category,callback) {
		$.ajax({
			type: "GET",
			url: API_CATEGORY_URL,
			data: {
				"query": category,
				"per_page": 50
			},
			beforeSend: function(xhr) {
				/* Authorization header */
				xhr.setRequestHeader("Authorization", "Client-ID " + APP_ID);
			},
			success: function(data) {
				var total = data.total;
				var r = parseInt(Math.random()*data.results.length);
				callback(data.results[r]);
			},
			error: setPlaceholderImage
		});
	}

    function getRandomImage() {
		$.ajax({
	        type: "GET",
	        url: API_RANDOM_URL,
	        beforeSend: function(xhr) {
	            /* Authorization header */
	            xhr.setRequestHeader("Authorization", "Client-ID " + APP_ID);
	        },
	        success: setImageBackground,
	        error: setPlaceholderImage
	    });
	}

	function setPlaceholderImage(data) {
		$('#download-image').hide();
		$('.credits-link').attr("data-href", "");
		$('.credits-link>i.fa').removeClass("fa-camera-retro").addClass("fa-exclamation-triangle");
		$('.credits-link>span').text("No Internet");
		var r = parseInt(Math.random()*3);
		$("#unsplash-logo").attr("data-href", PLACEHOLDERS[r].url);
		r = r+1;
		$('#unsplash').css('background-image', "url(img/ph" + r + ".jpg)");
	}

	function setImageBackground(data) {
		var url = data.urls.raw + IMAGE_PARAMETERS;
		$('<img/>').attr('src', url).on('load', function() {
			$(this).remove();
			$('#unsplash').css('background-image', 'url(' + url + ')');
		});
		if (data.location) {
			var location = "";

			if (data.location.title) {
				location = data.location.title;
			} else if (data.location.city  && data.location.country) {
				location = data.location.city + ", " + data.location.country;
			} else if (data.location.country) {
				location = data.location.country;
			}
			if (location.length > 0)
				$('.credits-location').text(location);
			else
				$('.credits-location').text("Somewhere beautiful...");
		} else {
			$('.credits-location').text("Somewhere beautiful...");
		}
		if (data.user) {
			$('.credits-link>span').text(" " + data.user.name);
		}
		$("#unsplash-logo").attr("data-href", "https://unsplash.com/photos/" + data.id);
		$("#download-image").show();
		$("#download-image").attr("data-src", data.urls.raw);
		$("#download-image").attr("data-file-name", "unsplash_" + data.id + ".jpg");
		$(".credits-link").attr("data-href", "https://unsplash.com/@" + data.user.username);
		$('credits-link>i.fa').removeClass("fa-exclaimation-trainglefa-camera-retro").addClass("fa-camera-retro");
	}

    $("#unsplash-logo").click(function() {
        window.location.href = $(this).attr('data-href');
    });

    $("#download-image").click(function() {
        var link = document.createElement('a');
        link.href = $(this).attr('data-src');
        link.download = $(this).attr('data-file-name');
        document.body.appendChild(link);
        link.click();
    });

	$(".credits-link").click(function() {
		window.location.href = $(this).attr('data-href');
	});

})();
