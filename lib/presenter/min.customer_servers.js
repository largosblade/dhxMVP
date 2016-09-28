$dhx.ui.mvp.presenters.declare({customer_servers:function(){"strict";var e="customer_servers",o="servers",r={start:function(){$dhx.debug.log(e+":PRESENTER: start from presenter defined by user")},destroy:function(){var o=this;o.view;$dhx.debug.log(e+":PRESENTER: destroy from presenter defined by user")},subscriber:function(r,i){var n=$dhx.ui.mvp.presenters.get(e),t=n.view;if(console.log(e+"Child Presenter Received Message: ",i),i.collection==o)if("create"==i.method){var s=[];t._settings.grid.id.forEach(function(e){s.push(i.model[e])}),console.log(i),t.grid.addRow(i.model.id||i.model._id,s,0)}else if("update"==i.method){if(t._settings.grid.id.forEach(function(e,o){t.grid.cells(i.model.id,t.grid.getColIndexById(e)).setValue(i.model[e])}),t.form_item){setTimeout(function(){n.show_item()},300)}}else"destroy"==i.method&&t.grid.deleteRow(i.model.id);else"providers"==i.collection&&("create"==i.method||"update"==i.method||"destroy"==i.method)},toolbarOnClickHandler:function(o){var r=$dhx.ui.mvp.presenters.get(e);view=r.view,"assign_server"==o?r.mount_form_input_ui(o):"destroy"==o&&(this.disableItem("destroy"),r.delete_item({onSuccess:function(){r.destroy_item()},onFail:function(){view.form.unlock()}}))},form_process:function(){var r,i=$dhx.ui.mvp.presenters.get(e),n=i.view,t=n.form.getFormData(),s=[];if(delete t.close_on_save,n.grid_ips.forEachRow(function(e){var o={};n.grid_ips.forEachCell(e,function(r,i){var t=n.grid_ips.getColumnId(i),s=n.grid_ips.getColIndexById("assigned"),d=n.grid_ips.getColIndexById("number");console.log(t),"assigned"==t&&"1"==n.grid_ips.cells(e,s).getValue()&&(o.number=n.grid_ips.cells(e,d).getValue(),o.id=e,o._id=e)}),s.push(o)}),t.assigned_ips=s,n.form.check()){n.form.lock(),r={};for(var d in t)r[d]=t[d];"update"==n.form.action&&(r.id=n.grid.getSelectedRowId()),r.expiration&&(r.expiration=new Date(r.expiration).getTime()),r.price&&(r.price=+(r.price||0).replace(/,/g,"")),console.log(r),i.model.schema.io[o][n.form.action]({record:r,onSuccess:function(){n.form.isItemChecked("close_on_save")?n.window.close():(n.form.reset(),n.form.unlock())},onFail:function(){n.form.unlock()}})}},formOnButtonClickHandler:function(o){"save"==o?$dhx.ui.mvp.presenters.get(e).form_process():"reset"==o&&view.form.reset()},formOnEnterHandler:function(){$dhx.ui.mvp.presenters.get(e).form_process()},mount_form_input_ui:function(o){var r=$dhx.ui.mvp.presenters.get(e),i=r.view,n=i._window(),t=null,s=null;i.toolbar.disableItem("assign_server"),i.window.setText("Assign Server"),i._form(n,o),i._grid_ips(),t=i.form.getCombo("provider"),s=i.form.getCombo("server"),t.attachEvent("onChange",function(e,o){r.model.schema.io.servers.readAll({filter:function(o){if(o.provider==e)return o},onSuccess:function(e,o,r){i.form.setItemValue("price",""),i.form.setItemValue("expiration",null),i.grid_ips.clearAll(),s.clearAll(),s.setComboText(""),s.setComboValue(""),s.addOption(o.map(function(e){return[e.id,e.name]}))},onFail:function(){}})}),s.attachEvent("onChange",function(e,o){"string"==typeof e&&(e.length<1||(i.form.lock(),r.model.schema.io.servers.read({record:{id:e},onSuccess:function(o){i.form.setFormData({price:$dhx.parseFloat(o.get("price").toString(),2),expiration:new Date(o.get("expiration"))}),r.fill_ips_grid_form_input_ui(e),i.form.unlock()},onFail:function(){i.form.unlock()}})))}),i.form.lock(),r.model.schema.io.providers.readAll({onSuccess:function(e,o,r){t.addOption(o.map(function(e){return[e.id,e.name]})),i.form.unlock(),i.form.setFocusOnFirstActive()},onFail:function(){}})},fill_ips_grid_form_input_ui:function(o){var r=$dhx.ui.mvp.presenters.get(e),i=r.view;i.grid_ips.clearAll(),i.form.lock(),r.model.schema.io.ips.readAll({filter:function(e){if(e.server==o&&"Available"==e.status)return e},onSuccess:function(e,o,n){e.forEach(function(e){r.isIpAssigned({number:e.get("number"),onSuccess:function(o,r,n,t){var s=[];i._settings.grid_ips.id.forEach(function(o){s.push($dhx.strip_tags(e.get(o)))}),s.push(o),i.grid_ips.addRow(e.get("id"),s)},onFail:function(){}})}),i.form.unlock()},onFail:function(){i.form.unlock()}})},isIpAssigned:function(o){var r=$dhx.ui.mvp.presenters.get(e),i=(r.view,o.number||!1),n=o.customerID,t={onSuccess:function(e,r,i){var n=!1;r.length>0,o.onSuccess&&o.onSuccess(n,e,r,i)},onFail:function(){o.onFail&&o.onFail(arguments)}};if(!i)throw"Can not lookup without a number";n&&(t.filter=function(e){if(e.id==n)return e}),r.model.schema.io.customers.readAll(t)},delete_item:function(r){var i=$dhx.ui.mvp.presenters.get(e);view=i.view,i.model.schema.io[o].destroy({record:{id:view.grid.getSelectedRowId()},onSuccess:function(e){r.onSuccess&&r.onSuccess()},onFail:function(){r.onFail&&r.onFail()}})},gridOnRowSelectHandler:function(o){var r=$dhx.ui.mvp.presenters.get(e);view=r.view,r.selected_server=o},fill_grid:function(e){var o=this,r=o.view;r.grid.clearAll(),o.model.schema.io.customers.read({record:{id:$dhx.ui.mvp.views.get("customers").grid.getSelectedRowId()},onSuccess:function(o){console.log(o),r.grid.adjustColumnSize(r.grid.getColIndexById("name")),e&&e()},onFail:function(){}})},fill_grid_input:function(e){var r=this,i=r.view;i.grid.clearAll(),r.model.data[o]().fetch({sort:{index:"provider",order:1},success:function(o,r,n){o.models.forEach(function(e){var o=[];i._settings.grid.id.forEach(function(r){"purchase"==r||"expiration"==r?o.push(new Date(e.get(r))):o.push($dhx.strip_tags(e.get(r)))}),i.grid.addRow(e.get("id"),o)}),i.grid.adjustColumnSize(i.grid.getColIndexById("name")),e&&e()},error:function(e,o,r){}})},selected_server:null,get_selected_provider:function(){return $dhx.ui.mvp.presenters.get("providers").selected_provider},get_selected_server:function(){return $dhx.ui.mvp.presenters.get("servers").selected_server}};return r}()});