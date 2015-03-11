// Generated by CoffeeScript 1.8.0
(function() {
  var SlackAdmin, SlackWebhooksDirective, debounce, initSlackPlugin, module, slackInfo;

  this.taigaContribPlugins = this.taigaContribPlugins || [];

  slackInfo = {
    slug: "slack",
    name: "Slack",
    type: "admin",
    module: 'taigaContrib.slack'
  };

  this.taigaContribPlugins.push(slackInfo);

  module = angular.module('taigaContrib.slack', []);

  debounce = function(wait, func) {
    return _.debounce(func, wait, {
      leading: true,
      trailing: false
    });
  };

  initSlackPlugin = function($tgUrls) {
    return $tgUrls.update({
      "slack": "/slack"
    });
  };

  SlackAdmin = (function() {
    SlackAdmin.$inject = ["$rootScope", "$scope", "$tgRepo", "$appTitle", "$tgConfirm", "$tgHttp"];

    function SlackAdmin(rootScope, scope, repo, appTitle, confirm, http) {
      this.rootScope = rootScope;
      this.scope = scope;
      this.repo = repo;
      this.appTitle = appTitle;
      this.confirm = confirm;
      this.http = http;
      this.scope.sectionName = "Slack";
      this.scope.sectionSlug = "slack";
      this.scope.$on("project:loaded", (function(_this) {
        return function() {
          var promise;
          promise = _this.repo.queryMany("slack", {
            project: _this.scope.projectId
          });
          promise.then(function(slackhooks) {
            _this.scope.slackhook = {
              project: _this.scope.projectId
            };
            if (slackhooks.length > 0) {
              _this.scope.slackhook = slackhooks[0];
            }
            return _this.appTitle.set("Slack - " + _this.scope.project.name);
          });
          return promise.then(null, function() {
            return _this.confirm.notify("error");
          });
        };
      })(this));
    }

    SlackAdmin.prototype.testHook = function() {
      var promise;
      promise = this.http.post(this.repo.resolveUrlForModel(this.scope.slackhook) + '/test');
      promise.success((function(_this) {
        return function(_data, _status) {
          return _this.confirm.notify("success");
        };
      })(this));
      return promise.error((function(_this) {
        return function(data, status) {
          return _this.confirm.notify("error");
        };
      })(this));
    };

    return SlackAdmin;

  })();

  module.controller("ContribSlackAdminController", SlackAdmin);

  SlackWebhooksDirective = function($repo, $confirm, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          $loading.start(submitButton);
          if (!$scope.slackhook.id) {
            promise = $repo.create("slack", $scope.slackhook);
            promise.then(function(data) {
              return $scope.slackhook = data;
            });
          } else if ($scope.slackhook.url) {
            promise = $repo.save($scope.slackhook);
            promise.then(function(data) {
              return $scope.slackhook = data;
            });
          } else {
            promise = $repo.remove($scope.slackhook);
            promise.then(function(data) {
              return $scope.slackhook = {
                project: $scope.projectId
              };
            });
          }
          promise.then(function(data) {
            $loading.finish(submitButton);
            return $confirm.notify("success");
          });
          return promise.then(null, function(data) {
            $loading.finish(submitButton);
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $el.on("click", ".submit-button", submit);
    };
    return {
      link: link
    };
  };

  module.directive("contribSlackWebhooks", ["$tgRepo", "$tgConfirm", "$tgLoading", SlackWebhooksDirective]);

  module.run(["$tgUrls", initSlackPlugin]);

  module.run([
    '$templateCache', function($templateCache) {
      return $templateCache.put('contrib/slack', '<div contrib-slack-webhooks="contrib-slack-webhooks" ng-controller="ContribSlackAdminController as ctrl"><header><h1 tg-main-title="tg-main-title"></h1></header><form><label for="url">Slack webhook url</label><div class="contrib-form-wrapper"><fieldset class="contrib-input"><input type="text" name="url" ng-model="slackhook.url" placeholder="Slack webhook url" id="url" data-type="url"/></fieldset><fieldset class="contrib-test"><a href="" title="Test" ng-show="slackhook.id" ng-click="ctrl.testHook()" class="button-gray"><span>Test</span></a></fieldset></div><button type="submit" class="hidden"></button><a href="" title="Save" ng-click="ctrl.updateOrCreateHook(slackhook)" class="button-green submit-button"><span>Save</span></a></form><a href="https://taiga.io/support/slack-integration/" target="_blank" class="help-button"><span class="icon icon-help"></span><span>Do you need help? Check out our support page!</span></a></div>');
    }
  ]);

}).call(this);
