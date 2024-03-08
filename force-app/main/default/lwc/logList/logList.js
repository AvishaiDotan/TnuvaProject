import { LightningElement, wire, api, track } from 'lwc';
import GetAllCaseLogs from '@salesforce/apex/LogCaseController.GetAllCaseLogs';

export default class LogList extends LightningElement {
    @api recordId;
    @track caseLogs


    // @wire(GetAllCaseLogs, { id: this.recordId })
    // wiredLogCases({ error, data }) {
    //     if (data) {
    //         this.caseLogs = data;
    //     } else if (error) {
    //         console.log('error', error);
    //     }
    // }

    async setCaseLogs(recordId) {
        console.log("setCaseLogs");
        try {
            const data = await GetAllCaseLogs({ id: null });
            console.log(data);
            this.caseLogs = data;
        }
        catch (error) {
            console.log('error', error);
        }
    }

    connectedCallback() {
        console.log('record id', this.recordId);
        this.setCaseLogs(this.recordId);
        console.log("after");
    }
}