public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> GetAllNonAssociatedContacts() {
        List<Contact> nonAssociatedContracts = new List<Contact>();
        try {
            nonAssociatedContracts = [
                SELECT Id, Name, Email, MobilePhone
                FROM Contact
                WHERE AccountId = null OR AccountId = ''
                LIMIT 10
            ];
        } catch (Exception e) {
            System.debug('An error occurred: ' + e.getMessage());
        }
        return nonAssociatedContracts;
    }

    @AuraEnabled
    public static void AssociateContactToAccount(String contactId, String accountId) {
        try {
            System.debug('AssociateContactToAccount: contactId=' + contactId + ', accountId=' + accountId);
            Contact contactRecord = [SELECT Id, AccountId FROM Contact WHERE Id = :contactId LIMIT 1];
            Account accountRecord = [SELECT Name FROM Account WHERE Name = :accountId LIMIT 1];

            if (accountRecord == null || contactRecord == null) {
                throw new AuraHandledException('Account or Contact not found');
            }

            contactRecord.AccountId = accountRecord.Name;
            update contactRecord;
     
        } catch (Exception e) {
            System.debug('Error associating Contact with Account: ' + e.getMessage());
        }
    }
}

// public with sharing class ContactController {
//     @AuraEnabled(cacheable=true)
//     public static List<Contact> GetAllNonAssociatedContacts() {
//         List<Contact> nonAssociatedContracts = new List<Contact>();
//         try {
//             nonAssociatedContracts = [
//                 SELECT Id, Name, Email, MobilePhone
//                 FROM Contact
//             ];

//                     // Iterate over the first 10 contacts and clear their AccountId
//         for(Integer i = 0; i < 10; i++) {
//             System.debug('UPDATE');
//             nonAssociatedContracts[i].AccountId = null;
//             update nonAssociatedContracts[i]; // Update the modified contacts
//         }
//         } catch (Exception e) {
//             System.debug('An error occurred: ' + e.getMessage());
//         }
//         return nonAssociatedContracts;
//     }
// }