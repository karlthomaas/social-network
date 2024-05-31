import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { capitalize } from '@/lib/utils';
import { useUpdatePrivacyMutation } from '@/services/backend/backendApi';

export type PrivacyStates = 'public' | 'private';

export const PrivacyBtn = ({ privacy_state }: { privacy_state: 'public' | 'private' }) => {
  const [privacyState, setPrivacyState] = useState(privacy_state);
  const [updatePrivacy] = useUpdatePrivacyMutation();

  const handleClick = async () => {
    const newPrivacyState = privacyState === 'public' ? 'private' : 'public';
    setPrivacyState(newPrivacyState);
    await updatePrivacy(newPrivacyState);
  };

  return (
    <Button variant='outline' onClick={handleClick}>
      {capitalize(privacyState)}
    </Button>
  );
};
