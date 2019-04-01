import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
     MatDatepickerModule, MatNativeDateModule,
      MatCheckboxModule,
      MatSidenavModule,
      MatToolbarModule,
      MatListModule,
      MatTabsModule,
      MatCardModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      MatDialogModule,
      MatTableModule,
      MatSortModule,
      MatPaginatorModule,
      MatSnackBarModule} from '@angular/material';
@NgModule({
    imports: [
        MatCheckboxModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
    MatSidenavModule,
MatToolbarModule, MatListModule, MatTabsModule,
MatCardModule,
MatSelectModule, MatProgressSpinnerModule, MatDialogModule,
MatTableModule, MatSortModule, MatPaginatorModule,
MatSnackBarModule],
    exports: [
        MatCheckboxModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSidenavModule,
        MatToolbarModule, MatListModule, MatTabsModule,
        MatCardModule,
        MatSelectModule, MatProgressSpinnerModule, MatDialogModule,
        MatTableModule, MatSortModule, MatPaginatorModule,
        MatSnackBarModule]
})
export class MaterialModule {

}
