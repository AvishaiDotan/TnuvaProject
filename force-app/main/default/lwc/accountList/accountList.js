import { LightningElement, api } from 'lwc';

export default class AccountList extends LightningElement {
    @api nonAssociatedContacts;

    onAssociateContact(event) {
        const contactId = event.target.dataset.id;
        const messageEvent = new CustomEvent('associatecontact', { detail: contactId });
        this.dispatchEvent(messageEvent);
    }
}