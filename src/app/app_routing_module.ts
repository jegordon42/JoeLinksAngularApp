import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { Home } from '../views/home/home';
import { Lookup } from "src/views/lookup/lookup";
import { CreateLink } from "src/components/create_link/create_link";
import { Links } from "src/components/links/links";
import { About } from "src/components/about/about";

const routes: Routes = [
    {
        path: '', 
        component: Home,
        children:[
            {path: '', component: CreateLink},
            {path: 'links', component: Links},
            {path: 'about', component: About},
        ]
    },
    {path: ':linkName', component: Lookup}
]

@NgModule({
    imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
    exports:[RouterModule]
})
export class AppRoutingModule{
}