export default class GameQueue {
  private queue: any[] = [];

  enqueue(item: any) {
    this.queue.push(item);
  }

  dequeue() {
    if (this.queue.length === 0) {
      return null;
    }
    return this.queue.shift();
  }

  get length() {
    return this.queue.length;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  removeAndCheckExistence(item: string): boolean {
    const index = this.queue.indexOf(item);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }
}
