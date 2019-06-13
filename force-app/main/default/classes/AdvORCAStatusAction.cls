public class AdvORCAStatusAction {
    @AuraEnabled
    public static String nextStatus(Id cid) {
        try{
            String returnStatus;
            system.debug('Record Id:::'+cid);
            List<String> allValues = new List<String>();
            
            Schema.DescribeFieldResult fieldResult = Incident__c.Status__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPickListValues();
            for(Schema.PicklistEntry p : ple) {
                allValues.add(p.getLabel());
            }
            
            If(cid!=null) {
                List<Incident__c> retInc = [Select Id, Status__c from Incident__c where Id =:cid];
                if(retInc[0].Status__c != 'Close') {
                    for(Integer i=0; i<allValues.size(); i++) {
                        if(retInc[0].Status__c == allValues[i]){
                            returnStatus = allValues[i+1];
                            break;
                        }
                    }
                }
            }
            system.debug('Next Status=='+returnStatus);
            
            return returnStatus ;
        }
        catch (Exception e) {
            
            throw new AuraHandledException('Something went wrong:'+e.getMessage());
        }
        
    }
    
    
    @AuraEnabled
    public static String changeStatus (Id cid, String status) {
        try{
            String retString;
            if(cid!=null && status!=null) {
                system.debug('Values coming::'+cid+status);
                Incident__c inc = [Select Id, Status__c from Incident__c where id =:cid];
                
                if(inc.Id != null) {
                    inc.Status__c = status;
                }
                Database.SaveResult sav = Database.update(inc);
                
                if(sav.isSuccess()) {
                    retString = 'Changed';
                }
            }
            
            return retString;
        }
        
        catch(Exception e) {
            //system.debug('e = '+e.);
            system.debug('Error::::::::'+e.getMessage());
            //system.debug('Error Details:::::::'+e.getTypeName());
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}