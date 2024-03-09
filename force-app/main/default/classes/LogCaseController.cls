public with sharing class LogCaseController {
    @AuraEnabled
    public static List<CaseLog__c> GetAllCaseLogs(String caseNumber) {
        List<CaseLog__c> todos = new List<CaseLog__c>();
        try {
            todos = [SELECT FieldName__c, Id__c, UpdatedDate__c, PrevValue__c, NewValue__c, AccountId__c FROM CaseLog__c WHERE CaseNumber__c = :caseNumber];
        } catch (Exception e) {
            System.debug('An error occurred: ' + e.getMessage());
        }
        return todos;
    }

}