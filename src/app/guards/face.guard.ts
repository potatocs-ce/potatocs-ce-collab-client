import { inject, WritableSignal } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, UrlTree } from "@angular/router";
import { DialogService } from "../stores/dialog/dialog.service";
import { AuthService } from "../services/auth/auth.service";
import { SideNavService } from "../stores/side-nav/side-nav.service";
import { FaceRecognitionDialogComponent } from "../components/dialogs/face-recognition-dialog/face-recognition-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { MemberDataStorageService } from "../stores/member-data-storage/member-data-storage.service";
import { ProfilesService } from "../services/profiles/profiles.service";
import { WebcamDeviceService } from "../services/webcam/webcam-device.service";

export const FaceGuard: CanActivateFn = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
    const dialog = inject(MatDialog);
    const router = inject(Router);
    const authService = inject(AuthService);
    const mdsService = inject(MemberDataStorageService);
    const dialogService = inject(DialogService);
    const webcamDevice = inject(WebcamDeviceService)
    const sidenavService = inject(SideNavService);
    const spaces: any = sidenavService.updateSideMenu().toPromise();
    const profilesService = inject(ProfilesService);
    // const userProfileInfo = ProfilesService.getUserProfile();
    const spaceTime = route.params['spaceTime'];
    const userProfileInfo: WritableSignal<any> = profilesService.userProfileInfo;
    // const userProfileInfo: any = profilesService.userProfileInfo;
    // console.log(userProfileInfo)
    // let spaceInfo = spaces.navList[0].spaces;
    // console.log(spaceInfo)

    const userProfile = await userProfileInfo;
    console.log('userProfileInfo : ', userProfile);

    let isWebcamConnected = false   // 웹캠 연결 되어있는지 확인용
    let isFaceRegistration = false  // 프로필에 얼굴 등록을 했는지 확인용
    let flag = false                // space에 얼굴 인식 보안이 걸려있는지 확인용

    const webcamConnected = webcamDevice.isWebcamConnected()
    webcamConnected.then((value: any) => {
        isWebcamConnected = value
    })
    console.log('userProfileInfo : ')
    console.log('userProfileInfo : ', userProfileInfo())

    // 스페이스에 얼굴 보안이 걸려있는지 확인 하고 나서 웹캠 연결 확인
    flag = spaces.then((value: any) => {
        const spaceList = value.navList[0].spaces
        for (let index = 0; index < spaceList.length; index++) {
            const element = spaceList[index]._id;
            if (spaceTime == element) {

                // faceAuthentication 있는지 확인
                const recognition = 'faceAuthentication' in spaceList[index] ? spaceList[index].faceAuthentication : false
                if (recognition) {
                    if (isWebcamConnected) {

                        // 프로필에 얼굴이 등록되어있는지 확인
                        //
                        // 일단 넘어감
                        //
                        //


                        // 얼굴인식 하는 부분
                        const dialogRef: MatDialogRef<FaceRecognitionDialogComponent> = dialog.open(FaceRecognitionDialogComponent, {
                            data: { message: 'Do you want to proceed to this route?' }
                        });

                        // 다이얼로그가 닫힌 후의 결과에 따라 라우팅 허용 여부 결정
                        return dialogRef.afterClosed().toPromise().then(result => {
                            console.log(result)
                            if (result.message === "recognition") {
                                return true; // 라우팅 허용
                            } else {
                                return router.createUrlTree(['/main']); // 라우팅 차단 및 리다이렉트
                            }
                        });
                    }
                    else {
                        dialogService.openDialogNegative('Face recognition security is at stake in this space.\nPlease check your webcam connection')
                        return false
                    }
                }
                else {
                    console.log('else')
                    return true
                }
            }
        }
        return false
    })


    return flag
};