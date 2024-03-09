import { LightningElement, wire, api, track } from 'lwc';
import GetAllCaseLogs from '@salesforce/apex/LogCaseController.GetAllCaseLogs';
import { getRecord } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe} from 'lightning/empApi';
import CASE_ID_FIELD from '@salesforce/schema/Case.CaseNumber';

export default class LogList extends LightningElement {
    @api recordId;
    @api objectApiName;
    @track caseLogs
    caseNumber;


    subscription = null;


    
    connectedCallback() {
        this.subscribeToTriggerEvent();
    }

    disconnectedCallback() {
        this.unsubscribeToTriggerEvent();
    }

    // disconnectedCallback() {
    //     unsubscribeToTriggerEvent();
    //     this.subscription = null;
    // }

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
            this.caseLogs = data;
        }
        catch (error) {
            console.log('error', error);
        }
    }

    subscribeToTriggerEvent() {
        const messageCallback = async (response) => {
            var caseNum = response.data.payload.CaseNumber__c;
            await this.setCaseLogs(caseNum);
        };

        subscribe('/event/CaseLogInserted__e', -1, messageCallback).then(response => {
            this.subscription = response;
        });
    }

    unsubscribeToTriggerEvent() {
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', response);
        });
    }

    
}