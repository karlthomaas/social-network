import { UserType } from '@/providers/user-provider';
import { Contact } from './contact';

const Contacts: UserType[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: '',
    about_me: '',
    date_of_birth: '',
    nickname: '',
    privacy: '',
    image: null,
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Doe',
    email: '',
    about_me: '',
    date_of_birth: '',
    nickname: '',
    privacy: '',
    image: null,
  },
  {
    id: '3',
    first_name: 'John',
    last_name: 'Smith',
    email: '',
    about_me: '',
    date_of_birth: '',
    nickname: '',
    privacy: '',
    image: null,
  },
];

export const ContactList = () => {
  return (
    <div className='h-max m-4 w-[350px] rounded-lg border border-border flex flex-col space-y-6'>
      <h1 className='pl-4 pt-4'>Contact list</h1>
      {Contacts.map((contact) => (
        <Contact key={contact.id} user={contact} />
      ))}
    </div>
  );
};
