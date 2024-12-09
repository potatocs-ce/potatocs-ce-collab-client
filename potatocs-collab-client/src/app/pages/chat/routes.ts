import { Route } from "@angular/router";
import { QnaComponent } from "./qna/qna.component";
import { UploadComponent } from "./upload/upload.component";
import { ListComponent } from "./list/list.component";

export const CHAT_ROUTES: Route[] = [

    {
        path: "qna",
        loadComponent: () => QnaComponent,
        // canActivate: [SpaceGuard]
    },
    {
        path: "upload",
        loadComponent: () => UploadComponent,
    },
    {
        path: "list",
        loadComponent: () => ListComponent
    },
    {
        path: "",
        redirectTo: "chat/qna",
        pathMatch: "full",
    },
];
