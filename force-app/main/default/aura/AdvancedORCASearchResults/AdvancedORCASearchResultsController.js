({
    getSearchResult : function(component, event, helper) {
        component.set('v.data', []); 
        component.set('v.offsetNumber', 0);
        component.set('v.enableInfiniteLoading', true);
        //$A.get('e.force:refreshView').fire();
        var parameters = event.getParam('arguments');
        //alert('Data is set to [] here');
        if(parameters) {
            component.set('v.searchData', parameters); 
            
            //alert('Params are set here. To Helpers');
            
            helper.getTotalRows(component, event, helper);
            
            //alert('Helper1 is done');
            
            helper.getSearchResults(component, event, helper, component.get('v.offsetNumber'));
            component.find("dataTable").set("v.draftValues", null);
            //alert('Helper2 is done. Data size=='+component.get('v.data').length);
        }
    },
    
    /* refreshComponent : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    }, */
    
    doInit : function(component, event, helper) {
        //component.set('v.data', []);
        //alert('length===='+component.get('v.data').length);
        
        var actions = [{label:"Change Status", name:"update_Status"},
                       {label:"Delete", name:"delete"}];        
        component.set('v.columns', [
            {label:"Incident Number", fieldName:"Name", type:"text"},
            {label:"View", type:"button", typeAttributes:{label:"View", name:"view_details", title:"Click here to View Details"}},
            {label:"Title", fieldName:"Title__c", type:"text", editable:true},
            {label:"Date", fieldName:"Incident_Date__c", type:"Date"},
            {label:"Risk Category", fieldName:"Risk_Category__c", type:"text"},
            {label:"Status", fieldName:"Status__c", type:"text"},
            {label:"Ops Risk Region", fieldName:"Ops_Risk_Region__c", type:"text"},
            {label:"Recorder", fieldName:"linkNameRec", type:"url", typeAttributes:{label:{fieldName:"Recorder__c"}, target:"_blank"}},
            {label:"Reviewer", fieldName:"linkNameRev", type:"url", typeAttributes:{label:{fieldName:"Reviewer__c"}, target:"_blank"}},
            {label:"Approver", fieldName:"linkNameApp", type:"url", typeAttributes:{label:{fieldName:"Approver__c"}, target:"_blank"}},
            {type:'action', typeAttributes:{rowActions:actions}}
        ]);
    },
    
    handleRowAction : function(component, event, helper) {
        alert('Handle row action');
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'view_details':
                var navEvent = $A.get("e.force:navigateToSObject");
                if(navEvent) {
                    navEvent.setParams({
                        "recordId" : row.Id,
                        "slideDevName" : "detail"
                    });
                    window.open('/'+event.getParam('row').Id);
                }
                break;
                
            case 'delete':
                alert('Please dont delete me....');
                break;
                
            case 'update_Status':
                /*var appEvent = $A.get('e.c:AdvORCASendRecordId');
                appEvent.setParams({
                    "recordId":row.Id
                });
                alert('Before Firing');
                appEvent.fire();
                alert('After Firing'); */
                var navService = component.find('navService');
                var pageReference = {
                    "type":"standard__component", 
                    "attributes":{"componentName":"c__AdvancedORCAChangeStatus"},
                    "state":{recordId:row.Id}};
                navService.navigate(pageReference);
                //alert('KeyField:::'+row.keyField);
                
                break;
        }
    },
    
    onDownload : function(component, event, helper) {
        //alert('Selected Rows::'+component.get('v.mySelectedRows'));
        var stockData = component.get('v.mySelectedRows');
        
        if(stockData.length == 0) {
            alert('Please select at least one row to export results');
        }
        else {
            var csv = helper.convertArrayOfObjectsToCSV(component,stockData);
            
            if (csv == null){
                return;
            } 
            
            var hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_self'; // 
            hiddenElement.download = 'ExportData.csv';  // CSV file Name* you can change it.[only name not .csv] 
            document.body.appendChild(hiddenElement); // Required for FireFox browser
            hiddenElement.click(); // using click() js function to download csv file
        }
        
    },
    
    updateSelectedText : function(component, event, helper) {
        //component.set('v.selectedIds', component.find('dataTable').get('v.keyField').Id);
        // alert('Selected IDs::'+component.get('v.selectedIds'));
        var selectedRows = event.getParam('selectedRows');
        component.set('v.mySelectedRows', selectedRows);
        
    },
    /*
    onFirst : function(component, event, helper) {
        var page = component.get('v.currentPageNumber');
        component.set('v.currentPageNumber', 1);
        helper.setData(component, event, helper);
    },
    
    onPrev : function(component, event, helper) {
        
        var page = component.get('v.currentPageNumber');
        component.set('v.currentPageNumber', page-1);
        helper.setData(component, event, helper);
    },
    
    onNext : function(component, event, helper) {
        //component.find('dataTable').set('selectedRows', component.get('v.mySelectedRows'));
        var page = component.get('v.currentPageNumber');
        component.set('v.currentPageNumber', page+1);
        helper.setData(component, event, helper);
    },
    
    onLast : function(component, event, helper) {
        var page = component.get('v.currentPageNumber');
        component.set('v.currentPageNumber', component.get('v.totalPages'));
        helper.setData(component, event, helper);
    }, */
    
    loadMoreData : function(component, event, helper) {
        //alert('Success untill here');
        //event.getSource().set("v.isLoading", true);
        component.set('v.isLoading', true);
        component.set('v.loadMoreStatus', 'Loading');
        component.set('v.offsetNumber', component.get('v.data').length);
        //alert('offset::'+component.get('v.offsetNumber'));
        helper.getSearchResults(component, event, helper, component.get('v.offsetNumber'));
    },
    
    onSave : function(component, event, helper) {
       // var editedRecords = component.find('dataTable').get('v.draftValues');
      //  alert('Number of records edited:'+editedRecords.length);
        helper.onEdit(component, event, helper);
        
    },
    
})