import { Injectable, WritableSignal, effect, inject, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ProfilesService {
    private baseUrl = environment.apiUrl;
    private http = inject(HttpClient);

    userProfileInfo: WritableSignal<any | null> = signal<any | null>(null);
    userCompanyInfo: WritableSignal<any | null> = signal<any | null>(null);
    userManagerInfo: WritableSignal<any | null> = signal<any | null>(null);

    constructor() {
        effect(() => {
            console.log(this.userProfileInfo());
            console.log(this.userCompanyInfo());
            console.log(this.userManagerInfo());
        });
    }
    getUserProfile() {
        return this.http.get(this.baseUrl + "/user/profile").pipe(
            tap((res: any) => {
                // console.log('profile Service Result', res);
                if (res.user.profile_img == "") {
                    res.user.profile_img = "/assets/image/person.png";
                }
                if (res.manager != null && res.manager.profile_img == "") {
                    res.manager.profile_img = "/assets/image/person.png";
                }
                this.userProfileInfo.set(res.user);
                this.userCompanyInfo.set(res.company);
                this.userManagerInfo.set(res.manager);
                return (res.result = true);
            })
        );
    }
    changeUserProfile(data) {
        console.log('change user profile')
        return this.http.put(this.baseUrl + "/user/profileChange", data).pipe(
            tap((res: any) => {
                console.log(res)
                this.userProfileInfo.set(res.profileChange);
            })
        )
    }

    changeProfileImage(imgFile: any) {
        const imgData = new FormData();
        imgData.append("profile_img", imgFile);
        return this.http.post(this.baseUrl + "/user/profileImageChange", imgData).pipe(
            tap((res: any) => {
                console.log(res)
                this.userProfileInfo.set(res.user);
            })
        )
    }

    faceDetection(frame) {
        const faceData = {
            frame: frame,
        }
        return this.http.post(this.baseUrl + "/user/faceDetection", faceData)
    }

    faceRecognition(frame) {
        const faceData = {
            frame: frame,
        }
        return this.http.post(this.baseUrl + "/user/faceRecognition", faceData)
    }
}
