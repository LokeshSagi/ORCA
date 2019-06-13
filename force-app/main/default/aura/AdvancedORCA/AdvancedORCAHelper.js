({
    onSearchHelper : function(component, event, helper) {
        component.set('v.incomingData', event.getParam('searchData'));
        alert('incomingData==='+component.get('v.incomingData'));
        var fD = component.get('v.incomingData').fromDate;
        //var fD = incomingData.fromDate;
        
        var tD = component.get('v.incomingData').toDate;
        //var tD = incomingData.toDate;
        
        var selSt = component.get('v.incomingData').selectedStatuses;
        //var selSt = incomingData.selectedStatuses;
        
    
        //alert('Parent COmp::::'+selSt);
        //alert('Date1::'+fD);
        //alert('Date2::'+tD);
        var incSearching = component.find('incSearch');
        
        var incSearchResults = incSearching.search(fD,tD,selSt);
    },
    
    onSearchHelper2 : function(component, event, helper) {
        alert('incomingData==='+component.get('v.incomingData'));
        var fD = component.get('v.incomingData').fromDate;
        
        var tD = component.get('v.incomingData').toDate;
                
        var selSt = component.get('v.incomingData').selectedStatuses;
        
        var incSearching = component.find('incSearch');
        
        var incSearchResults = incSearching.search(fD,tD,selSt);
    },
    
})