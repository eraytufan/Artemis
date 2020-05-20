import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ParticipationService } from 'app/exercises/shared/participation/participation.service';
import { ParticipationWebsocketService } from 'app/overview/participation-websocket.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { Course } from 'app/entities/course.model';
import { WindowRef } from 'app/core/websocket/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { ProgrammingExercise } from 'app/entities/programming-exercise.model';
import { StudentParticipation } from 'app/entities/participation/student-participation.model';
import { QuizExercise } from 'app/entities/quiz/quiz-exercise.model';
import { Exercise, ExerciseCategory, ExerciseType, getIcon, getIconTooltip, ParticipationStatus } from 'app/entities/exercise.model';
import { ExerciseService } from 'app/exercises/shared/exercise/exercise.service';
import { participationStatus } from 'app/exercises/shared/exercise/exercise-utils';

@Component({
    selector: 'jhi-course-exercise-row',
    templateUrl: './course-exercise-row.component.html',
    styleUrls: ['./course-exercise-row.scss'],
})
export class CourseExerciseRowComponent implements OnInit, OnDestroy {
    readonly QUIZ = ExerciseType.QUIZ;
    readonly PROGRAMMING = ExerciseType.PROGRAMMING;
    readonly MODELING = ExerciseType.MODELING;
    readonly TEXT = ExerciseType.TEXT;
    readonly FILE_UPLOAD = ExerciseType.FILE_UPLOAD;
    @HostBinding('class') classes = 'exercise-row';
    @Input() exercise: Exercise;
    @Input() course: Course;
    @Input() extendedLink = false;
    @Input() hasGuidedTour: boolean;

    getIcon = getIcon;
    getIconTooltip = getIconTooltip;
    public exerciseCategories: ExerciseCategory[];
    isAfterAssessmentDueDate: boolean;

    participationUpdateListener: Subscription;

    constructor(
        private accountService: AccountService,
        private $window: WindowRef,
        private participationService: ParticipationService,
        private exerciseService: ExerciseService,
        private httpClient: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private participationWebsocketService: ParticipationWebsocketService,
    ) {}

    /**
     * On init, subscribe for participation changes, fetch all student participation, participation status,
     * exercise assessment due date, exercise type and categories for the exercise
     */
    ngOnInit() {
        const cachedParticipation = this.participationWebsocketService.getParticipationForExercise(this.exercise.id);
        if (cachedParticipation) {
            this.exercise.studentParticipations = [cachedParticipation];
        }
        this.participationUpdateListener = this.participationWebsocketService.subscribeForParticipationChanges().subscribe((changedParticipation: StudentParticipation) => {
            if (changedParticipation && this.exercise && changedParticipation.exercise.id === this.exercise.id) {
                this.exercise.studentParticipations =
                    this.exercise.studentParticipations && this.exercise.studentParticipations.length > 0
                        ? this.exercise.studentParticipations.map((el) => {
                              return el.id === changedParticipation.id ? changedParticipation : el;
                          })
                        : [changedParticipation];
                this.exercise.participationStatus = participationStatus(this.exercise);
            }
        });
        this.exercise.participationStatus = participationStatus(this.exercise);
        if (this.exercise.studentParticipations && this.exercise.studentParticipations.length > 0) {
            this.exercise.studentParticipations[0].exercise = this.exercise;
        }
        this.exercise.isAtLeastTutor = this.accountService.isAtLeastTutorInCourse(this.course);
        this.exercise.isAtLeastInstructor = this.accountService.isAtLeastInstructorInCourse(this.course);
        this.isAfterAssessmentDueDate = !this.exercise.assessmentDueDate || moment().isAfter(this.exercise.assessmentDueDate);
        if (this.exercise.type === ExerciseType.QUIZ) {
            const quizExercise = this.exercise as QuizExercise;
            quizExercise.isActiveQuiz = this.exerciseService.isActiveQuiz(this.exercise);

            quizExercise.isPracticeModeAvailable = quizExercise.isPlannedToStart && quizExercise.isOpenForPractice && moment(this.exercise.dueDate!).isBefore(moment());
            this.exercise = quizExercise;
        }
        this.exerciseCategories = this.exerciseService.convertExerciseCategoriesFromServer(this.exercise);
    }

    /**
     * On destroy, unsubscribe from observable
     */
    ngOnDestroy() {
        if (this.participationUpdateListener) {
            this.participationUpdateListener.unsubscribe();
        }
    }

    /**
     * Check if remaining days for the class less than a week if so return danger
     * @param date - current date
     */
    getUrgentClass(date: Moment | null): string | null {
        if (!date) {
            return null;
        }
        const remainingDays = date.diff(moment(), 'days');
        if (0 <= remainingDays && remainingDays < 7) {
            return 'text-danger';
        } else {
            return null;
        }
    }

    /**
     * Cast an exercise to Programming exercise and return it
     * @param exercise - exercise to be casted
     */
    asProgrammingExercise(exercise: Exercise): ProgrammingExercise {
        return exercise as ProgrammingExercise;
    }

    /**
     * Cast an exercise to Quiz exercise and return it
     * @param exercise - exercise to be casted
     */
    asQuizExercise(exercise: Exercise): QuizExercise {
        return exercise as QuizExercise;
    }

    /**
     * Navigates to the exercise details page if the click event is not on 'student actions' or 'results' targets
     * @param event - click event
     */
    showDetails(event: any) {
        const isClickOnAction = event.target.closest('jhi-exercise-details-student-actions') && event.target.closest('.btn');
        const isClickResult = event.target.closest('jhi-result') && event.target.closest('.result');
        if (!isClickOnAction && !isClickResult) {
            if (this.extendedLink) {
                this.router.navigate(['courses', this.course.id, 'exercises', this.exercise.id]);
            } else {
                this.router.navigate([this.exercise.id], { relativeTo: this.route });
            }
        }
    }
}
