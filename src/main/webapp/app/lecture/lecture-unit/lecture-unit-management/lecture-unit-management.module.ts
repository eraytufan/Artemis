import { ArtemisSharedModule } from 'app/shared/shared.module';
import { ArtemisSharedComponentModule } from 'app/shared/components/shared-component.module';
import { LectureUnitManagementComponent } from 'app/lecture/lecture-unit/lecture-unit-management/lecture-unit-management.component';
import { NgModule } from '@angular/core';
import { lectureUnitRoute } from 'app/lecture/lecture-unit/lecture-unit-management/lecture-unit-management.route';
import { RouterModule } from '@angular/router';
import { UnitCreationCardComponent } from './unit-creation-card/unit-creation-card.component';
import { CreateExerciseUnitComponent } from './create-exercise-unit/create-exercise-unit.component';
import { ArtemisCoursesModule } from 'app/overview/courses.module';
import { CreateAttachmentUnitComponent } from './create-attachment-unit/create-attachment-unit.component';

const ENTITY_STATES = [...lectureUnitRoute];

@NgModule({
    imports: [ArtemisSharedModule, ArtemisSharedComponentModule, RouterModule.forChild(ENTITY_STATES), ArtemisCoursesModule],
    declarations: [LectureUnitManagementComponent, UnitCreationCardComponent, CreateExerciseUnitComponent, CreateAttachmentUnitComponent],
})
export class ArtemisLectureUnitManagementModule {}
