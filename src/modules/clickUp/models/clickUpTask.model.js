const { convertTimestampToISO } = require("../../../utils/date.utils");

class ClickUpTask {
  constructor({ id, name, description, status, start_date, due_date }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.start_date = start_date;
    this.due_date = due_date;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      start_date: convertTimestampToISO(this.start_date),
      due_date: convertTimestampToISO(this.due_date),
    };
  }

  static fromClickUpResponse(response) {
    return new ClickUpTask({
      id: response.id,
      name: response.name,
      description: response.description,
      status: response.status.status,
      start_date: response.start_date,
      due_date: response.due_date,
    });
  }
}

module.exports = ClickUpTask;
