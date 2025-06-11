const FirebaseRepository = require("../../../infra/repositories/firebase.repository");

class ClickUpTaskRepository extends FirebaseRepository {
  constructor() {
    super("tasks");
  }
}

module.exports = ClickUpTaskRepository;
