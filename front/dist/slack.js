(function(){var SlackAdmin,SlackWebhooksDirective,debounce,initSlackPlugin,module;debounce=function(wait,func){return _.debounce(func,wait,{leading:!0,trailing:!1})},SlackAdmin=function(){function SlackAdmin(rootScope,scope,repo,appMetaService,confirm,http,projectService){var promise;this.rootScope=rootScope,this.scope=scope,this.repo=repo,this.appMetaService=appMetaService,this.confirm=confirm,this.http=http,this.projectService=projectService,this.scope.sectionName="Slack",this.scope.sectionSlug="slack",this.scope.project=this.projectService.project.toJS(),this.scope.projectId=this.scope.project.id,promise=this.repo.queryMany("slack",{project:this.scope.projectId}),promise.then(function(_this){return function(slackhooks){var description,title;return _this.scope.slackhook={project:_this.scope.projectId,notify_userstory_create:!0,notify_userstory_change:!0,notify_userstory_delete:!0,notify_task_create:!0,notify_task_change:!0,notify_task_delete:!0,notify_issue_create:!0,notify_issue_change:!0,notify_issue_delete:!0,notify_wikipage_create:!0,notify_wikipage_change:!0,notify_wikipage_delete:!0},slackhooks.length>0&&(_this.scope.slackhook=slackhooks[0]),title=_this.scope.sectionName+" - Plugins - "+_this.scope.project.name,description=_this.scope.project.description,_this.appMetaService.setAll(title,description)}}(this)),promise.then(null,function(_this){return function(){return _this.confirm.notify("error")}}(this))}return SlackAdmin.$inject=["$rootScope","$scope","$tgRepo","tgAppMetaService","$tgConfirm","$tgHttp","tgProjectService"],SlackAdmin.prototype.testHook=function(){var promise;return promise=this.http.post(this.repo.resolveUrlForModel(this.scope.slackhook)+"/test"),promise.success(function(_this){return function(_data,_status){return _this.confirm.notify("success")}}(this)),promise.error(function(_this){return function(data,status){return _this.confirm.notify("error")}}(this))},SlackAdmin}(),SlackWebhooksDirective=function($repo,$confirm,$loading,$analytics){var link;return link=function($scope,$el,$attrs){var form,submit,submitButton;return form=$el.find("form").checksley({onlyOneErrorElement:!0}),submit=debounce(2e3,function(_this){return function(event){var currentLoading,promise;if(event.preventDefault(),form.validate())return currentLoading=$loading().target(submitButton).start(),$scope.slackhook.id?$scope.slackhook.url?(promise=$repo.save($scope.slackhook),promise.then(function(data){return $scope.slackhook=data})):(promise=$repo.remove($scope.slackhook),promise.then(function(data){return $scope.slackhook={project:$scope.projectId,notify_userstory_create:!0,notify_userstory_change:!0,notify_userstory_delete:!0,notify_task_create:!0,notify_task_change:!0,notify_task_delete:!0,notify_issue_create:!0,notify_issue_change:!0,notify_issue_delete:!0,notify_wikipage_create:!0,notify_wikipage_change:!0,notify_wikipage_delete:!0}})):(promise=$repo.create("slack",$scope.slackhook),promise.then(function(data){return $analytics.trackEvent("slack","create","Create slack integration",1),$scope.slackhook=data})),promise.then(function(data){return currentLoading.finish(),$confirm.notify("success")}),promise.then(null,function(data){if(currentLoading.finish(),form.setErrors(data),data._error_message)return $confirm.notify("error",data._error_message)})}}(this)),submitButton=$el.find(".submit-button"),$el.on("submit","form",submit),$el.on("click",".submit-button",submit)},{link:link}},module=angular.module("taigaContrib.slack",[]),module.controller("ContribSlackAdminController",SlackAdmin),module.directive("contribSlackWebhooks",["$tgRepo","$tgConfirm","$tgLoading","$tgAnalytics",SlackWebhooksDirective]),initSlackPlugin=function($tgUrls){return $tgUrls.update({slack:"/slack"})},module.run(["$tgUrls",initSlackPlugin])}).call(this),angular.module("templates").run(["$templateCache",function($templateCache){$templateCache.put("/plugins/slack/slack.html",'\n<div contrib-slack-webhooks="contrib-slack-webhooks" ng-controller="ContribSlackAdminController as ctrl">\n  <header>\n    <h1><span class="project-name">{{::project.name}}</span><span class="green">{{::sectionName}}</span></h1>\n  </header>\n  <form>\n    <label for="url">Slack webhook url</label>\n    <div class="contrib-form-wrapper">\n      <fieldset class="contrib-input">\n        <input type="text" name="url" ng-model="slackhook.url" placeholder="Slack webhook url" id="url" data-type="url"/>\n      </fieldset>\n      <fieldset ng-show="slackhook.id" class="contrib-test">\n        <button title="Test" ng-click="ctrl.testHook()" variant="primary" class="btn-small"><span>Test</span></button>\n      </fieldset>\n    </div>\n    <label for="channel">Slack webhook channel</label>\n    <div class="contrib-form-wrapper">\n      <fieldset class="contrib-input">\n        <input type="text" name="channel" ng-model="slackhook.channel" placeholder="#slackchannel" id="channel"/>\n      </fieldset>\n    </div>\n    <fieldset>\n      <h2>Notify Epics</h2>\n      <div class="check-item"><span>Create</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_epic_create"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Change</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_epic_change"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Delete</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_epic_delete"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n    </fieldset>\n    <fieldset>\n      <h2>Notify Epics related user stories</h2>\n      <div class="check-item"><span>Create</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_relateduserstory_create"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Delete</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_relateduserstory_delete"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n    </fieldset>\n    <fieldset>\n      <h2>Notify User Stories</h2>\n      <div class="check-item"><span>Create</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_userstory_create"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Change</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_userstory_change"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Delete</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_userstory_delete"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n    </fieldset>\n    <fieldset>\n      <h2>Notify Tasks</h2>\n      <div class="check-item"><span>Create</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_task_create"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Change</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_task_change"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Delete</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_task_delete"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n    </fieldset>\n    <fieldset>\n      <h2>Notify Issues</h2>\n      <div class="check-item"><span>Create</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_issue_create"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Change</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_issue_change"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Delete</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_issue_delete"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n    </fieldset>\n    <fieldset>\n      <h2>Notify Wiki</h2>\n      <div class="check-item"><span>Create</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_wikipage_create"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Change</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_wikipage_change"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n      <div class="check-item"><span>Delete</span>\n        <div class="check">\n          <input type="checkbox" name="notification" ng-model="slackhook.notify_wikipage_delete"/>\n          <div></div><span translate="COMMON.YES" class="check-text check-yes"></span><span translate="COMMON.NO" class="check-text check-no"></span>\n        </div>\n      </div>\n    </fieldset>\n    <button type="submit" class="hidden"></button><a variant="primary" href="" title="Save" ng-click="ctrl.updateOrCreateHook(slackhook)" class="btn-small submit-button"><span>Save</span></a>\n  </form><a href="https://taigaio.github.io/taiga-doc/dist/integrations-slack.html" target="_blank" class="help-button">\n    <tg-svg svg-icon="icon-question"></tg-svg><span>Do you need help? Check out our support page!</span></a>\n</div>')}]);