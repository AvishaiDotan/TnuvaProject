import { LightningElement, api } from 'lwc';

export default class AccountAssociationInputMenu extends LightningElement {
    @api formattedAccount

    handlePhoneChange(event) {
        this.onUpdateAccount('phone', event.target.value);
    }

    handleTypeChange(event) {
        this.onUpdateAccount('type', event.target.value);
    }

    handleDescriptionChange(event) {
        this.onUpdateAccount('description', event.target.value);
    }

    onUpdateAccount(updateType, updateValue) {
        const saveEvent = new CustomEvent('updateaccount', { detail: {
            updateType,
            updateValue
        } });
        this.dispatchEvent(saveEvent);
    }

}