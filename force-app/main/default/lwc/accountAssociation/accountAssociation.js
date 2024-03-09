import { LightningElement, wire, track, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import GetAllNonAssociatedContacts from '@salesforce/apex/ContactController.GetAllNonAssociatedContacts';
import AssociateContactToAccount from '@salesforce/apex/ContactController.AssociateContactToAccount';
import PutAccount from '@salesforce/apex/AccountController.PutAccount';

import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_DESCRIPTION_FIELD from '@salesforce/schema/Account.Description';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_ID_FIELD from '@salesforce/schema/Account.Id';

export default class AccountAssociation extends LightningElement {
    @api recordId;

    @track formattedAccount = {
        phone: '',
        type: '',
        description: ''
    };

    accountName;
    accountId

    @track nonAssociatedContacts;

    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_ID_FIELD, ACCOUNT_NAME_FIELD, ACCOUNT_PHONE_FIELD, ACCOUNT_TYPE_FIELD, ACCOUNT_DESCRIPTION_FIELD] })
    wiredRecord({ error, data }) {
        if (data) {
            this.setFormattedAccountDetails(data);
            this.accountName = getFieldValue(data, ACCOUNT_NAME_FIELD);
            this.accountId = getFieldValue(data, ACCOUNT_ID_FIELD);
        } else if (error) {
            console.error('Error fetching account data:', error);
        }

    };

    @wire(GetAllNonAssociatedContacts)
    wiredAssociatedContacts({ error, data }) {
        if (data) {
            this.nonAssociatedContacts = data;
        } else if (error) {
            console.error('Error fetching account data:', error);
        }

    };

    async onAssociateContact(event) {
        try {
            
            await AssociateContactToAccount({ accountId: this.accountName, contactId: event.detail.contactId });
            var selectedContact = this.nonAssociatedContacts.find(contact => contact.Id === event.detail.contactId);
            if (!selectedContact) 
                throw new Error('Contact not found');

            const newFormattedAccount = {  
                phone: selectedContact.MobilePhone,
                type: this.formattedAccount.type,
                description: selectedContact.description || selectedContact.Name
             }


            await PutAccount({ accountId: this.accountId, fieldUpdates: newFormattedAccount });

            this.formattedAccount = newFormattedAccount;
            const toastEvent = new ShowToastEvent({
                title: 'Account Association',
                message:
                    'The contact has been associated with the account.',
                    variant: 'success',
            });
            this.dispatchEvent(toastEvent);

            this.nonAssociatedContacts = this.nonAssociatedContacts.filter(contact => contact.Id !== event.detail.contactId);
            
        }
        catch (e) {
            console.log(e);
            const toastevent = new ShowToastEvent({
                title: 'Account Association',
                message:
                    'Failed to associate the contact with the account. Please try again.',
                    variant: 'error',
            });
            this.dispatchEvent(toastevent);
        }
    }

    async handleUpdateAccount(event) {
        const fieldUpdates = { }
        try {
            switch (event.detail.updateType) {
                case 'phone':
                    this.formattedAccount.phone = event.detail.updateValue;
                    break;
                case 'type':
                    this.formattedAccount.type = event.detail.updateValue;
                    break;
                case 'description':
                    this.formattedAccount.description = event.detail.updateValue;
                    break;
            }

            fieldUpdates[event.detail.updateType] = event.detail.updateValue;
            await PutAccount({ accountId: this.accountId, fieldUpdates });
        }
        catch (e) {
            console.log(e);
        }
    }


    setFormattedAccountDetails(data) {
        this.formattedAccount = {
            phone: getFieldValue(data, ACCOUNT_PHONE_FIELD),
            type: getFieldValue(data, ACCOUNT_TYPE_FIELD),
            description: getFieldValue(data, ACCOUNT_DESCRIPTION_FIELD)
        };
    }
}
