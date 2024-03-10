# Salesforce LWC Apex Project

Welcome to the Salesforce LWC Apex Project! This project contains various components aimed at enhancing Salesforce functionality through Lightning Web Components (LWC) and Apex code.

## Features

### 1. LWC Case Page Activity Log

The **LWC Case Page Activity Log** component provides a user-friendly interface for viewing activity logs associated with Salesforce cases. It enhances the standard case page by displaying a comprehensive log of activities related to a particular case, providing valuable insights and improving user experience.
![image](https://github.com/AvishaiDotan/TnuvaProject/assets/108017307/a783f9f9-52a3-4b09-9971-f10b58b40599)

### 2. Account Association LWC Component

The **Account Association LWC Component** simplifies the process of associating accounts with various Salesforce Contacts. It offers an intuitive interface within Lightning Experience for users to effortlessly link accounts to relevant contact, streamlining data management and fostering better organization within the Salesforce environment.
![image](https://github.com/AvishaiDotan/TnuvaProject/assets/108017307/564af297-aeec-4ffb-911d-5625c25c91bb)

### 3. 20'000 Rows In A Hit! - Apex Queueable & Database.Batchable<Integer> Classes

The project includes implementation of **Apex Queueable** and **Database.Batchable<Integer>** classes designed to handle batch data insertion efficiently. These classes leverage Salesforce's asynchronous processing capabilities to manage large volumes of data insertion tasks, enhancing performance and scalability for data-intensive operations.









## Tech 

### 1. LWC Case Page Activity Log
- This component leverages the Trigger API to detect changes in a case.
- When a change is detected, the system captures the previous and new values of the changed fields, along with the update date.
- It then creates a `CaseLog` object with fields such as `PrevValue`, `NewValue`, `Field`, and `UpdateDate`.
- After creating the `CaseLog` object, it is inserted into the Salesforce database.
- Additionally, a platform event is triggered to notify other components that may need to refresh and render with the new data.

### 2. Account Association LWC Component
- The component utilizes built-in Salesforce APIs such as `recordId`, `getRecord`, and `getFieldValue` to retrieve environment variables, determining which account is being referenced.
- It employs a custom controller to retrieve unbound contacts and render them as an `AccountList`.
- The built-in Toast Service is utilized to display user messages for successful and failed attempts at connecting contacts to accounts.
- Custom JavaScript events are used to facilitate data communication between components.

