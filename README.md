# angular-ts
AngularJS 1.x in the TypeScript Way! Get a real Angular2 feel with Decorators and type-based Dependency Injection!

## Introduction

After some time spent trying to make my AngularJS 1.x projects as clean as possible, I decided to take advantage of the great readability of TypeScript language and enrich it with a feature that is so familiar to Spring (and other Java frameworks) developers: type-based dependency injection. If you have a little of Spring programming experience you should feel familiar with the following code:

```
@Service
public class MyClass {
  
  @Autowired
  public MyClass(MyRepository repo) {
    ...
  }
  
}
```

Now, with this test project (I have plan for a standalone library) you can write almost the same thing in Typescript (and there's no need for @Autowire the constructor):

```
@Service()
export class UserService {

  private $q: ng.IQService;
  private $timeout: ng.ITimeoutService;

  constructor($q: ng.IQService, $timeout: ng.ITimeoutService) {
      this.$q = $q;
      this.$timeout = $timeout;
  }
  
  ...
}
  
```

To make this possible, I had to build a custom version of the TypeScript compiler that is able to emit Interface metadata:

```
UserService = __decorate([
            decorators_1.Service(), 
            __metadata('design:paramtypes', [{"__i":"IQService"}, {"__i":"ITimeoutService"}]), 
            __metadata('design:typename', 'UserService')
        ], UserService);
```

This is still work in progress, it's not intended for production environments, but there will be a lot of possibilities if the TypeScript team will make the Emitter customizable in this way. I know that string-based interface metadata does not cover a lot of scenarios, but this is only the beginning :)

## Build Notes

Clone this repo, then `npm install` and `grunt`. If everything goes fine, you should have a `dist` directory which contains the built project. Now launch `grunt http-server` and you should be able to connect to [http://localhost:8000](http://localhost:8000).

## License

This application is distributed under the MIT License. See the LICENSE.txt file.
