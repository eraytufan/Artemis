import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ActivateService } from './activate.service';
import { ProfileService } from 'app/shared/layouts/profiles/profile.service';
import { flatMap } from 'rxjs/operators';

@Component({
    selector: 'jhi-activate',
    templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
    error = false;
    success = false;
    isRegistrationEnabled = false;

    constructor(private activateService: ActivateService, private route: ActivatedRoute, private profileService: ProfileService) {}

    /**
     * Checks if the user can be activated with ActivateService
     */
    ngOnInit() {
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            if (profileInfo) {
                this.isRegistrationEnabled = profileInfo.registrationEnabled || false;
                if (this.isRegistrationEnabled) {
                    // only try to activate an account if the registration is enabled
                    this.activateAccount();
                }
            }
        });
    }

    activateAccount() {
        this.route.queryParams.pipe(flatMap((params) => this.activateService.get(params.key))).subscribe(
            () => (this.success = true),
            () => (this.error = true),
        );
    }
}
