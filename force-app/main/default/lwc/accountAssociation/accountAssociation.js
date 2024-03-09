import { LightningElement, wire, track, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import GetAllNonAssociatedContacts from '@salesforce/apex/ContactController.GetAllNonAssociatedContacts';
import AssociateContactToAccount from '@salesforce/apex/ContactController.AssociateContactToAccount';

import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_DESCRIPTION_FIELD from '@salesforce/schema/Account.Description';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';

export default class AccountAssociation extends LightningElement {
    @api recordId;

    @track formattedAccount = {
        phone: '',
        type: '',
        description: ''
    };

    accountName;

    @track nonAssociatedContacts;

    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_NAME_FIELD, ACCOUNT_PHONE_FIELD, ACCOUNT_TYPE_FIELD, ACCOUNT_DESCRIPTION_FIELD] })
    wiredRecord({ error, data }) {
        if (data) {
            this.setFormattedAccountDetails(data);
            this.accountName = getFieldValue(data, ACCOUNT_NAME_FIELD);
        } else if (error) {
            console.error('Error fetching account data:', error);
        }

    };

    @wire(GetAllNonAssociatedContacts)
    wiredAssociatedContacts({ error, data }) {
        if (data) {
            console.log('GetAllNonAssociatedContacts:', data);
            this.nonAssociatedContacts = data;
        } else if (error) {
            console.error('Error fetching account data:', error);
        }

    };

    async onAssociateContact(event) {
        try {
            console.log('event.detail.contactId:', event.detail.contactId);
            console.log('this.accountName:', this.accountName);
            await AssociateContactToAccount({ accountId: this.accountName, contactId: event.detail.contactId });
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
