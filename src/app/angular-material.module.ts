import { NgModule } from "@angular/core";
import { 
    MatInputModule, 
    MatCardModule, 
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
} from '@angular/material';

@NgModule({
    //just doing exports does imports implicitly
    exports: [
        MatInputModule, 
        MatCardModule, 
        MatButtonModule, 
        MatToolbarModule, 
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule
    ]
})
export class AngularMaterialModule{ }