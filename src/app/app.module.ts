import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent, Inventory } from './game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        Inventory
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        Inventory
    ]
})
export class AppModule { }
