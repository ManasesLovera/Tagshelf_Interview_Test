import WordCount from './wordcount';

class OrderedList<T extends WordCount> {
    private list: T[] = [];

    set(word: string): void {
        const exists = this.list.find(wc => wc.word === word);
        if (exists) {
            exists.count += 1;
        } else {
            this.list.push(new WordCount(word, 1) as T)
        }
        this.list.sort((a, b) => b.count - a.count);
    }

    contains(word: string): boolean {
        return this.list.some(wc => wc.word === word);
    }
    getAll(): T[] {
        return [...this.list];
    }
    delete(word: string): boolean {
        const index = this.list.findIndex(wc => wc.word === word);
        if (index !== -1) {
            this.list.splice(index, 1);
            return true;
        }
        return false;
    }
    get(n: number = this.list.length) {
        return this.list.slice(0, n);
    }
    get count(): number {
        return this.list.length;
    }
}

export default OrderedList;