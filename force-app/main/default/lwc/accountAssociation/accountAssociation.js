import { LightningElement, wire, track, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_DESCRIPTION_FIELD from '@salesforce/schema/Account.Description';

export default class AccountAssociation extends LightningElement {
    @api recordId;

    @track formattedAccount = {
        phone: '',
        type: '',
        description: ''
    };

    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNT_PHONE_FIELD, ACCOUNT_TYPE_FIELD, ACCOUNT_DESCRIPTION_FIELD] })
    wiredRecord({ error, data }) {
        if (data) {
            this.setFormattedAccountDetails(data);
        } else if (error) {
            console.error('Error fetching account data:', error);
        }

    };



    setFormattedAccountDetails(data) {
        this.formattedAccount = {
            phone: getFieldValue(data, ACCOUNT_PHONE_FIELD),
            type: getFieldValue(data, ACCOUNT_TYPE_FIELD),
            description: getFieldValue(data, ACCOUNT_DESCRIPTION_FIELD)
        };
    }
}
