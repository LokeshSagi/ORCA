({
	getMyIncidents : function(component, event, helper) {
		var action = component.get('c.getIncidents');
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS') {
                component.set('v.data', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	}
})