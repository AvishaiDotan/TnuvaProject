public class CaseCommentQueueable implements Queueable, Database.Batchable<Integer> {
    
    private static final Integer BATCH_SIZE = 200;
    
    private Case caseRecord;
    
    public CaseCommentQueueable(Case caseRecord) {
        this.caseRecord = caseRecord;
    }
    
    public void execute(QueueableContext context) {
        Database.executeBatch(this, BATCH_SIZE);
    }
    
    public Iterable<Integer> start(Database.BatchableContext context) {
        List<Integer> iterable = new List<Integer>();
        for (Integer i = 0; i < 20000; i++) {
            iterable.add(i);
        }
        return iterable;
    }
    
    public void execute(Database.BatchableContext context, List<Integer> scope) {
        List<CaseComment> commentsToInsert = new List<CaseComment>();
        
        for (Integer i : scope) {
            CaseComment comment = new CaseComment(
                ParentId = caseRecord.Id,
                CommentBody = 'Comment ' + i
            );
            commentsToInsert.add(comment);
        }
        
        insert commentsToInsert;
    }
    
    public void finish(Database.BatchableContext context) {
    }
}