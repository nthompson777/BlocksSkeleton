import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'BLOCK NAME HERE';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'home/home', nav: true, title: 'Home' },
      { route: 'link2', name: 'link2', moduleId: 'link2', nav: true, title: '[LINK 2]' },
      { route: 'link3', name: 'link3', moduleId: 'link3', nav: true, title: '[LINK 3]' }
    ]);

    this.router = router;
  }
}