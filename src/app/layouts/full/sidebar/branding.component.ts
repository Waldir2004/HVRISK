import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
        <img
          src="./assets/images/logos/logo.png"
          class="align-middle m-2"
          alt="logo"
           style="width: 200px; height: auto;"
        />
    </div>
  `,
})
export class BrandingComponent {
  constructor() { }
}
