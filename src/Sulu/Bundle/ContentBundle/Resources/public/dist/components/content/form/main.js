define(["sulucontent/components/content/preview/main"],function(a){"use strict";return{view:!0,layout:{changeNothing:!0},template:"",saved:!0,contentChanged:!1,animateTemplateDropdown:!1,initialize:function(){this.sandbox.emit("husky.toolbar.header.item.enable","template",!1),this.preview=new a,this.dfdListenForChange=this.sandbox.data.deferred(),this.load()},bindCustomEvents:function(){this.sandbox.on("sulu.dropdown.template.item-clicked",function(a){this.animateTemplateDropdown=!0,this.checkRenderTemplate(a)},this),this.sandbox.on("sulu.header.toolbar.save",function(){this.submit()},this)},bindDomEvents:function(){this.startListening=!1,this.getDomElementsForTagName("sulu.rlp",function(a){var b=a.$el.data("element");b&&""!==b.getValue()&&void 0!==b.getValue()&&null!==b.getValue()||(this.startListening=!0)}.bind(this)),this.startListening?this.sandbox.dom.one(this.getDomElementsForTagName("sulu.rlp.part"),"focusout",this.setResourceLocator.bind(this)):this.dfdListenForChange.resolve()},load:function(){this.sandbox.emit("sulu.content.contents.get-data",function(a){this.render(a)}.bind(this))},render:function(a){this.bindCustomEvents(),this.listenForChange(),this.data=a,this.data.template?this.checkRenderTemplate(this.data.template):this.checkRenderTemplate()},checkRenderTemplate:function(a){return"string"==typeof a&&(a={template:a}),a&&this.template===a.template?void this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1):(this.sandbox.emit("sulu.header.toolbar.item.loading","template"),void(""!==this.template&&this.contentChanged?this.showRenderTemplateDialog(a):this.loadFormTemplate(a)))},showRenderTemplateDialog:function(a){this.sandbox.emit("sulu.overlay.show-warning","sulu.overlay.be-careful","content.template.dialog.content",function(){this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1),this.template&&this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template)}.bind(this),function(){this.loadFormTemplate(a)}.bind(this))},loadFormTemplate:function(a){var b,c;a&&(this.template=a.template),this.formId="#content-form-container",this.$container=this.sandbox.dom.createElement('<div id="content-form-container"/>'),this.html(this.$container),this.sandbox.form.getObject(this.formId)&&(b=this.data,this.data=this.sandbox.form.getData(this.formId),b.id&&(this.data.id=b.id),this.data=this.sandbox.util.extend({},b,this.data)),c=this.getTemplateUrl(a),require([c],function(a){this.renderFormTemplate(a)}.bind(this))},renderFormTemplate:function(a){var b=this.initData(),c={translate:this.sandbox.translate,content:b,options:this.options},d=this.sandbox.util.extend({},c),e=this.sandbox.util.template(a,d);this.sandbox.dom.html(this.formId,e),this.setStateDropdown(b),this.propertyConfiguration={},this.createForm(b).then(function(){this.bindDomEvents(),this.changeTemplateDropdownHandler()}.bind(this))},createForm:function(a){var b=this.sandbox.form.create(this.formId),c=this.sandbox.data.deferred();return b.initialized.then(function(){this.createConfiguration(this.formId),this.setFormData(a).then(function(){this.sandbox.start(this.$el,{reset:!0}),this.initSortableBlock(),this.bindFormEvents(),setTimeout(function(){var a=this.sandbox.form.getData(this.formId);this.sandbox.emit("sulu.preview.initialize",a,!0)}.bind(this),10),c.resolve()}.bind(this))}.bind(this)),c.promise()},createConfiguration:function(a){var b=this.sandbox.dom.find("*[data-property]",a);this.sandbox.dom.each(b,function(a,b){var c=this.sandbox.dom.data(b,"property");c.$el=this.sandbox.dom.$(b),this.sandbox.dom.data(b,"property",null),this.sandbox.dom.removeAttr(b,"data-property",null),this.sandbox.util.foreach(c.tags,function(a){this.propertyConfiguration[a.name]?(this.propertyConfiguration[a.name].properties[a.priority]?this.propertyConfiguration[a.name].properties[a.priority].push(c):this.propertyConfiguration[a.name].properties[a.priority]=[c],this.propertyConfiguration[a.name].highestPriority<a.priority&&(this.propertyConfiguration[a.name].highestProperty=c,this.propertyConfiguration[a.name].highestPriority=a.priority),this.propertyConfiguration[a.name].lowestPriority>a.priority&&(this.propertyConfiguration[a.name].lowestProperty=c,this.propertyConfiguration[a.name].lowestPriority=a.priority)):(this.propertyConfiguration[a.name]={properties:{},highestProperty:c,highestPriority:a.priority,lowestProperty:c,lowestPriority:a.priority},this.propertyConfiguration[a.name].properties[a.priority]=[c])}.bind(this))}.bind(this))},initSortableBlock:function(){var a,b=this.sandbox.dom.find(".sortable",this.$el);b&&b.length>0&&(this.sandbox.dom.sortable(b,"destroy"),a=this.sandbox.dom.sortable(b,{handle:".move",forcePlaceholderSize:!0}),this.sandbox.dom.unbind(a,"sortupdate"),a.bind("sortupdate",function(a){var b=this.sandbox.form.getData(this.formId),c=this.sandbox.dom.data(a.currentTarget,"mapperProperty");this.sandbox.emit("sulu.preview.update-property",c,b[c])}.bind(this)))},bindFormEvents:function(){this.sandbox.dom.on(this.formId,"form-remove",function(a,b){var c=this.sandbox.form.getData(this.formId);this.initSortableBlock(),this.sandbox.emit("sulu.preview.update-property",b,c[b]),this.setHeaderBar(!1)}.bind(this)),this.sandbox.dom.on(this.formId,"form-add",function(a,b,c,d){this.createConfiguration(a.currentTarget);var e,f=this.sandbox.dom.children(this.$find('[data-mapper-property="'+b+'"]')),g=void 0!==d&&f.length>d?f[d]:this.sandbox.dom.last(f);this.sandbox.start(g);try{e=this.sandbox.form.getData(this.formId),this.sandbox.emit("sulu.preview.update-property",b,e[b])}catch(h){}this.initSortableBlock()}.bind(this))},setFormData:function(a){var b=this.sandbox.form.setData(this.formId,a),c="title";return this.getDomElementsForTagName("sulu.node.name",function(a){c=a.name}.bind(this)),!a.id||""!==a[c]&&"undefined"!=typeof a[c]&&null!==a[c]||this.sandbox.util.load("/admin/api/nodes/"+a.id+"?webspace="+this.options.webspace+"&language="+this.options.language+"&complete=false&ghost-content=true").then(function(a){a.type&&this.sandbox.dom.attr("#title","placeholder",a.type.value+": "+a[c])}.bind(this)),"index"===this.options.id&&this.sandbox.dom.remove("#show-in-navigation-container"),this.sandbox.dom.attr("#show-in-navigation","checked",a.navigation),b},getDomElementsForTagName:function(a,b){var c,d=$();if(this.propertyConfiguration.hasOwnProperty(a))for(c in this.propertyConfiguration[a].properties)this.propertyConfiguration[a].properties.hasOwnProperty(c)&&this.sandbox.util.foreach(this.propertyConfiguration[a].properties[c],function(a){$.merge(d,a.$el),b&&b(a)});return d},getTemplateUrl:function(a){var b="text!/admin/content/template/form";return b+=a?"/"+a.template+".html":".html",b+="?webspace="+this.options.webspace+"&language="+this.options.language},setHeaderBar:function(a){this.sandbox.emit("sulu.content.contents.set-header-bar",a),this.saved=a,this.saved&&(this.contentChanged=!1)},setStateDropdown:function(a){this.sandbox.emit("sulu.content.contents.set-state",a)},initData:function(){return this.data},setResourceLocator:function(){if("pending"===this.dfdListenForChange.state()){var a={},b=!0;this.getDomElementsForTagName("sulu.rlp.part",function(c){var d=c.$el.data("element").getValue();""!==d?a[this.preview.getSequence(c.$el,this.sandbox)]=d:b=!1}.bind(this)),b?(this.startListening=!0,this.sandbox.emit("sulu.content.contents.get-rl",a,function(a){this.getDomElementsForTagName("sulu.rlp",function(b){var c=b.$el.data("element");(""===c.getValue()||void 0===c.getValue()||null===c.getValue())&&c.setValue(a)}.bind(this)),this.dfdListenForChange.resolve(),this.setHeaderBar(!1),this.contentChanged=!0}.bind(this))):this.sandbox.dom.one(this.getDomElementsForTagName("sulu.rlp.part"),"focusout",this.setResourceLocator.bind(this))}},listenForChange:function(){this.dfdListenForChange.then(function(){this.sandbox.dom.on(this.$el,"keyup change",function(){this.setHeaderBar(!1),this.contentChanged=!0}.bind(this),".trigger-save-button")}.bind(this)),this.sandbox.on("sulu.content.changed",function(){this.setHeaderBar(!1),this.contentChanged=!0}.bind(this))},changeTemplateDropdownHandler:function(){this.template&&this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template),this.sandbox.emit("sulu.header.toolbar.item.enable","template",this.animateTemplateDropdown),this.animateTemplateDropdown=!1},submit:function(){this.sandbox.logger.log("save Model");var a;this.sandbox.form.validate(this.formId)&&(a=this.sandbox.form.getData(this.formId),"index"===this.options.id?a.navigation=!0:this.sandbox.dom.find("#show-in-navigation",this.$el).length&&(a.navigation=this.sandbox.dom.prop("#show-in-navigation","checked")),this.sandbox.logger.log("data",a),this.options.data=this.sandbox.util.extend(!0,{},this.options.data,a),this.sandbox.emit("sulu.content.contents.save",a))}}});