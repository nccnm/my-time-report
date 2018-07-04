import Vue from "vue";
import PageController from "./PageController";
import { CONTAINER_ID } from "./constant";

if (!PageController.isLoadingData()) {
	PageController.injectContainerElement();

	setTimeout(function() {
		if (PageController.isElementExists("mytime-report-app")) {
			return;
		}

		var app = new Vue({
			el: "#" + CONTAINER_ID,
			template: `
					<div id="mytime-report-app" class="col-xs-6 col-xs-offset-3">
						<div class="panel panel-primary" style="border:1px solid #428bca;">
							<div class="panel-heading">MyTime report</div>
							<div class="panel-body">
								<p v-if="lackOfHours" style="font-weight: bolder; color: #C9652E;margin: 4px">
									Lack of hours in this month: <span style="color:#65B36E">{{ lackOfHours.toFixed(2) }} = {{lackOfHoursInMinutes}}</span>
								</p>
								<p v-if="workedHours" style="font-weight: bolder; color: #C9652E;margin: 4px">
									Total worked hours in this month is:  <span style="color:#65B36E">{{workedHours}}</span>
								</p>
								<p v-if="workedHoursShouldBe" style="font-weight: bolder; color: #C9652E;margin: 4px">
									Total worked hours in this month should be:  <span style="color:#65B36E">{{workedHoursShouldBe}}</span>
								</p>
								<p v-if="endHours" style="font-weight: bolder; color: #C9652E;margin: 4px">
									Today, you should check out at:  <span style="color:#65B36E">{{endHours.getHours()}}h:{{endHours.getMinutes()}}</span>
								</p>
							</div>
						</div>
					</div>
					`,
			data: {
				lackOfHours: 0,
				endHours: undefined,
				workedHours: 0,
				workedHoursShouldBe: 0
			},
			computed: {
				lackOfHoursInMinutes: function() {
					const mins = this.lackOfHours * 60;
					let h = Math.floor(mins / 60);
					let m = mins % 60;

					if (h === 0) {
						return `${m < 10 ? "0" + m.toFixed(0) : m.toFixed(0)} minutes`;
					}

					if (h === 1) {
						return `${"0" + h} hour and ${m.toFixed(0)} minutes`;
					}

					return `${h < 10 ? "0" + h : h} hours and ${m.toFixed(0)} minutes`;
				}
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
}

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
		var endHours = new Date();
		var hoursPerDay = 8;

		if (this.start.getHours() >= 12) {
			hoursPerDay = 4;
		}

		endHours.setTime(this.start.getTime());

		endHours.setHours(endHours.getHours() + 1 + hoursPerDay);
		endHours.setMinutes(endHours.getMinutes() + 30);

		if (endHours.getHours() > 19) {
			endHours.setHours(19);
			endHours.setMinutes(30);

			return endHours;
		}

		if (endHours.getHours() === 19 && endHours.getMinutes() >= 30) {
			endHours.setHours(19);
			endHours.setMinutes(30);

			return endHours;
		}

		return endHours;
	}
}
