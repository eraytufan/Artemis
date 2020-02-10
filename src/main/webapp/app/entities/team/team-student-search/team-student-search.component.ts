import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Course } from 'app/entities/course';
import { Observable, of } from 'rxjs';
import { User } from 'app/core/user/user.model';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, catchError } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';
import { Exercise } from 'app/entities/exercise';
import { get } from 'lodash';

@Component({
    selector: 'jhi-team-student-search',
    templateUrl: './team-student-search.component.html',
})
export class TeamStudentSearchComponent {
    @ViewChild('ngbTypeahead', { static: false }) ngbTypeahead: ElementRef;

    @Input() course: Course;
    @Input() exercise: Exercise;

    @Output() selectStudent = new EventEmitter<User>();
    @Output() searching = new EventEmitter<boolean>();
    @Output() searchFailed = new EventEmitter<boolean>();

    users: User[] = [];

    inputDisplayValue: string;

    constructor(private userService: UserService) {}

    onAutocompleteSelect = (student: User) => {
        this.inputDisplayValue = '';
        this.selectStudent.emit(student);
    };

    searchInputFormatter = () => {
        return this.inputDisplayValue;
    };

    searchResultFormatter = (student: User) => {
        const { login, name } = student;
        return `${login} (${name})`;
    };

    onSearch = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => this.searchFailed.emit(false)),
            tap(() => this.searching.emit(true)),
            switchMap(loginOrName => {
                if (loginOrName.length < 3) {
                    return of([]);
                }
                return this.userService
                    .searchInCourseForExerciseTeam(this.course, this.exercise, loginOrName)
                    .pipe(map(usersResponse => usersResponse.body!))
                    .pipe(
                        catchError(() => {
                            this.searchFailed.emit(true);
                            return of([]);
                        }),
                    );
            }),
            tap(users => {
                setTimeout(() => {
                    for (let i = 0; i < this.typeaheadButtons.length; i++) {
                        if (users[i].assignedToTeam) {
                            this.typeaheadButtons[i].setAttribute('disabled', '');
                        }
                    }
                });
            }),
            tap(() => this.searching.emit(false)),
        );
    };

    private get typeaheadButtons() {
        return get(this.ngbTypeahead, 'nativeElement.nextSibling.children', []);
    }
}
