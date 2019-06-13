({
	onSearch : function(component, event, helper) {
        helper.onSearchHelper(component, event, helper);
	},
    
    onRefresh : function(component, event, helper) {
        alert('To refresh the Data Table');
    },
    
    onInlineRefresh : function(component, event, helper) {
        //alert("I'm inside parent");
        helper.onSearchHelper2(component, event, helper);
        //var onRefreshInline = component.find('incSearch');
        //var afterRefresh = onRefreshInline.toRefresh();
    }
})