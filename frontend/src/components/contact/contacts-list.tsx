import { Contact } from "./contact";

export const ContactList = () => {
    return (
        <div className="sticky top-4 w-[350px] h-full border border-border rounded-xl m-4 p-4">
            <h1 className="text-xl font-medium">Contact list</h1>
            {contacts.map(contact => <Contact key={contact.id} {...contact} />)}
        </div>
    )
};

const contacts = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe'
    },
    {
        id: '3',
        firstName: 'Alice',
        lastName: 'Smith'
    },
    {
        id: '4',
        firstName: 'Bob',
        lastName: 'Smith'
    },
    {
        id: '5',
        firstName: 'Charlie',
        lastName: 'Brown'
    },
    {
        id: '6',
        firstName: 'Lucy',
        lastName: 'Brown'
    },
    {
        id: '7',
        firstName: 'Tom',
        lastName: 'Johnson'
    },
    {
        id: '8',
        firstName: 'Jerry',
        lastName: 'Johnson'
    },
    {
        id: '9',
        firstName: 'Mickey',
        lastName: 'Mouse'
    },
    {
        id: '10',
        firstName: 'Minnie',
        lastName: 'Mouse'
    },
]
