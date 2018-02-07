import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { RedspotService } from './redspot.service';
import { Redspot } from './redspot';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-sidebar',
    templateUrl: './side.component.html',
    styleUrls: ['./side.component.less'],
    providers: [RedspotService]
})
export class SideComponent implements OnInit {
    redspots: Observable<Redspot[]>;
    private searchTerms = new Subject<string>();
    selectedRedspot: Redspot;
    @Output() itemSelected = new EventEmitter<Redspot>();

    constructor(private redspotService: RedspotService, private elementRef: ElementRef) {
    }

    search(term: string) {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.redspots = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => term
                ? this.redspotService.search(term)
                : Observable.of<Redspot[]>([]))
            .catch(error => {
                console.log(error);
                return Observable.of<Redspot[]>([]);
            });
    }

    onSelected(redspot: Redspot) {
        this.selectedRedspot = redspot;
        this.itemSelected.emit(redspot);
    }

    clearInput() {
        this.elementRef.nativeElement.querySelector('input').value = '';
        this.searchTerms.next('');
    }
}
