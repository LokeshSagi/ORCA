({
    doInit : function(component, event, helper) {
        //alert('Just Checking');
        var action = component.get('c.nextStatus');
        action.setParams({
            cid:component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS') {
                component.set('v.nextStatus',response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        
    },
    
    onNextClick : function(component, event, helper) {
        var action = component.get('c.changeStatus');
        action.setParams({
            cid : component.get('v.recordId'),
            status : component.get('v.nextStatus')
        });
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS') {
                if(response.getReturnValue() === 'Changed') {
                    var showT = $A.get('e.force:showToast');
                    showT.setParams({
                        
                        'message' : 'Status changed successfully',
                        'type': 'success'
                    });
                    showT.fire();
                    $A.get('e.force:refreshView').fire();
                }            
            }
            else if(response.getState() === 'ERROR') {
                var toastParams = {
                    title : 'Info', 
                    type : 'info',
                    message : 'Unknown Error'
                }
                
                var errors = response.getError();
                
                if(errors && errors.length >0) {
                    if(errors[0].message == `Update failed. First exception on row 0 with id ${component.get('v.recordId')}; first error: FIELD_CUSTOM_VALIDATION_EXCEPTION, You cannot close this Incident. There are open Tactical Actions: []`) {
                        toastParams.message = $A.get("$Label.c.Error_On_Close");
                    }
                    else {
                        toastParams.message = errors[0].message;
                    }
                }
                
                var showT = $A.get('e.force:showToast');
                showT.setParams(toastParams);
                showT.fire(); 
            }
        });
        $A.enqueueAction(action);
        
        $A.get("e.force:closeQuickAction").fire();
    },
    
    onDraftClick : function(component, event, helper) {
        var action = component.get('c.changeStatus');
        action.setParams({
            cid : component.get('v.recordId'),
            status : 'Draft'
        });
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS') {
                if(response.getReturnValue() === 'Changed') {
                    var showT = $A.get('e.force:showToast');
                    showT.setParams({
                        
                        'message' : 'Status changed successfully',
                        'type': 'success'
                    });
                    showT.fire();
                } 
                $A.get('e.force:refreshView').fire();          
            }
        });
        $A.enqueueAction(action);
        
        $A.get("e.force:closeQuickAction").fire();        
    }
})