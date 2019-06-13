trigger CheckTacticalActions on Incident__c (before update, before insert) {
    Set<Id> setIncs = new Set<Id>();
    
    for(Incident__c inc: trigger.new) {
        if(inc.Status__c == 'Close') {
            system.debug('Inside first debug');
            setIncs.add(inc.Id);
            
        }
    }
    
    system.debug('inc:::'+setIncs);
    
    Map<Id, List<Action__c>> mapIncToAction = new Map<Id, List<Action__c>>();
    
    List<Action__c> actions = [Select Id, Incident__c,Strategic_Action__c  from Action__c 
                               where Strategic_Action__c = false and Status__c='Open' and Incident__c IN:setIncs];
    
    system.debug('Actions:::'+actions);
    
    for(Action__c ac : actions) {
        if( !mapIncToAction.containsKey(ac.Incident__c)) {
            mapIncToAction.put(ac.Incident__c, new List<Action__c>{ac});
        }
        else {
            mapIncToAction.get(ac.Incident__c).add(ac);
        }
    }
    
    for(Incident__c incd : trigger.new) {
        if(incd.Status__c == 'Close') {
            if(mapIncToAction.containsKey(incd.Id) && mapIncToAction.get(incd.Id).size()>0 ) {
                incd.addError('You cannot close this Incident. There are open Tactical Actions');
            }
        }
    }
}