trigger LogCreatorTrigger on Case (after update) {
    // System.debug('Triggered');
    // System.debug('UserInfo.getUserName' + ' ' + UserInfo.getUserName());
    // System.debug('UserInfo.getUserId()' + ' ' + UserInfo.getUserId());

   List<Case> oldCases = Trigger.old;
   List<Case> newCases = Trigger.new;
   
   // Assuming both old and new lists are of equal size
   for (Integer i = 0; i < oldCases.size(); i++) {
       Case oldCase = oldCases[i];
       Case newCase = newCases[i];
       
       if (oldCase.Id == newCase.Id) {
            Map<String, Object> oldFieldMap = oldCase.getPopulatedFieldsAsMap();
            Map<String, Object> newFieldMap = newCase.getPopulatedFieldsAsMap();
            for (String fieldName : oldFieldMap.keySet()) {
                Object oldFieldValue = oldFieldMap.get(fieldName);
                Object newFieldValue = newFieldMap.get(fieldName);
                if (oldFieldValue != newFieldValue && fieldName != 'SystemModstamp' && fieldName != 'LastModifiedDate') {
                    CaseLog__c caseLog = new CaseLog__c();
                    caseLog.FieldName__c = fieldName;
                    caseLog.PrevValue__c = String.valueOf(oldFieldValue) ;
                    caseLog.NewValue__c = String.valueOf(newFieldValue);
                    caseLog.UpdatedDate__c = DateTime.now();
                    caseLog.CaseNumber__c = oldCase.CaseNumber;
                    caseLog.UpdatedBy__c = UserInfo.getUserName();
                    insert caseLog;
                    
                    RECORD_CHANGE_CHANNEL__e event = new RECORD_CHANGE_CHANNEL__e()
                    EventBus.publish(event);
                }
            }
       }
   }
}