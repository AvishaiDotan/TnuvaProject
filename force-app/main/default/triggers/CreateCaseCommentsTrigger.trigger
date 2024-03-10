trigger CreateCaseCommentsTrigger on Case (after insert) {

    // Method to enqueue CaseCommentQueueable for each Case
    public void enqueueCaseCommentQueueable(List<Case> newCases) {
        for (Case c : newCases) {
            System.enqueueJob(new CaseCommentQueueable(c));
        }
    }

    if (Trigger.isAfter && Trigger.isInsert) {
        enqueueCaseCommentQueueable(Trigger.new);
    }
}