({
    doInit : function(component, event, helper) {
        //alert('Initializing Search form');
        
        helper.getStatusPickLists(component, event, helper);
        
        var controllingFieldAPI = component.get("v.controllingFieldAPI");
        var dependingFieldAPI = component.get("v.dependingFieldAPI");
        var objDetails = component.get("v.objDetail");
        // call the helper function
        helper.fetchPicklistValues(component,objDetails,controllingFieldAPI, dependingFieldAPI);
        
    },
    
    clickSearch : function(component, event, helper) {
        /* var action = component.get('c.searchWithInputs');
        action.setParams({
            fromDate:component.get('v.fromDate'),
            toDate:component.get('v.toDate')
        });        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS') {
                var body = response.getReturnValue();
                component.set('v.incidentsReturned', response.getReturnValue());               
            }
        });      
        $A.enqueueAction(action);  */
        
        var compEvent = component.getEvent('advSearchFormEvent');
        compEvent.setParams({
            "searchData":{"fromDate":component.get('v.fromDate'),
                          "toDate":component.get('v.toDate'),
                          "selectedStatuses":component.get('v.selectedStatuses')}
        });
        compEvent.fire();
    },
    
    onChange : function(component, event, helper) {
        //alert('Inside on Select Change event');
        //alert(component.find('statuses').get('v.value'));
        component.set('v.selectedStatuses', component.find('statuses').get('v.value'));
        //alert('On Change : Before event'+(component.get('v.selectedStatuses')));
    },
    
    enableStatus : function(component, event, helper) {
        if(! component.get('v.showStatuses')) {
            component.set('v.showStatuses', true);
        }
        else {
            component.set('v.showStatuses', false);
        }
    },
    
    onControllerFieldChange: function(component, event, helper) {     
        var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
        var depnedentFieldMap = component.get("v.depnedentFieldMap");
        
        if (controllerValueKey != '--- None ---') {
            var ListOfDependentFields = depnedentFieldMap[controllerValueKey];
            
            if(ListOfDependentFields.length > 0){
                component.set("v.bDisabledDependentFld" , false);  
                helper.fetchDepValues(component, ListOfDependentFields);    
            }else{
                component.set("v.bDisabledDependentFld" , true); 
                component.set("v.listDependingValues", ['--- None ---']);
            }  
            
        } else {
            component.set("v.listDependingValues", ['--- None ---']);
            component.set("v.bDisabledDependentFld" , true);
        }
    },
})