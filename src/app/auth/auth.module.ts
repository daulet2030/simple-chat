import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, FlexLayoutModule, AngularFireAuthModule ]
})
export class AuthModule {}
