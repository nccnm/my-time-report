import Vue from "vue";
import PageController from "./PageController";
import { CONTAINER_ID } from "./constant";

PageController.injectContainerElement();

setTimeout(function() {
	if (PageController.isElementExists("mytime-report-app")) {
		return;
	}

	var app = new Vue({
		el: "#" + CONTAINER_ID,
		template: `	<div>
					<div id="mytime-report-app" class="col-6 col-offset-3">
						<p v-if="workedHours" style="font-weight: bolder; color: #C9652E;text-align: center;margin: 0">
							Total worked hours in this month is: {{workedHours}}
						</p>
						<p v-if="workedHoursShouldBe" style="font-weight: bolder; color: #C9652E;text-align: center;margin: 0">
							Total worked hour in this month is should be: {{workedHoursShouldBe}}
						</p>
						<p v-if="lackOfHours" style="font-weight: bolder; color: #C9652E;text-align: center;margin: 0">
							Lack of hours in this month: {{ lackOfHours.toFixed(2) }}
						</p>
						<p v-if="endHours" style="font-weight: bolder; color: #C9652E;text-align: center;margin: 0">
							Today, you should check out at: {{endHours.getHours()}}:{{endHours.getMinutes()}}
						</p
					</div>
					</div>`,
		data: {
			lackOfHours: 0,
			endHours: undefined,
			workedHours: 0,
			workedHoursShouldBe: 0
		},
		mounted: function() {
			const workingDay = new WorkingDay(PageController.getStartHours());
			var workedHours = PageController.getWorkedHours();
			var workedDays = PageController.getWorkedDays();

			this.workedHours = workedHours;

			this.workedHoursShouldBe = PageController.getWorkedDays() * 8;

			this.lackOfHours = workingDay.calculateLackOfHours(workedHours, workedDays);

			this.endHours = workingDay.getEndHoursShouldBe();
		}
	});
});

class WorkingDay {
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}

	calculateLackOfHours(workedHours, workedDays) {
		var mustHaveHours = workedDays * 8;
		var lackOfHours = mustHaveHours - workedHours;

		return lackOfHours;
	}

	getEndHoursShouldBe() {
		var startHour = new Date();
		startHour.setTime(this.start.getTime());

		startHour.setHours(startHour.getHours() + 1 + 8);
		startHour.setMinutes(startHour.getMinutes() + 30);

		return startHour;
	}
}
