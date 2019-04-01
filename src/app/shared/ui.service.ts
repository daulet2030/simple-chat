import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIService {
    avaliableChatsLoaded = new Subject<boolean>();
    avaliableVotingsLoaded = new Subject<boolean>();

    constructor(private snackBar: MatSnackBar) { }

    showNotification(message: string, component, duration: number) {
        this.snackBar.open(message, component, { duration: duration});
    }
}
