import { CONTAINER_ID } from "./constant";

class PageController {
	constructor() {}

	static isElementExists(id) {
		var container = document.getElementById(id || CONTAINER_ID);

		if (container) return true;

		return false;
	}

	static isLoadingData() {
		return !!document.querySelector(".blockUI");
	}

	static injectContainerElement() {
		if (this.isElementExists()) return;

		// just place a div at top right
		var div = document.createElement("div");
		div.id = CONTAINER_ID;
		div.className = "row";
		div.setAttribute("style", "margin-bottom: 5px; text-align: center;");

		var parent = document.getElementById("workingtime");
		parent.insertBefore(div, parent.childNodes[2]);

		return true;
	}

	static getWorkedHours() {
		var strongElements = document.querySelectorAll("#table-block strong");

		return parseFloat(strongElements[0].innerText.replace("Total worked hour is: ", ""));
	}

	static getWorkedDays() {
		var strongElements = document.querySelectorAll("#table-block strong");

		return parseFloat(strongElements[1].innerText.replace("Total worked day is: ", ""));
	}

	static getStartHours() {
		var startHourElement = document.querySelector(".timeline-from");
		var today = new Date();

		if (startHourElement) {
			var hourAndMinute = startHourElement.innerText.split(":");
			var hour = parseInt(hourAndMinute[0]);
			var minute = parseInt(hourAndMinute[1]);

			today.setHours(hour);
			today.setMinutes(minute);
			today.setSeconds(0);

			return today;
		}

		return undefined;
	}
}

export default PageController;
