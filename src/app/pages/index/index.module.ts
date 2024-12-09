import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IndexComponent } from "./index.component";
import { AosComponent } from "aos"; // AosComponent를 불러옵니다.
import { SwiperModule } from "swiper/angular";

@NgModule({
	exports: [CommonModule, SwiperModule],
})
export class IndexModule {}
