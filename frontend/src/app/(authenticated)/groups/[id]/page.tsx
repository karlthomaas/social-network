'use client';

import { useEffect, useState } from 'react';

import { GroupDetails } from './_components/group-details';
import { GroupMemberView } from './_components/group-member-view';
import { GroupNotMemberView } from './_components/group-not-member-view';

import { useGetGroupMemberStatusQuery, useGetGroupDetailsQuery } from '@/services/backend/actions/groups';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { selectRole, setRole } from '@/features/groups/groupsSlice';

export default function GroupPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const role = useAppSelector((state) => selectRole(state, params.id));

  const groupQuery = useGetGroupDetailsQuery(params.id);
  const isMemberQuery = useGetGroupMemberStatusQuery(params.id, { skip: !groupQuery.data ?? skipToken });

  useEffect(() => {
    if (isMemberQuery.data) {
      dispatch(setRole({ groupId: params.id, role: 'member' }));
    }
  }, [isMemberQuery.data, params.id, dispatch]);

  useEffect(() => {
    if (groupQuery.data && user?.id === groupQuery.data.group.user_id) {
      dispatch(setRole({ groupId: params.id, role: 'owner' }));
    }
  }, [groupQuery.data, params.id, dispatch, user?.id]);

  if (groupQuery.isLoading || isMemberQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!groupQuery.data) {
    return <div>Group not found</div>;
  }

  return (
    <div className='flex flex-col space-y-5'>
      <GroupDetails id={params.id} />
      {role === 'member' || role === 'owner' ? <GroupMemberView id={params.id} /> : <GroupNotMemberView id={params.id} />}
    </div>
  );
}
