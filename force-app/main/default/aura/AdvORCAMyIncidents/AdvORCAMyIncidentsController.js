({
	doInit : function(component, event, helper) {
		component.set('v.columns', [
            {label: 'Title', fieldName:"Title__c",  type:"text" },
            {label: 'Status', fieldName:"Status__c", type:"text"},
            {label: 'Regional Business', fieldName:"Regional_Business__c", type:"text"},
            {label: 'View', type: 'button',variant:'brand', typeAttributes:{label:'View', name:'view', title:'Go to Record'} }
        ]);
        helper.getMyIncidents(component, event, helper);
	},
    
    handleRowAction : function(component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        //alert(row.Id);
        switch (action.name) {
            case 'view':
                var goRec = $A.get('e.force:navigateToSObject');
                goRec.setParams({
                    "recordId" : row.Id,
                    "slideDevName" : "detail"
                });
                goRec.fire();
        }
    },
    
    onMouseMove : function(component, event, helper) {
        var tags = [];
        var tar = event.target;
        var cTar = event.currentTarget;
        
        var obj = component.get('v.data');
        var val
        for(var i in obj) {
            console.log('Value = '+JSON.stringify(obj[i]));
        }
    },
    
    onMouseLeave : function(component, event, helper) {
        
    }
    
})