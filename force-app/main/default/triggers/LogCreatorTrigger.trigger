trigger LogCreatorTrigger on Case (after update) {
   System.debug("Triggered");
}