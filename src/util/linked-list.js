class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null; //allows constant time insertLast
  }
  insertFirst(data) {
    //O(1)
    this.head = new _Node(data, this.head);
    if (this.tail === null) {
      this.tail = this.head;
    }
  }
  insertLast(data) {
    //O(1)
    let cur = this.tail;
    if (cur === null) {
      this.insertFirst(data);
    } else {
      this.tail = new _Node(data, null);
      cur.next = this.tail;
    }
  }
  insertAt(data, index) {
    if (index < 0) {
      throw new Error('Index out of bounds');
    }
    if (index === 0) {
      this.insertFirst(data);
      return;
    }
    index--; //otherwise we insert *after* index; [0 1 2] insert 'a' at 1: [0 1 a 2]
    let cur = this.head;
    if (cur === null) {
      //insertAt(foo,0) seems kosher on empty list, but any other index is not ok
      throw new Error('Index out of bounds');
    }
    for (let i = 0; i < index; i++) {
      //doubling memory_value can easily run off the end of the list and this should not be an error, just add at end if so
      if (cur.next === null) {
        this.insertLast(data);
      }
      cur = cur.next;
    }
    cur.next = new _Node(data, cur.next);
  }
  pop() {
    if (this.head === null) return null;
    const first = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return first;
  }
  peek() {
    return this.head ? this.head.value : null;
  }
  find(predicate) {
    let cur = this.head;
    while (cur !== null) {
      if (predicate(cur.value)) return cur.value;
    }
    return null;
  }
}

class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

module.exports = LinkedList;
