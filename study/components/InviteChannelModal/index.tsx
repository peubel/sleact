import React, { FC, useCallback } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SingUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcehr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const [newMember, onChangeNewMember, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const {
    mutate,
  } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher);

  const onInviteMember = useCallback((e: any) => {
    e.preventDefault();

    if (!newMember && !newMember.trim()) {
      return;
    }

    axios
      .post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
        email: newMember,
      }, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
        setShowInviteChannelModal(false);
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [newMember]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id='member-label'>
          <span>채널 멤버 초대</span>
          <Input id='member' value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type='submit'>초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;