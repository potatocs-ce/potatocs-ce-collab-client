import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { environment } from "../environments/environment";
import { JwtModule } from "@auth0/angular-jwt";
import { MaterialsModule } from "./materials/materials.module";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { CalendarCommonModule, CalendarMonthModule } from "angular-calendar";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { FlatpickrModule } from "angularx-flatpickr";
import { FormsModule } from "@angular/forms";
export function tokenGetter() {
	return localStorage.getItem(environment.tokenName);
}
export const appConfig: ApplicationConfig = {
	providers: [
		importProvidersFrom(
			JwtModule.forRoot({
				config: {
					tokenGetter: tokenGetter,
					allowedDomains: [environment.apiUrl, environment.localhostUrl, environment.domainUrl],
					disallowedRoutes: ["/api/v1/adAuth/signIn", "/api/v1/adAuth/signUp"],
				},
			}),
			MaterialsModule,
			BrowserAnimationsModule,
			CalendarModule.forRoot({
				provide: DateAdapter,
				useFactory: adapterFactory,
			}),
			CalendarCommonModule,
			CalendarMonthModule,
			FormsModule,
			FlatpickrModule.forRoot()
		),
		provideHttpClient(withInterceptorsFromDi()),
		provideRouter(routes),
		provideAnimations(),
		provideAnimationsAsync(),
	],
};
