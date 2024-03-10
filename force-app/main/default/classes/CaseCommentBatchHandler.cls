global with sharing class CaseCommentBatchHandler implements Database.Batchable<sObject> {

    global final Case parentCase;

    global CaseCommentBatchHandler(Case c) {
        parentCase = c;
    }

    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator([SELECT Id FROM Case WHERE Id = :parentCase.Id]);
    }

    global void execute(Database.BatchableContext BC, List<Case> scope) {
        List<CaseComment> caseCommentsToInsert = new List<CaseComment>();
        for(Integer i = 0; i < 5000; i++) {
            CaseComment newComment = new CaseComment();
            newComment.ParentId = parentCase.Id;
            newComment.CommentBody = 'Comment ' + String.valueOf(i);
            caseCommentsToInsert.add(newComment);
        }

        if(!caseCommentsToInsert.isEmpty()) {
            Database.insert(caseCommentsToInsert, false);
        }
    }

    global void finish(Database.BatchableContext BC) {
    }
}