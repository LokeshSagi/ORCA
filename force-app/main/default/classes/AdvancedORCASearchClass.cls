public class AdvancedORCASearchClass {
    @AuraEnabled
    public static boolean updateRecords(List<Incident__c> editedAccounts) {
        system.debug(editedAccounts);
        try{
            update editedAccounts;
            return true;
        }
        catch(Exception e) {
            system.debug(e.getMessage());
            return false;
        } 
        
    }
    
    @AuraEnabled
    public static List<Incident__c> searchWithInputs(String fromDate, String toDate, List<String> statuses, Integer rowsToDisplay, Integer offsetNumber) {
        List<Incident__c> incidents = new List<Incident__c>();
        List<String> newStatuses = new List<String>();
        if(! statuses.isEmpty() && statuses!=null) {
            for(String str:statuses) {
                newStatuses = str.split(';');
            }
        }
        
        Date fromD;
        Date toD;
        Integer rowsToDisplay1;
        Integer offsetNumber1;
        if(fromDate!=null) {
            fromD = Date.valueOf(fromDate);
        }
        if(toDate!=null) {
            toD = Date.valueOf(toDate);
        }
        if(rowsToDisplay!=null) {
            rowsToDisplay1 = Integer.valueOf(rowsToDisplay);
        }
        if(offsetNumber !=null) {
            offsetNumber1 = Integer.valueOf(offsetNumber);
        }
        
        String quer = 'SELECT Id, Name, Incident_Description__c, Timeline_of_Events__c, Incident_Date__c, Location__c, Book__c, Approver__r.Name,' 
            +'Reviewer__r.Name, Recorder__r.Name, Ops_Risk_Region__c, Operational_Excellence_Contacts__c, Area__c, Key_Impact__c, Risk_Category__c,'
            +'Key_Risk_Short_Title__c, Repeat_Incident__c, Status__c, Title__c FROM Incident__c Where Id != null ';
        
        
        If(fromDate!=null) {
            quer = quer+'and Incident_Date__c>=:fromD';
        }
        
        If(toDate!=null) {
            quer = quer+' and Incident_Date__c<=:toD ';
        }
        
        If(!newStatuses.isEmpty()) {
            quer = quer+' and Status__c IN:newStatuses';
        }
        
        IF(rowsToDisplay!=null) {
            quer = quer+' Limit :rowsToDisplay1';
        }
        IF(offsetNumber!=null) {
            quer = quer+' OFFSET :offsetNumber1';
        }
        
        system.debug('Query==='+quer);
        
        if(fromD==null && toD==null && (newStatuses.isEmpty())) {
            return incidents;
        }
        else {
            incidents = (List<Incident__c>) Database.query(quer);
            return incidents;
        }
        
    }
    
    @AuraEnabled
    public static List<Incident__c> getCountIncidents(String fromDate, String toDate, List<String> statuses) {
        List<Incident__c> incidents = new List<Incident__c>();
        List<String> newStatuses = new List<String>();
        if(! statuses.isEmpty() && statuses!=null) {
            for(String str:statuses) {
                newStatuses = str.split(';');
            }
        }
        
        Date fromD;
        Date toD;
        if(fromDate!=null) {
            fromD = Date.valueOf(fromDate);
        }
        if(toDate!=null) {
            toD = Date.valueOf(toDate);
        }
        
        String quer = 'SELECT Id FROM Incident__c Where Id != null ';
        
        
        If(fromDate!=null) {
            quer = quer+'and Incident_Date__c>=:fromD';
        }
        
        If(toDate!=null) {
            quer = quer+' and Incident_Date__c<=:toD ';
        }
        
        If(!newStatuses.isEmpty()) {
            quer = quer+' and Status__c IN:newStatuses';
        }
        
        
        system.debug('Query==='+quer);
        
        if(fromD==null && toD==null && (newStatuses.isEmpty())) {
            system.debug('No input');
            return incidents;
        }
        else {
            incidents = (List<Incident__c>)Database.query(quer);
            system.debug('Some input');	
            return incidents;
        }
    }
    
    
    
    @AuraEnabled
    public static List<String> statusPicklistValues () {
        List<String> allValues = new List<String>();
        Schema.DescribeFieldResult objDescribe = Incident__c.Status__c.getDescribe();
        //system.debug(objDescribe);
        List<Schema.PicklistEntry> ple = objDescribe.getPicklistValues();
        for(Schema.PicklistEntry p : ple){
            allValues.add(p.getLabel());
        }
        //system.debug('Available Picklists:::::::::'+allValues);	
        return allValues;
    }
    
    @AuraEnabled
    public static String updateStatusField (Id cId, String newStatus) {
        Id rId;
        String st;
        if(cId !=null){
            rId = cId;
        }
        if(newStatus !=null){
            st = newStatus;
        }
        List<Incident__c> getRecord = [Select Id, Status__c from Incident__c where Id =:rId];
        List<Incident__c> returnRecord = new List<Incident__c>();
        
        for(Incident__c inc : getRecord) {
            inc.Status__c = st;
            returnRecord.add(inc);
        }
        
        List<Database.SaveResult> results = Database.update(returnRecord, false);
        Id returnId = results.get(0).getId();
        List<Incident__c> updatedRecord = [Select Id, Status__c from Incident__c where Id =:returnId];
        String returnStatus = updatedRecord[0].Status__c;
        
        return returnStatus;
    }
    
    @AuraEnabled 
    public static Map<String, List<String>> getDependentMap(sObject objDetail, string contrfieldApiName,string depfieldApiName) {
        String controllingField = contrfieldApiName.toLowerCase();
        String dependentField = depfieldApiName.toLowerCase();
        
        Map<String,List<String>> objResults = new Map<String,List<String>>();
        
        Schema.sObjectType objType = objDetail.getSObjectType();
        if (objType==null){
            return objResults;
        }
        
        Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
        
        if (!objFieldMap.containsKey(controllingField) || !objFieldMap.containsKey(dependentField)){
            return objResults;     
        }
        
        Schema.SObjectField theField = objFieldMap.get(dependentField);
        Schema.SObjectField ctrlField = objFieldMap.get(controllingField);
        
        List<Schema.PicklistEntry> contrEntries = ctrlField.getDescribe().getPicklistValues();
        List<PicklistEntryWrapper> depEntries = wrapPicklistEntries(theField.getDescribe().getPicklistValues());
        List<String> controllingValues = new List<String>();
        
        for (Schema.PicklistEntry ple : contrEntries) {
            String label = ple.getLabel();
            objResults.put(label, new List<String>());
            controllingValues.add(label);
        }
        
        for (PicklistEntryWrapper plew : depEntries) {
            String label = plew.label;
            String validForBits = base64ToBits(plew.validFor);
            for (Integer i = 0; i < validForBits.length(); i++) {
                String bit = validForBits.mid(i, 1);
                if (bit == '1') {
                    objResults.get(controllingValues.get(i)).add(label);
                }
            }
        }
        return objResults;
    }
    
    public static String decimalToBinary(Integer val) {
        String bits = '';
        while (val > 0) {
            Integer remainder = Math.mod(val, 2);
            val = Integer.valueOf(Math.floor(val / 2));
            bits = String.valueOf(remainder) + bits;
        }
        return bits;
    }
    
    public static String base64ToBits(String validFor) {
        if (String.isEmpty(validFor)) return '';
        
        String validForBits = '';
        
        for (Integer i = 0; i < validFor.length(); i++) {
            String thisChar = validFor.mid(i, 1);
            Integer val = base64Chars.indexOf(thisChar);
            String bits = decimalToBinary(val).leftPad(6, '0');
            validForBits += bits;
        }
        
        return validForBits;
    }
    
    private static final String base64Chars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
    
    
    private static List<PicklistEntryWrapper> wrapPicklistEntries(List<Schema.PicklistEntry> PLEs) {
        return (List<PicklistEntryWrapper>)
            JSON.deserialize(JSON.serialize(PLEs), List<PicklistEntryWrapper>.class);
    }
    
    public class PicklistEntryWrapper{
        public String active {get;set;}
        public String defaultValue {get;set;}
        public String label {get;set;}
        public String value {get;set;}
        public String validFor {get;set;}
        public PicklistEntryWrapper(){            
        }
        
    }
}