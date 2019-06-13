({
	doInit : function(component, event, helper) {
		component.set('v.columns', [
            {label: 'Title', fieldName:"Name",  type:"text" },
            {label: 'Status', fieldName:"Status__c", type:"text"},
            {label: 'Due Date', fieldName:"Due_Date__c", type:"date"},
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
    
})