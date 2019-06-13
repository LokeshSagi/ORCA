({
	onNewIncident : function(component, event, helper) {
        var newInc = $A.get('e.force:createRecord');
        newInc.setParams({
            "entityApiName" : "Incident__c"
        });
        newInc.fire();
	},
    
    onSearch : function(component, event, helper) {
        var navServ = component.find('navigateSearch');
        var pageReference = {
            "type" : "standard__component",
            "attributes" : {
                "componentName" : "c__AdvancedORCA"
            },
            "state" : {}
        };
        
        navServ.navigate(pageReference);
    }
})