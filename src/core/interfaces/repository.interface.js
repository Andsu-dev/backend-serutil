class RepositoryInterface {
  async create(data) {
    throw new RepositoryError("Method not implemented");
  }

  async setDoc(id, data) {
    throw new RepositoryError("Method not implemented");
  }

  async findById(id) {
    throw new RepositoryError("Method not implemented");
  }

  async findAll(query = {}) {
    throw new RepositoryError("Method not implemented");
  }

  async delete(id) {
    throw new RepositoryError("Method not implemented");
  }
}

module.exports = RepositoryInterface;
