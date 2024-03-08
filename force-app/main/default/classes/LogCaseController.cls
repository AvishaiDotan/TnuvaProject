public with sharing class LogCaseController {
    @AuraEnabled(cacheable=true)
    public static List<CaseLog__c> GetAllCaseLogs(String id) {
        System.debug('GetAllCaseLogs' + id);
        List<CaseLog__c> todos = new List<CaseLog__c>();
        try {
            todos = [SELECT Id__c, UpdatedDate__c, PrevValue__c, NewValue__c FROM CaseLog__c];
        } catch (Exception e) {
            System.debug('An error occurred: ' + e.getMessage());
        }
        return todos;
    }
}