#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* next;
};

class Stack {
private:
    Node* top;
public:
    Stack() {
        top = NULL;
    }
    // Push
    void push(int x) {
        Node* temp = new Node();
        temp->data = x;
        temp->next = top;
        top = temp;
    }
    // Pop
    void pop() {
        if (top == NULL) {
            cout << "Stack Underflow\n";
            return;
        }
        Node* temp = top;
        top = top->next;
        delete temp;
    }
    // Peek
    int peek() {
        if (top == NULL) {
            cout << "Stack is empty\n";
            return -1;
        }
        return top->data;
    }
    // isEmpty
    bool isEmpty() {
        return top == NULL;
    }
    // Size
    int size() {
        int count = 0;
        Node* temp = top;
        while (temp != NULL) {
            count++;
            temp = temp->next;
        }
        return count;
    }
};

int main() {
    Stack s;

    s.push(10);
    s.push(20);
    s.push(30);

    cout << "Peek element: " << s.peek() << endl;
    cout << "Size: " << s.size() << endl;

    s.pop();

    cout << "Peek after pop: " << s.peek() << endl;

    cout << "Is Empty: ";
    if (s.isEmpty())
        cout << "Yes\n";
    else
        cout << "No\n";

    cout << "Size: " << s.size() << endl;

    return 0;
}