({
    getSearchResults : function(component, event, helper, offNumber) {
        //alert('Inside Helper');
        //alert('Offset Number::'+offNumber);
        var action1 = component.get('c.searchWithInputs');
        action1.setParams({
            fromDate:component.get('v.searchData').fromDate,
            toDate:component.get('v.searchData').toDate,
            statuses:component.get('v.searchData').selectedStatuses,
            rowsToDisplay:component.get('v.rowsToDisplay'),
            offsetNumber:offNumber
        });        
        action1.setCallback(this, function(response) {
            var state = response.getState();
            
            if(state==='SUCCESS') {
                //alert('Inside For');
                for(var i=0; i<response.getReturnValue().length; i++) {
                    // alert('Inside For');
                    var row = response.getReturnValue()[i];
                    
                    row.linkNameRec = "/"+row.Recorder__c;
                    row.Recorder__c = row.Recorder__r.Name;
                    
                    row.linkNameRev = "/"+row.Reviewer__c;
                    row.Reviewer__c = row.Reviewer__r.Name;
                    
                    row.linkNameApp = "/"+row.Approver__c;
                    row.Approver__c = row.Approver__r.Name;   
                }
                
                if(component.get('v.data').length >= component.get('v.totalRows')) {
                    component.set('v.enableInfiniteLoading', false);
                    component.set('v.loadMoreStatus', 'No more records to load.');
                }
                else {
                    var currentData = component.get('v.data');
                    var newData = currentData.concat(response.getReturnValue());
                    component.set('v.data', newData);
                    component.set('v.loadMoreStatus', '');   
                    //alert('Alert for length++++'+component.get('v.data').length);
                }
                component.set('v.isLoading', false);
                //event.getSource().set("v.isLoading", false);
                
                
                //component.set('v.totalPages', Math.ceil(response.getReturnValue().length/component.get('v.rowsToDisplay')));
                // component.set('v.data', response.getReturnValue());
                // component.set('v.currentPageNumber',1);
                
                if(component.get('v.isButtonEnabled') == false) {
                    component.set('v.isButtonEnabled', true);
                }
                
                
                //  helper.setData(component, event, helper);
            }
        });
        $A.enqueueAction(action1);
       
    },
    
    getTotalRows : function(component, event, helper) {
        var action2 = component.get('c.getCountIncidents');
        action2.setParams({
            fromDate:component.get('v.searchData').fromDate,
            toDate:component.get('v.searchData').toDate,
            statuses:component.get('v.searchData').selectedStatuses
            
        });    
        action2.setCallback(this, function(response) {
            var state = response.getState();
            
            if(state==='SUCCESS') {
                component.set('v.totalRows', response.getReturnValue().length);
            }
        });
        $A.enqueueAction(action2);
    },
    
    
    /* 
    setData : function(component, event, helper) {
        var data = [];
        var pageNumber = component.get('v.currentPageNumber');
        var totalPages = component.get('v.totalPages');
        var rowsToDisplay = component.get('v.rowsToDisplay');
        var allData = component.get('v.allData');
        
        var x = (pageNumber-1)*rowsToDisplay;
        
        for(;x<=(pageNumber)*(rowsToDisplay);x++) {
            if(allData[x]) {
                data.push(allData[x]);
            }
        }
        component.set('v.data', data);
    },
    */
    convertArrayOfObjectsToCSV : function(component, objectRecords) {
        var csvStringResult, counter, keys, columnDivider, lineDivider;
        if(objectRecords == null && !objectRecords.length) {
            return null;
        }
        columnDivider = ',';
        lineDivider = '\n';
        keys = ['Name', 'Title__c', 'Incident_Date__c', 'Risk_Category__c', 'Status__c', 'Ops_Risk_Region__c',
                'Recorder__c', 'Reviewer__c', 'Approver__c'];
        csvStringResult = '';
        csvStringResult += keys.join(columnDivider);
        csvStringResult += lineDivider;
        
        for(var i=0; i<objectRecords.length; i++) {
            counter = 0;
            for(var sTempkey in keys) {
                var skey = keys[sTempkey] ;  
                
                
                if(counter > 0){ 
                    csvStringResult += columnDivider; 
                }   
                
                csvStringResult += '"'+ objectRecords[i][skey]+'"'; 
                
                counter++;
                
            } 
            csvStringResult += lineDivider;
        }
        
        //alert('Returning thing:::'+csvStringResult);
        return csvStringResult; 
    },
    
    onEdit : function(component, event, helper) {
        var editedRecords = component.find("dataTable").get("v.draftValues");
        var totalEditedRecords = editedRecords.length;
        //alert('Stringify:'+JSON.stringify(editedRecords));
        var action = component.get("c.updateRecords");
        //editedRecords.sobjectType='Incident__c';
        action.setParams({
            "editedAccounts" : editedRecords
        });
        
        action.setCallback(this, function(response) {
            //alert('Inside Callback');
            var state = response.getState();
            if(state === 'SUCCESS') {
                
                if(response.getReturnValue() === true) {
                    helper.showToast({
                        "title" : 'Record Update',
                        "type" : "success",
                        "message" : totalEditedRecords + " Records updated"
                    });
                    //alert('After Save');
                    //helper.reloadDataTable();
                 	var evt = component.getEvent('advInlineEvent');
                    if(!evt) {
                        alert('Event is null');
                    }
                    evt.fire();
                }
                else {
                    helper.showToast({
                        "title": "Error!!",
                        "type": "error",
                        "message": "Error in update"
                    });
                }
            }
            
    /*        else if(component.isValid()){
                var errors = action.getError();
                if(errors) {
                    alert('Error:::'+errors[0].message);
                }
            } */
        });
        
        $A.enqueueAction(action);
        
        //alert('After Save');
        
        
    },
    
    showToast : function(params) {
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent) {
            toastEvent.setParams(params);
            toastEvent.fire();
        }
        else{
            alert(params.message);
        }
    },
    
    reloadDataTable : function() {
        var refreshEvent = $A.get("e.force:refreshView");
        if(refreshEvent) {
            refreshEvent.fire();
        }
    },
})