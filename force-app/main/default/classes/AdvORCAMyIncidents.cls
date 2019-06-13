public with sharing class AdvORCAMyIncidents {
    @AuraEnabled
    public static List<Incident__c> getIncidents() {
        List<Incident__c> incs = [Select Id, Status__c, Title__c, Regional_Business__c from Incident__c];
        return incs;
    }
    
    @AuraEnabled
    public static List<Action__c> getActions() {
        List<Action__c> acs = [SELECT Id, Due_Date__c, Status__c, Name FROM Action__c];
        return acs;
    }
}