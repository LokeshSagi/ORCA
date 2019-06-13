({
	doInit : function(component, event, helper) {
        var navUrl = 'https://lightningdemodev-dev-ed.my.salesforce.com/'+component.get('v.recordId')+'/p?retURL=/'+component.get('v.recordId');
        
        alert('Go to::::'+navUrl);
        
        var nav = $A.get('e.force:navigateToURL');
        nav.setParams({
            "url" : navUrl
        });
        nav.fire();    
            
        $A.get('e.force:closeQuickAction').fire();    
            
	}
})