(function(){

	browser.storage.local.get("showTimeDate").then((data) => {
		if (data.showTimeDate)
			showClocky();
	}, null);

	var greetingFor = function(hours) {
		if(hours > 3 && hours < 12) return "Morning";
		else if(hours >= 12 && hours < 16) return "Afternoon";
		else return "Evening";
	};

	function getIconForTime(time) {
		var h = parseInt(time.format("H"));
		if (h > 19 || h < 8) return "fa-moon-o";
		return "fa-sun-o";
	}

	function showClocky() {
		setInterval(function() {
			var time = moment();
			$("#clocky-timer-hour").text(time.format("hh"));
			$("#clocky-timer-minute").text(time.format("mm"));
			var icon = getIconForTime(time);
			$("#clocky-timer-icon>i.fa").removeClass("fa-sun-o");
			$("#clocky-timer-icon>i.fa").removeClass("fa-moon-o");
			$("#clocky-timer-icon>i.fa").addClass(icon);
			$("#clocky-colon").text(":");
			$("#clocky-timer-date").text(time.format("dddd, MMMM DD"));
		}, 1000);
	}
})();
