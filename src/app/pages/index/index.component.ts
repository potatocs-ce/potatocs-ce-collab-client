import {
	Component,
	HostListener,
	Renderer2,
	OnInit,
	ElementRef,
	ViewChild,
	ViewChildren,
	QueryList,
} from "@angular/core";
import AOS from "aos"; //AOS - 1
import SwiperCore, { Autoplay, Pagination, Navigation, Mousewheel } from "swiper";
import { SwiperComponent } from "swiper/angular";
import { IndexModule } from "./index.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialsModule } from "../../materials/materials.module";
SwiperCore.use([Autoplay, Pagination, Navigation, Mousewheel]);

@Component({
	selector: "app-index",
	templateUrl: "./index.component.html",
	styleUrls: ["./index.component.scss"],
	standalone: true,
	imports: [IndexModule, CommonModule, RouterModule, MaterialsModule],
})
export class IndexComponent implements OnInit {
	// header
	isHeaderActive: boolean = false;
	prevScrollTop: number = 0;

	// topbutton
	showScrollButton = false;

	// security
	isUlActive: boolean = false;
	prevScroll: number = 0;

	ngOnInit(): void {
		this.initAOS();
	}

	initAOS(): void {
		setTimeout(() => {
			AOS.init({
				duration: 600,
				once: false,

				// 사용자 정의 애니메이션을 위한 옵션 추가
				useClassNames: true,
				initClassName: "aos-init",
				animatedClassName: "aos-animate",
				customClassName: "fade-in-custom", // 사용자 정의 애니메이션 클래스명
			});
		}, 400);
	}

	// 탑버튼
	scrollToTop(): void {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	//시작하기 누르면 이동
	scroll(element: HTMLElement): void {
		// window.scrollTo(element.yPosition);
		element.scrollIntoView({ behavior: "smooth" });
	}

	constructor(private renderer: Renderer2) {}

	onSlideChangeStartVertical(e) {
		console.log("START");
		e[0].params.touchReleaseOnEdges = e[0].params.mousewheel.releaseOnEdges = false;
	}
	onSlideChangeEndVertical(e) {
		console.log("END");
		e[0].params.touchReleaseOnEdges = e[0].params.mousewheel.releaseOnEdges =
			e[0].activeIndex === 0 || e[0].activeIndex === e[0].slides.length - 1;
	}

	@HostListener("window:scroll", ["$event"])
	onScroll(event: Event) {
		const nowScrollTop = window.scrollY || document.documentElement.scrollTop || 0;

		if (nowScrollTop > this.prevScrollTop) {
			this.isHeaderActive = true;
		} else {
			this.isHeaderActive = false;
		}

		this.showScrollButton = nowScrollTop >= 500;

		this.prevScrollTop = nowScrollTop;

		// background-color
		const attendance = document.querySelector(".attendance");
		const header = document.querySelector("header");
		const back = document.querySelector(".back");

		if (attendance) {
			const rect = attendance.getBoundingClientRect();
			const windowHeight = window.innerHeight || document.documentElement.clientHeight;
			const topVisible = rect.top >= 0 && rect.top <= windowHeight;
			const bottomVisible = rect.bottom >= 0 && rect.bottom <= windowHeight;

			if (topVisible || bottomVisible) {
				this.renderer.addClass(document.body, "background-changed");
				this.renderer.addClass(header, "background-changed");
			} else {
				this.renderer.removeClass(document.body, "background-changed");
				this.renderer.removeClass(header, "background-changed");
			}
		}

		if (back) {
			const rect = back.getBoundingClientRect();
			const windowHeight = window.innerHeight || document.documentElement.clientHeight;
			const topVisible = rect.top <= windowHeight;

			if (topVisible) {
				this.renderer.addClass(document.body, "background-changed2");
				this.renderer.addClass(header, "background-changed2");
			} else {
				this.renderer.removeClass(document.body, "background-changed2");
				this.renderer.removeClass(header, "background-changed2");
			}
		}

		this.checkVisibility();
	}

	@ViewChildren("swiperVertical", { read: SwiperComponent }) swiperVertical?: QueryList<SwiperComponent>;
	@ViewChildren("swiperMousewheel") swiperMousewheel: QueryList<ElementRef>;

	checkVisibility() {
		if (!this.swiperVertical || !this.swiperMousewheel) return;

		const screenHeight = window.innerHeight;
		const visibilityThreshold = screenHeight * 1;

		this.swiperVertical.forEach((swiperComponent, index) => {
			const element = this.swiperMousewheel.toArray()[index]?.nativeElement;
			const rect = element?.getBoundingClientRect();

			if (rect && rect.top >= 0 && rect.bottom <= visibilityThreshold) {
				swiperComponent.swiperRef.enable();
			} else {
				swiperComponent.swiperRef.disable();
			}
		});
	}
}
