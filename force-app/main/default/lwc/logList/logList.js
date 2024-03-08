import { LightningElement, wire, api, track } from 'lwc';
import GetAllCaseLogs from '@salesforce/apex/LogCaseController.GetAllCaseLogs';
import { getRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import RECORD_CHANGE_CHANNEL from '@salesforce/messageChannel/RecordChangeChannel__c';
// Import Case fields that you need
import CASE_ID_FIELD from '@salesforce/schema/Case.CaseNumber';

export default class LogList extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track caseLogs
    caseNumber;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    
    connectedCallback() {
        this.subscribeToChangeEvents();
    }

    subscribeToChangeEvents() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                RECORD_CHANGE_CHANNEL,
                (message) => {
                    // Handle the event received, possibly update the case logs
                    // Refresh case logs after event received
                    refreshApex(this.caseLogs);
                }
            );
        }
    }

    disconnectedCallback() {
        // Unsubscribe from event on component destruction
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    @wire(getRecord, { recordId: '$recordId', fields: [CASE_ID_FIELD] })
    wiredLogCases({ error, data }) {
            if (data) {
                this.caseNumber = data.fields.CaseNumber.value;
                this.setCaseLogs(this.caseNumber);
            } else if (error) {
                console.log('error', error);
            }
        }

    async setCaseLogs(caseNumber) {
        try {
            const data = await GetAllCaseLogs({ caseNumber });
            console.log(data);
            this.caseLogs = data;
        }
        catch (error) {
            console.log('error', error);
        }
    }

    rerender() {
        console.log("Rerender");
    }
}