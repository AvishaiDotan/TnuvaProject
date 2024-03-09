public with sharing class AccountController {
    
    @AuraEnabled
    public static void PutAccount(String accountId, Map<String, String> fieldUpdates) {
        try {
            System.debug('fieldUpdates: ' + fieldUpdates);
            System.debug('accountId: ' + accountId);
            
            Account[] acc = [SELECT Id, Type, Description, Phone FROM Account WHERE Id = :accountId LIMIT 1];
            if (acc.size() == 0) {
                throw new AuraHandledException('Account not found');
            }


            for (String key : fieldUpdates.keySet()) {
                String value = fieldUpdates.get(key);
                if (key == 'type') {
                    acc[0].Type = value;
                } else if (key == 'description') {
                    acc[0].Description = value;
                } else if (key == 'phone') {
                    acc[0].Phone = value;
                }
            }
            update acc[0];
        } catch (Exception e) {
            System.debug('An error occurred: ' + e.getMessage());
        }
    }
}