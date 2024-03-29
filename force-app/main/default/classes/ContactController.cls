public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> GetAllNonAssociatedContacts() {
        List<Contact> nonAssociatedContracts = new List<Contact>();
        try {
            nonAssociatedContracts = [
                SELECT Id, Name, Email, MobilePhone, Description
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
            Contact[] contactRecord = [SELECT Id, AccountId, MobilePhone,Description, Name  FROM Contact WHERE Id = :contactId LIMIT 1];
            if (contactRecord.size() == 0) {
                throw new AuraHandledException('Contact not found');
            }

            Account[] accountRecord = [SELECT Name, Id FROM Account WHERE Name = :accountId LIMIT 1];
            if (accountRecord.size() == 0) {
                throw new AuraHandledException('Account not found');
            }

            contactRecord[0].AccountId = accountRecord[0].Id;

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