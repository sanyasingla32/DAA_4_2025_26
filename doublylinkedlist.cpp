#include <iostream>
using namespace std;
class Node
{
public:
int data;
Node *prev;
Node *next;
Node(int value)
{
data = value;
prev = NULL;
next = NULL;
}
};
class DoublyLinkedList
{
private:
Node *head;
public:
DoublyLinkedList()
{
head = NULL;
}
void insertBeginning(int value)
{
Node *newNode = new Node(value);
if (head != NULL)
{
newNode->next = head;
head->prev = newNode;
}
head = newNode;
}
void insertEnd(int value)
{
Node *newNode = new Node(value);
if (head == NULL)
{
head = newNode;
return;
}
Node *temp = head;
while (temp->next != NULL)
{
temp = temp->next;
}
temp->next = newNode;
newNode->prev = temp;
}
void deleteBeginning()
{
if (head == NULL)
{
cout << "List is empty" << endl;
return;
}
Node *temp = head;
head = head->next;
if (head != NULL)
head->prev = NULL;
delete temp;
}
void deleteEnd()
{
if (head == NULL)
{
cout << "List is empty" << endl;
return;
}
if (head->next == NULL)
{
delete head;
head = NULL;
return;
}
Node *temp = head;
while (temp->next != NULL)
{
temp = temp->next;
}
temp->prev->next = NULL;
delete temp;
}
void display()
{
if (head == NULL)
{
cout << "List is empty" << endl;
return;
}
Node *temp = head;
cout << "Doubly Linked List: ";
while (temp != NULL)
{
cout << temp->data << " <-> ";
temp = temp->next;
}
cout << "NULL" << endl;
}
};
int main()
{
DoublyLinkedList dll;
dll.insertBeginning(10);
dll.insertBeginning(5);
dll.insertEnd(20);
dll.insertEnd(30);
dll.display();
dll.deleteBeginning();
dll.display();
dll.deleteEnd();
dll.display();
return 0;
}